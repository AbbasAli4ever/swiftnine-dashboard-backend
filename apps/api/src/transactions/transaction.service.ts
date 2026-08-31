import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import type {
  AccountType,
  Currency,
} from '@app/database/generated/prisma/enums';
import {
  BANK_ACCOUNT_NOT_FOUND,
  CLIENT_NOT_FOUND,
  EMPLOYEE_NOT_FOUND,
  TRANSACTION_LOCAL_ACCOUNT_CURRENCY,
  TRANSACTION_NOT_FOUND,
  TRANSACTION_REF_ID_TAKEN,
  TRANSACTION_SELECT,
} from './transaction.constants';
import type { CreateTransactionDto } from './dto/create-transaction.dto';
import type { UpdateTransactionDto } from './dto/update-transaction.dto';
import type { ListTransactionsQuery } from './dto/list-transactions-query.dto';
import { ExchangeRateService } from '../exchange-rate/exchange-rate.service';

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

type RawTransactionData = Prisma.TransactionGetPayload<{
  select: typeof TRANSACTION_SELECT;
}>;

export type TransactionData = Omit<
  RawTransactionData,
  'saleAmount' | 'commissionAmount'
> & {
  saleAmount: number;
  commissionAmount: number;
};

function toTransactionData(row: RawTransactionData): TransactionData {
  return {
    ...row,
    saleAmount: Number(row.saleAmount),
    commissionAmount: Number(row.commissionAmount),
  };
}

