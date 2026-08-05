import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import type {
  Currency,
  PaymentPlatform,
} from '@app/database/generated/prisma/enums';
import {
  CLIENT_NOT_FOUND,
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
  return { ...row, saleAmount: Number(row.saleAmount) };
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

  async create(dto: CreateTransactionDto): Promise<TransactionData> {
    const existing = await this.prisma.transaction.findUnique({
      where: { refId: dto.refId },
      select: { id: true },
    });
    if (existing) throw new ConflictException(TRANSACTION_REF_ID_TAKEN);

    const client = await this.findClientOrThrow(dto.clientId);

    const transaction = await this.prisma.transaction.create({
      data: {
        clientId: client.id,
        clientName: client.clientName,
        saleAmount: dto.saleAmount,
        paymentPlatform: dto.paymentPlatform,
        currency: dto.currency,
        saleDate: dto.saleDate ? new Date(dto.saleDate) : new Date(),
        refId: dto.refId,
        description: dto.description,
      },
      select: TRANSACTION_SELECT,
    });
    return toTransactionData(transaction);
  }

  async findAll(query: ListTransactionsQuery): Promise<TransactionListResult> {
    const where: Prisma.TransactionWhereInput = {};

    if (query.q) {
      where.OR = [
        { clientName: { contains: query.q, mode: 'insensitive' } },
        { refId: { contains: query.q, mode: 'insensitive' } },
      ];
    }
    if (query.clientId) {
      where.clientId = query.clientId;
    }
    if (query.paymentPlatform?.length) {
      where.paymentPlatform = {
        in: query.paymentPlatform as PaymentPlatform[],
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

  async findOne(transactionId: string): Promise<TransactionData> {
    return this.findTransactionOrThrow(transactionId);
  }

  async update(
    transactionId: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionData> {
    const transaction = await this.findTransactionOrThrow(transactionId);
    const updateData: Prisma.TransactionUpdateInput = {};

    if (dto.clientId !== undefined) {
      await this.findClientOrThrow(dto.clientId);
      updateData.client = { connect: { id: dto.clientId } };
    }
    if (dto.clientName !== undefined) updateData.clientName = dto.clientName;
    if (dto.saleAmount !== undefined) updateData.saleAmount = dto.saleAmount;
    if (dto.paymentPlatform !== undefined)
      updateData.paymentPlatform = dto.paymentPlatform;
    if (dto.currency !== undefined) updateData.currency = dto.currency;
    if (dto.saleDate !== undefined)
      updateData.saleDate = new Date(dto.saleDate);
    if (dto.description !== undefined) updateData.description = dto.description;

    if (Object.keys(updateData).length === 0) return transaction;

    const updated = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: updateData,
      select: TRANSACTION_SELECT,
    });
    return toTransactionData(updated);
  }

  async remove(transactionId: string): Promise<void> {
    await this.findTransactionOrThrow(transactionId);
    await this.prisma.transaction.delete({ where: { id: transactionId } });
  }

  private async findTransactionOrThrow(
    transactionId: string,
  ): Promise<TransactionData> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
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
    clientId: string,
  ): Promise<{ id: string; clientName: string }> {
    const client = await this.prisma.clients.findUnique({
      where: { id: clientId },
      select: { id: true, clientName: true },
    });
    if (!client) throw new NotFoundException(CLIENT_NOT_FOUND);
    return client;
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
