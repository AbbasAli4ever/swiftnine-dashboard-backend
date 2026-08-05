import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import type {
  AccountType,
  Currency,
} from '@app/database/generated/prisma/enums';
import {
  BANK_ACCOUNT_NOT_FOUND,
  BANK_ACCOUNT_SELECT,
} from './bank-account.constants';
import type { CreateBankAccountDto } from './dto/create-bank-account.dto';
import type { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import type { ListBankAccountsQuery } from './dto/list-bank-accounts-query.dto';

type RawBankAccountData = Prisma.BankAccountGetPayload<{
  select: typeof BANK_ACCOUNT_SELECT;
}>;

export type BankAccountData = Omit<RawBankAccountData, 'amount'> & {
  amount: number;
};

function toBankAccountData(row: RawBankAccountData): BankAccountData {
  return { ...row, amount: Number(row.amount) };
}

export type BankAccountListResult = {
  items: BankAccountData[];
  total: number;
  page: number;
  limit: number;
};

@Injectable()
export class BankAccountService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBankAccountDto): Promise<BankAccountData> {
    const bankAccount = await this.prisma.bankAccount.create({
      data: {
        bankName: dto.bankName,
        accountType: dto.accountType,
        currencyType: dto.currencyType,
        amount: dto.amount,
      },
      select: BANK_ACCOUNT_SELECT,
    });
    return toBankAccountData(bankAccount);
  }

  async findAll(query: ListBankAccountsQuery): Promise<BankAccountListResult> {
    const where: Prisma.BankAccountWhereInput = {};

    if (query.q) {
      where.bankName = { contains: query.q, mode: 'insensitive' };
    }
    if (query.accountType?.length) {
      where.accountType = { in: query.accountType as AccountType[] };
    }
    if (query.currencyType?.length) {
      where.currencyType = { in: query.currencyType as Currency[] };
    }

    const skip = (query.page - 1) * query.limit;

    const [total, items] = await Promise.all([
      this.prisma.bankAccount.count({ where }),
      this.prisma.bankAccount.findMany({
        where,
        select: BANK_ACCOUNT_SELECT,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
    ]);

    return {
      items: items.map(toBankAccountData),
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  async findOne(bankAccountId: string): Promise<BankAccountData> {
    return this.findBankAccountOrThrow(bankAccountId);
  }

  async update(
    bankAccountId: string,
    dto: UpdateBankAccountDto,
  ): Promise<BankAccountData> {
    const bankAccount = await this.findBankAccountOrThrow(bankAccountId);
    const updateData: Prisma.BankAccountUpdateInput = {};

    if (dto.bankName !== undefined) updateData.bankName = dto.bankName;
    if (dto.accountType !== undefined) updateData.accountType = dto.accountType;
    if (dto.currencyType !== undefined)
      updateData.currencyType = dto.currencyType;
    if (dto.amount !== undefined) updateData.amount = dto.amount;

    if (Object.keys(updateData).length === 0) return bankAccount;

    const updated = await this.prisma.bankAccount.update({
      where: { id: bankAccountId },
      data: updateData,
      select: BANK_ACCOUNT_SELECT,
    });
    return toBankAccountData(updated);
  }

  async remove(bankAccountId: string): Promise<void> {
    await this.findBankAccountOrThrow(bankAccountId);
    await this.prisma.bankAccount.delete({ where: { id: bankAccountId } });
  }

  private async findBankAccountOrThrow(
    bankAccountId: string,
  ): Promise<BankAccountData> {
    const bankAccount = await this.prisma.bankAccount.findUnique({
      where: { id: bankAccountId },
      select: BANK_ACCOUNT_SELECT,
    });
    if (!bankAccount) throw new NotFoundException(BANK_ACCOUNT_NOT_FOUND);
    return toBankAccountData(bankAccount);
  }
}