export type TransactionListResult = {
  items: TransactionData[];
  total: number;
  page: number;
  limit: number;
};

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  async create(
    workspaceId: string,
    dto: CreateTransactionDto,
  ): Promise<TransactionData> {
    await this.exchangeRateService.refresh();
    const existing = await this.prisma.transaction.findFirst({
      where: { workspaceId, refId: dto.refId },
      select: { id: true },
    });
    if (existing) throw new ConflictException(TRANSACTION_REF_ID_TAKEN);

    const client = await this.findClientOrThrow(workspaceId, dto.clientId);
    // Existence/workspace-scope check, plus the one remaining currency rule:
    // a LOCAL account (Pakistan) only ever takes PKR — INTERNATIONAL
    // accounts (Whop, Slash, ...) take any currency interchangeably.
    const bankAccount = await this.findBankAccountOrThrow(
      workspaceId,
      dto.bankAccountId,
    );
    this.assertLocalAccountCurrency(bankAccount.accountType, dto.currency);

    if (dto.employeeId !== undefined) {
      await this.findEmployeeOrThrow(workspaceId, dto.employeeId);
    }
    // commissionAmount is entered in commissionCurrency (defaults to PKR)
    // but Transaction.commissionAmount is always PKR — converted once, here,
    // and only the PKR figure is ever persisted.
    const commissionAmount = dto.commissionAmount
      ? round2(
          this.exchangeRateService.convert(
            dto.commissionAmount,
            dto.commissionCurrency,
            'PKR',
          ),
        )
      : 0;

    const createData = {
      workspaceId,
      clientId: client.id,
      clientName: client.clientName,
      bankAccountId: dto.bankAccountId,
      saleAmount: dto.saleAmount,
      currency: dto.currency,
      saleDate: dto.saleDate ? new Date(dto.saleDate) : new Date(),
      refId: dto.refId,
      description: dto.description,
      employeeId: dto.employeeId,
      commissionAmount,
    };

    // Commission only ever moves into pendingCommission at creation — never
    // reversed or reapplied on a later update/delete. If the commission was
    // wrong, correct it directly via PATCH /employees/:id, the same manual
    // path every other commission edit already goes through.
    const transaction =
      dto.employeeId && commissionAmount > 0
        ? (
            await this.prisma.$transaction([
              this.prisma.transaction.create({
                data: createData,
                select: TRANSACTION_SELECT,
              }),
              this.prisma.employee.update({
                where: { id: dto.employeeId },
                data: { pendingCommission: { increment: commissionAmount } },
              }),
            ])
          )[0]
        : await this.prisma.transaction.create({
            data: createData,
            select: TRANSACTION_SELECT,
          });
    return toTransactionData(transaction);
  }

  async findAll(
    workspaceId: string,
    query: ListTransactionsQuery,
  ): Promise<TransactionListResult> {
    const where: Prisma.TransactionWhereInput = { workspaceId };

    if (query.q) {
      where.OR = [
        { clientName: { contains: query.q, mode: 'insensitive' } },
        { refId: { contains: query.q, mode: 'insensitive' } },
      ];
    }
    if (query.clientId) {
      where.clientId = query.clientId;
    }
    if (query.bankAccountId) {
      where.bankAccountId = query.bankAccountId;
    }
    if (query.accountType?.length) {
      // accountType lives on BankAccount, not Transaction — a relational
      // filter, not a plain column match.
      where.bankAccount = {
        accountType: { in: query.accountType as AccountType[] },
      };
    }
    if (query.currency?.length) {
      where.currency = { in: query.currency as Currency[] };
    }
    if (query.dateFrom || query.dateTo) {
      where.saleDate = {
        ...(query.dateFrom
          ? { gte: this.parseDateBoundary(query.dateFrom, 'start') }
          : {}),
        ...(query.dateTo
          ? { lte: this.parseDateBoundary(query.dateTo, 'end') }
          : {}),
      };
    }

    const skip = (query.page - 1) * query.limit;

    const [total, items] = await Promise.all([
      this.prisma.transaction.count({ where }),
      this.prisma.transaction.findMany({
        where,
        select: TRANSACTION_SELECT,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
    ]);

    return {
      items: items.map(toTransactionData),
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  async findOne(
    workspaceId: string,
    transactionId: string,
  ): Promise<TransactionData> {
    return this.findTransactionOrThrow(workspaceId, transactionId);
  }

  async update(
    workspaceId: string,
    transactionId: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionData> {
    await this.exchangeRateService.refresh();
    const transaction = await this.findTransactionOrThrow(
      workspaceId,
      transactionId,
    );

    const updateData: Prisma.TransactionUpdateInput = {};
    if (dto.clientId !== undefined) {
      await this.findClientOrThrow(workspaceId, dto.clientId);
      updateData.client = { connect: { id: dto.clientId } };
    }
    if (dto.clientName !== undefined) updateData.clientName = dto.clientName;
    if (dto.saleDate !== undefined)
      updateData.saleDate = new Date(dto.saleDate);
    if (dto.description !== undefined) updateData.description = dto.description;

    // bankAccountId and currency no longer constrain each other exactly
    // (any currency is fine on an INTERNATIONAL account), but the
    // LOCAL-account-must-be-PKR rule still has to hold for whichever
    // account/currency pair the transaction ends up with. Whichever one of
    // the two is changing gets checked against the other's effective
    // (new-or-existing) value; if neither changes there's nothing to
    // re-validate.
    if (dto.bankAccountId !== undefined) {
      const bankAccount = await this.findBankAccountOrThrow(
        workspaceId,
        dto.bankAccountId,
      );
      this.assertLocalAccountCurrency(
        bankAccount.accountType,
        dto.currency ?? transaction.currency,
      );
      updateData.bankAccount = { connect: { id: dto.bankAccountId } };
    } else if (dto.currency !== undefined) {
      const bankAccount = await this.findBankAccountOrThrow(
        workspaceId,
        transaction.bankAccountId,
      );
      this.assertLocalAccountCurrency(bankAccount.accountType, dto.currency);
    }
    if (dto.saleAmount !== undefined) updateData.saleAmount = dto.saleAmount;
    if (dto.currency !== undefined) updateData.currency = dto.currency;

    // employeeId/commissionAmount are validated as a pair by the DTO itself
    // (both provided or neither) — no cross-check against the existing row
    // needed here.
    if (dto.employeeId !== undefined) {
      if (dto.employeeId !== null) {
        await this.findEmployeeOrThrow(workspaceId, dto.employeeId);
        updateData.employee = { connect: { id: dto.employeeId } };
      } else {
        updateData.employee = { disconnect: true };
      }
    }
    // commissionAmount is entered in commissionCurrency (defaults to PKR)
    // but Transaction.commissionAmount is always PKR — converted once, here.
    const commissionAmountPkr =
      dto.commissionAmount !== undefined
        ? round2(
            this.exchangeRateService.convert(
              dto.commissionAmount,
              dto.commissionCurrency ?? 'PKR',
              'PKR',
            ),
          )
        : undefined;
    if (commissionAmountPkr !== undefined) {
      updateData.commissionAmount = commissionAmountPkr;
    }

    if (Object.keys(updateData).length === 0) return transaction;

    // Keeps Employee.pendingCommission in sync with whatever this
    // transaction currently says: reverses the old employee/amount and
    // applies the new one, in the same atomic write as the transaction
    // update itself.
    const effectiveEmployeeId =
      dto.employeeId !== undefined ? dto.employeeId : transaction.employeeId;
    const effectiveCommissionAmount =
      commissionAmountPkr !== undefined
        ? commissionAmountPkr
        : transaction.commissionAmount;
    const commissionAdjustments = this.commissionAdjustments(
      transaction.employeeId,
      transaction.commissionAmount,
      effectiveEmployeeId,
      effectiveCommissionAmount,
    );

    const [updated] = await this.prisma.$transaction([
      this.prisma.transaction.update({
        where: { id: transactionId },
        data: updateData,
        select: TRANSACTION_SELECT,
      }),
      ...commissionAdjustments.map(({ employeeId, delta }) =>
        this.prisma.employee.update({
          where: { id: employeeId },
          data: { pendingCommission: { increment: delta } },
        }),
      ),
    ]);
    return toTransactionData(updated);
  }

  async remove(workspaceId: string, transactionId: string): Promise<void> {
    // Also used to reverse this transaction's commission, if it has one —
    // not just to scope the delete to this workspace (transaction.delete
    // can only filter by id, so skipping this lookup would let a caller
    // delete another workspace's row by guessing its id).
    const transaction = await this.findTransactionOrThrow(
      workspaceId,
      transactionId,
    );
    const commissionAdjustments = this.commissionAdjustments(
      transaction.employeeId,
      transaction.commissionAmount,
      null,
      0,
    );

    await this.prisma.$transaction([
      this.prisma.transaction.delete({ where: { id: transactionId } }),
      ...commissionAdjustments.map(({ employeeId, delta }) =>
        this.prisma.employee.update({
          where: { id: employeeId },
          data: { pendingCommission: { increment: delta } },
        }),
      ),
    ]);
  }

  // Reverses the old (employeeId, commissionAmount) pair and applies the
  // new one — same employee with a changed amount nets to a single delta;
  // a changed (or cleared) employee reverses the old one and applies the
  // new one independently. Returns no-op (empty array) when nothing
  // actually changed.
  private commissionAdjustments(
    oldEmployeeId: string | null,
    oldCommissionAmount: number,
    newEmployeeId: string | null,
    newCommissionAmount: number,
  ): Array<{ employeeId: string; delta: number }> {
    if (oldEmployeeId === newEmployeeId) {
      if (oldEmployeeId && newCommissionAmount !== oldCommissionAmount) {
        return [
          {
            employeeId: oldEmployeeId,
            delta: newCommissionAmount - oldCommissionAmount,
          },
        ];
      }
      return [];
    }

    const adjustments: Array<{ employeeId: string; delta: number }> = [];
    if (oldEmployeeId && oldCommissionAmount > 0) {
      adjustments.push({
        employeeId: oldEmployeeId,
        delta: -oldCommissionAmount,
      });
    }
    if (newEmployeeId && newCommissionAmount > 0) {
      adjustments.push({
        employeeId: newEmployeeId,
        delta: newCommissionAmount,
      });
    }
    return adjustments;
  }

  private async findTransactionOrThrow(
    workspaceId: string,
    transactionId: string,
  ): Promise<TransactionData> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id: transactionId, workspaceId },
      select: TRANSACTION_SELECT,
    });
    if (!transaction) throw new NotFoundException(TRANSACTION_NOT_FOUND);
    return toTransactionData(transaction);
  }

  private parseDateBoundary(value: string, boundary: 'start' | 'end'): Date {
    const parsed = new Date(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      parsed.setUTCHours(
        boundary === 'start' ? 0 : 23,
        boundary === 'start' ? 0 : 59,
        boundary === 'start' ? 0 : 59,
        boundary === 'start' ? 0 : 999,
      );
    }
    return parsed;
  }

  private async findClientOrThrow(
    workspaceId: string,
    clientId: string,
  ): Promise<{ id: string; clientName: string }> {
    const client = await this.prisma.clients.findFirst({
      where: { id: clientId, workspaceId },
      select: { id: true, clientName: true },
    });
    if (!client) throw new NotFoundException(CLIENT_NOT_FOUND);
    return client;
  }

  private async findEmployeeOrThrow(
    workspaceId: string,
    employeeId: string,
  ): Promise<{ id: string }> {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, workspaceId },
      select: { id: true },
    });
    if (!employee) throw new NotFoundException(EMPLOYEE_NOT_FOUND);
    return employee;
  }

  private async findBankAccountOrThrow(
    workspaceId: string,
    bankAccountId: string,
  ): Promise<{ id: string; accountType: AccountType }> {
    const bankAccount = await this.prisma.bankAccount.findFirst({
      where: { id: bankAccountId, workspaceId },
      select: { id: true, accountType: true },
    });
    if (!bankAccount) throw new NotFoundException(BANK_ACCOUNT_NOT_FOUND);
    return bankAccount;
  }

  // The one remaining currency constraint: LOCAL accounts (Pakistan) only
  // ever hold PKR, so a transaction routed through one must be PKR too.
  // INTERNATIONAL accounts (Whop, Slash, ...) have no such restriction —
  // any currency is fine, and doesn't have to match the account's own
  // currencyType either (see the decoupling follow-up in the changelog).
  private assertLocalAccountCurrency(
    accountType: AccountType,
    currency: Currency,
  ): void {
    if (accountType === 'LOCAL' && currency !== 'PKR') {
      throw new BadRequestException(TRANSACTION_LOCAL_ACCOUNT_CURRENCY);
    }
  }

  // Client is now required to already exist (clientId comes straight from
  // the payload) — auto-creating one by name is no longer used, kept here
  // in case we need to bring it back.
  // private async findOrCreateClientByName(
  //   clientName: string,
  // ): Promise<{ id: string }> {
  //   const existing = await this.prisma.clients.findFirst({
  //     where: { clientName },
  //     select: { id: true },
  //   });
  //   if (existing) return existing;
  //
  //   return this.prisma.clients.create({
  //     data: { clientName, totalRevenue: 0 },
  //     select: { id: true },
  //   });
  // }
}
