import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import {
  CLIENT_HAS_TRANSACTIONS,
  CLIENT_NOT_FOUND,
  CLIENTS_LIST_SELECT,
  CLIENTS_SELECT,
} from './clients.constants';
import type { CreateClientDto } from './dto/create-client.dto';
import type { UpdateClientDto } from './dto/update-client.dto';
import type { ListClientsQuery } from './dto/list-clients-query.dto';

export type CurrencySaleTotal = { currency: string; total: number };

function sumByCurrency(
  transactions: { saleAmount: Prisma.Decimal; currency: string }[],
): CurrencySaleTotal[] {
  const totals = new Map<string, number>();
  for (const transaction of transactions) {
    const amount = Number(transaction.saleAmount);
    totals.set(
      transaction.currency,
      (totals.get(transaction.currency) ?? 0) + amount,
    );
  }
  return Array.from(totals, ([currency, total]) => ({ currency, total }));
}

type RawClientData = Prisma.ClientsGetPayload<{
  select: typeof CLIENTS_SELECT;
}>;

export type ClientData = Omit<RawClientData, 'transactions'> & {
  transactions: (Omit<RawClientData['transactions'][number], 'saleAmount'> & {
    saleAmount: number;
  })[];
  totalSaleAmount: CurrencySaleTotal[];
};

function toClientData(row: RawClientData): ClientData {
  const transactions = row.transactions.map((transaction) => ({
    ...transaction,
    saleAmount: Number(transaction.saleAmount),
  }));

  return {
    ...row,
    transactions,
    totalSaleAmount: sumByCurrency(row.transactions),
  };
}

type RawClientListItem = Prisma.ClientsGetPayload<{
  select: typeof CLIENTS_LIST_SELECT;
}>;

export type ClientListItemData = Omit<RawClientListItem, 'transactions'> & {
  totalSaleAmount: CurrencySaleTotal[];
};

function toClientListItemData(row: RawClientListItem): ClientListItemData {
  const { transactions, ...rest } = row;
  return { ...rest, totalSaleAmount: sumByCurrency(transactions) };
}

export type ClientListResult = {
  items: ClientListItemData[];
  total: number;
  page: number;
  limit: number;
};

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClientDto): Promise<ClientData> {
    const client = await this.prisma.clients.create({
      data: { clientName: dto.clientName },
      select: CLIENTS_SELECT,
    });
    return toClientData(client);
  }

  async findAll(query: ListClientsQuery): Promise<ClientListResult> {
    const where: Prisma.ClientsWhereInput = {};

    if (query.q) {
      where.clientName = { contains: query.q, mode: 'insensitive' };
    }

    const skip = (query.page - 1) * query.limit;

    const [total, items] = await Promise.all([
      this.prisma.clients.count({ where }),
      this.prisma.clients.findMany({
        where,
        select: CLIENTS_LIST_SELECT,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
    ]);

    return {
      items: items.map(toClientListItemData),
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  async findOne(clientId: string): Promise<ClientData> {
    return this.findClientOrThrow(clientId);
  }

  async update(clientId: string, dto: UpdateClientDto): Promise<ClientData> {
    await this.findClientOrThrow(clientId);

    const client = await this.prisma.clients.update({
      where: { id: clientId },
      data: { clientName: dto.clientName },
      select: CLIENTS_SELECT,
    });
    return toClientData(client);
  }

  async remove(clientId: string): Promise<void> {
    const client = await this.findClientOrThrow(clientId);
    if (client._count.transactions > 0) {
      throw new ConflictException(CLIENT_HAS_TRANSACTIONS);
    }

    await this.prisma.clients.delete({ where: { id: clientId } });
  }

  private async findClientOrThrow(clientId: string): Promise<ClientData> {
    const client = await this.prisma.clients.findUnique({
      where: { id: clientId },
      select: CLIENTS_SELECT,
    });
    if (!client) throw new NotFoundException(CLIENT_NOT_FOUND);
    return toClientData(client);
  }
}
