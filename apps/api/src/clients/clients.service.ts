import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import type { Currency } from '@app/database/generated/prisma/enums';
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
import { ExchangeRateService } from '../exchange-rate/exchange-rate.service';

export type CurrencySaleTotal = { currency: Currency; total: number };

function sumByCurrency(
  transactions: { saleAmount: Prisma.Decimal; currency: Currency }[],
): CurrencySaleTotal[] {
  const totals = new Map<Currency, number>();
  for (const transaction of transactions) {
    const amount = Number(transaction.saleAmount);
    totals.set(
      transaction.currency,
      (totals.get(transaction.currency) ?? 0) + amount,
    );
  }
  return Array.from(totals, ([currency, total]) => ({ currency, total }));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
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

// totalRevenue/currencyType stay exactly as entered on the client (a hand-
// typed figure, e.g. revenue from before this system was in use) — nothing
// keeps that in sync with real sales, so it's not a substitute for actual
// totals. totalRevenueUsd is the real one: every entry in totalSaleAmount
// (itself already correct — summed straight from Transaction rows) converted
// to USD and added together, so a client with sales in more than one
// currency still gets a single meaningful total instead of a currency list
// with no combined figure.
type ToUsd = (amount: number, currency: Currency) => number;

function sumToUsd(totals: CurrencySaleTotal[], toUsd: ToUsd): number {
  return round2(
    totals.reduce((sum, item) => sum + toUsd(item.total, item.currency), 0),
  );
}

export type ClientData = Omit<
  RawClientData,
  'transactions' | 'totalRevenue'
> & {
  transactions: MappedTransaction<RawClientData['transactions'][number]>[];
  totalSaleAmount: CurrencySaleTotal[];
  totalRevenue: number;
  totalRevenueUsd: number;
};

function toClientData(row: RawClientData, toUsd: ToUsd): ClientData {
  const totalSaleAmount = sumByCurrency(row.transactions);
  return {
    ...row,
    transactions: mapTransactions(row.transactions),
    totalRevenue: Number(row.totalRevenue),
    totalSaleAmount,
    totalRevenueUsd: sumToUsd(totalSaleAmount, toUsd),
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
  totalRevenueUsd: number;
};

function toClientListItemData(
  row: RawClientListItem,
  toUsd: ToUsd,
): ClientListItemData {
  const totalSaleAmount = sumByCurrency(row.transactions);
  return {
    ...row,
    transactions: mapTransactions(row.transactions),
    totalRevenue: Number(row.totalRevenue),
    totalSaleAmount,
    totalRevenueUsd: sumToUsd(totalSaleAmount, toUsd),
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  private toUsd = (amount: number, currency: Currency): number =>
    this.exchangeRateService.toUsd(amount, currency);

  async create(workspaceId: string, dto: CreateClientDto): Promise<ClientData> {
    await this.exchangeRateService.refresh();
    const client = await this.prisma.clients.create({
      data: {
        workspaceId,
        clientName: dto.clientName,
        totalRevenue: dto.totalRevenue,
        currencyType: dto.currencyType,
      },
      select: CLIENTS_SELECT,
    });
    return toClientData(client, this.toUsd);
  }

  async findAll(
    workspaceId: string,
    query: ListClientsQuery,
  ): Promise<ClientListResult> {
    await this.exchangeRateService.refresh();
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
      items: items.map((item) => toClientListItemData(item, this.toUsd)),
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  // Backs the client picker/dropdown. Returns EVERY client in the workspace,
  // alphabetically — it no longer takes a query and no longer filters by
  // substring. The frontend narrows the list as the user types instead, which
  // means typing is instant (no request per keystroke) and the user can also
  // just open the dropdown and browse.
  //
  // Sorted in JS rather than with `orderBy: { clientName: 'asc' }`, which
  // defers to the database collation — on a C/POSIX-collated column that puts
  // every capitalised name before every lowercase one ("Zeta" before "acme").
  // localeCompare gives a true A-Z ordering regardless of collation, and also
  // handles accented characters sensibly. Prisma can't express an
  // expression-based orderBy (LOWER(...)), and doing it here avoids coupling
  // to physical table/column names the way a raw query would.
  //
  // Deliberately uncapped — a workspace's client list is a small, bounded set,
  // and a picker that silently truncated would be worse than a large payload.
  // Revisit if a workspace ever accumulates thousands of clients.
  async listAllForPicker(workspaceId: string): Promise<ClientSearchResult[]> {
    const clients = await this.prisma.clients.findMany({
      where: { workspaceId },
      select: CLIENT_SEARCH_SELECT,
    });

    return clients.sort((a, b) =>
      a.clientName.localeCompare(b.clientName, undefined, {
        sensitivity: 'base',
      }),
    );
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
    return toClientData(client, this.toUsd);
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
    await this.exchangeRateService.refresh();
    const client = await this.prisma.clients.findFirst({
      where: { id: clientId, workspaceId },
      select: CLIENTS_SELECT,
    });
    if (!client) throw new NotFoundException(CLIENT_NOT_FOUND);
    return toClientData(client, this.toUsd);
  }
}
