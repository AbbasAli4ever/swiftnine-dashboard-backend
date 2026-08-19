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
  CLIENT_SEARCH_SELECT,
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

type MappedTransaction<T extends { saleAmount: Prisma.Decimal }> = Omit<
  T,
  'saleAmount'
> & { saleAmount: number };

function mapTransactions<T extends { saleAmount: Prisma.Decimal }>(
  transactions: T[],
): MappedTransaction<T>[] {
  return transactions.map((transaction) => ({
    ...transaction,
    saleAmount: Number(transaction.saleAmount),
  }));
}

export type ClientData = Omit<
  RawClientData,
  'transactions' | 'totalRevenue'
> & {
  transactions: MappedTransaction<RawClientData['transactions'][number]>[];
  totalSaleAmount: CurrencySaleTotal[];
  totalRevenue: number;
};

function toClientData(row: RawClientData): ClientData {
  return {
    ...row,
    transactions: mapTransactions(row.transactions),
    totalSaleAmount: sumByCurrency(row.transactions),
    totalRevenue: Number(row.totalRevenue),
  };
}

type RawClientListItem = Prisma.ClientsGetPayload<{
  select: typeof CLIENTS_LIST_SELECT;
}>;

export type ClientListItemData = Omit<
  RawClientListItem,
  'transactions' | 'totalRevenue'
> & {
  transactions: MappedTransaction<RawClientListItem['transactions'][number]>[];
  totalSaleAmount: CurrencySaleTotal[];
  totalRevenue: number;
};

function toClientListItemData(row: RawClientListItem): ClientListItemData {
  return {
    ...row,
    transactions: mapTransactions(row.transactions),
    totalSaleAmount: sumByCurrency(row.transactions),
    totalRevenue: Number(row.totalRevenue),
  };
}

export type ClientListResult = {
  items: ClientListItemData[];
  total: number;
  page: number;
  limit: number;
};

export type ClientSearchResult = Prisma.ClientsGetPayload<{
  select: typeof CLIENT_SEARCH_SELECT;
}>;

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(workspaceId: string, dto: CreateClientDto): Promise<ClientData> {
    const client = await this.prisma.clients.create({
      data: {
        workspaceId,
        clientName: dto.clientName,
        totalRevenue: dto.totalRevenue,
        currencyType: dto.currencyType,
      },
      select: CLIENTS_SELECT,
    });
    return toClientData(client);
  }

  async findAll(
    workspaceId: string,
    query: ListClientsQuery,
  ): Promise<ClientListResult> {
    const where: Prisma.ClientsWhereInput = { workspaceId };

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

  async search(workspaceId: string, q: string): Promise<ClientSearchResult[]> {
    const tokens = q.split(/\s+/).filter(Boolean);

    return this.prisma.clients.findMany({
      where: {
        workspaceId,
        AND: tokens.map((token) => ({
          clientName: { contains: token, mode: 'insensitive' as const },
        })),
      },
      select: CLIENT_SEARCH_SELECT,
      orderBy: { clientName: 'asc' },
    });
  }

  async findOne(workspaceId: string, clientId: string): Promise<ClientData> {
    return this.findClientOrThrow(workspaceId, clientId);
  }

  async update(
    workspaceId: string,
    clientId: string,
    dto: UpdateClientDto,
  ): Promise<ClientData> {
    await this.findClientOrThrow(workspaceId, clientId);

    const client = await this.prisma.clients.update({
      where: { id: clientId },
      data: { clientName: dto.clientName },
      select: CLIENTS_SELECT,
    });
    return toClientData(client);
  }

  async remove(workspaceId: string, clientId: string): Promise<void> {
    const client = await this.findClientOrThrow(workspaceId, clientId);
    if (client._count.transactions > 0) {
      throw new ConflictException(CLIENT_HAS_TRANSACTIONS);
    }

    await this.prisma.clients.delete({ where: { id: clientId } });
  }

  private async findClientOrThrow(
    workspaceId: string,
    clientId: string,
  ): Promise<ClientData> {
    const client = await this.prisma.clients.findFirst({
      where: { id: clientId, workspaceId },
      select: CLIENTS_SELECT,
    });
    if (!client) throw new NotFoundException(CLIENT_NOT_FOUND);
    return toClientData(client);
  }
}
