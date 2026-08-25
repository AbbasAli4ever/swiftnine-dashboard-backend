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
  TRANSACTION_LOCAL_ACCOUNT_CURRENCY,
  TRANSACTION_NOT_FOUND,
  TRANSACTION_REF_ID_TAKEN,
  TRANSACTION_SELECT,
} from './transaction.constants';
import type { CreateTransactionDto } from './dto/create-transaction.dto';
import type { UpdateTransactionDto } from './dto/update-transaction.dto';
import type { ListTransactionsQuery } from './dto/list-transactions-query.dto';

type RawTransactionData = Prisma.TransactionGetPayload<{
  select: typeof TRANSACTION_SELECT;
}>;

export type TransactionData = Omit<RawTransactionData, 'saleAmount'> & {
  saleAmount: number;
};

function toTransactionData(row: RawTransactionData): TransactionData {
  return {
    ...row,
    saleAmount: Number(row.saleAmount),
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
  constructor(private readonly prisma: PrismaService) {}

  async create(
    workspaceId: string,
    dto: CreateTransactionDto,
  ): Promise<TransactionData> {
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

    const transaction = await this.prisma.transaction.create({
      data: {
        workspaceId,
        clientId: client.id,
        clientName: client.clientName,
        bankAccountId: dto.bankAccountId,
        saleAmount: dto.saleAmount,
        currency: dto.currency,
        saleDate: dto.saleDate ? new Date(dto.saleDate) : new Date(),
        refId: dto.refId,
        description: dto.description,
      },
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

    if (Object.keys(updateData).length === 0) return transaction;

    const updated = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: updateData,
      select: TRANSACTION_SELECT,
    });
    return toTransactionData(updated);
  }

  async remove(workspaceId: string, transactionId: string): Promise<void> {
    // Looked up (and discarded) purely to scope the delete to this
    // workspace — `transaction.delete` can only filter by `id`, so skipping
    // this check would let a caller delete another workspace's row by
    // guessing its id.
    await this.findTransactionOrThrow(workspaceId, transactionId);
    await this.prisma.transaction.delete({ where: { id: transactionId } });
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
