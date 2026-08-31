import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import type { Currency } from '@app/database/generated/prisma/enums';
import {
  EMPLOYEE_NOT_FOUND,
  EMPLOYEE_SEARCH_SELECT,
  EMPLOYEES_SELECT,
} from './employees.constants';
import type { CreateEmployeeDto } from './dto/create-employee.dto';
import type { UpdateEmployeeDto } from './dto/update-employee.dto';
import type { ListEmployeesQuery } from './dto/list-employees-query.dto';
import { ExchangeRateService } from '../exchange-rate/exchange-rate.service';

type RawEmployeeData = Prisma.EmployeeGetPayload<{
  select: typeof EMPLOYEES_SELECT;
}>;

type RawEmployeeTransaction = RawEmployeeData['transactions'][number];

type MappedEmployeeTransaction = Omit<
  RawEmployeeTransaction,
  'saleAmount' | 'commissionAmount'
> & {
  saleAmount: number;
  commissionAmount: number;
};

export type EmployeeData = Omit<
  RawEmployeeData,
  'paidCommission' | 'pendingCommission' | 'transactions'
> & {
  paidCommission: number;
  paidCommissionUsd: number;
  pendingCommission: number;
  pendingCommissionUsd: number;
  // Not stored — always paidCommission + pendingCommission, computed here so
  // the two figures can never drift out of sync with their own sum.
  totalCommission: number;
  totalCommissionUsd: number;
  transactions: MappedEmployeeTransaction[];
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function mapEmployeeTransactions(
  transactions: RawEmployeeTransaction[],
): MappedEmployeeTransaction[] {
  return transactions.map((transaction) => ({
    ...transaction,
    saleAmount: Number(transaction.saleAmount),
    commissionAmount: Number(transaction.commissionAmount),
  }));
}

type ToUsd = (amount: number, currency: Currency) => number;

// Employee.paidCommission/pendingCommission are always PKR (same as
// Transaction.commissionAmount, which they're summed from — see the schema
// comment on that field), so the source currency here is fixed rather than
// read off the row.
function toEmployeeData(row: RawEmployeeData, toUsd: ToUsd): EmployeeData {
  const paidCommission = Number(row.paidCommission);
  const pendingCommission = Number(row.pendingCommission);
  const totalCommission = round2(paidCommission + pendingCommission);
  return {
    ...row,
    paidCommission,
    paidCommissionUsd: round2(toUsd(paidCommission, 'PKR')),
    pendingCommission,
    pendingCommissionUsd: round2(toUsd(pendingCommission, 'PKR')),
    totalCommission,
    totalCommissionUsd: round2(toUsd(totalCommission, 'PKR')),
    transactions: mapEmployeeTransactions(row.transactions),
  };
}

export type EmployeeListResult = {
  items: EmployeeData[];
  total: number;
  page: number;
  limit: number;
  // Sum of pendingCommission across every employee matching the current
  // filter (not just the current page) — a section-level total, independent
  // of pagination.
  totalPendingCommission: number;
  totalPendingCommissionUsd: number;
};

export type EmployeeSearchResult = Prisma.EmployeeGetPayload<{
  select: typeof EMPLOYEE_SEARCH_SELECT;
}>;

@Injectable()
export class EmployeesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  private toUsd: ToUsd = (amount, currency) =>
    this.exchangeRateService.toUsd(amount, currency);

  async create(
    workspaceId: string,
    dto: CreateEmployeeDto,
  ): Promise<EmployeeData> {
    await this.exchangeRateService.refresh();
    const employee = await this.prisma.employee.create({
      data: {
        workspaceId,
        name: dto.name,
        paidCommission: dto.paidCommission,
        pendingCommission: dto.pendingCommission,
      },
      select: EMPLOYEES_SELECT,
    });
    return toEmployeeData(employee, this.toUsd);
  }

  async findAll(
    workspaceId: string,
    query: ListEmployeesQuery,
  ): Promise<EmployeeListResult> {
    await this.exchangeRateService.refresh();
    const where: Prisma.EmployeeWhereInput = { workspaceId };

    if (query.q) {
      where.name = { contains: query.q, mode: 'insensitive' };
    }

    const skip = (query.page - 1) * query.limit;

    const [total, items, pendingCommissionSum] = await Promise.all([
      this.prisma.employee.count({ where }),
      this.prisma.employee.findMany({
        where,
        select: EMPLOYEES_SELECT,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
      this.prisma.employee.aggregate({
        where,
        _sum: { pendingCommission: true },
      }),
    ]);

    const totalPendingCommission = round2(
      Number(pendingCommissionSum._sum.pendingCommission ?? 0),
    );

    return {
      items: items.map((item) => toEmployeeData(item, this.toUsd)),
      total,
      page: query.page,
      limit: query.limit,
      totalPendingCommission,
      totalPendingCommissionUsd: round2(
        this.toUsd(totalPendingCommission, 'PKR'),
      ),
    };
  }

  // q omitted/empty: every employee in the workspace, alphabetically — for
  // populating a picker/dropdown, matching /clients/search's convention.
  // Sorted in JS via localeCompare rather than Prisma's orderBy, same reason
  // as ClientsService.listAllForPicker: a C/POSIX-collated column sorts
  // every capitalised name before every lowercase one otherwise.
  async search(
    workspaceId: string,
    q?: string,
  ): Promise<EmployeeSearchResult[]> {
    if (!q) {
      const employees = await this.prisma.employee.findMany({
        where: { workspaceId },
        select: EMPLOYEE_SEARCH_SELECT,
      });
      return employees.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
      );
    }

    const tokens = q.split(/\s+/).filter(Boolean);

    return this.prisma.employee.findMany({
      where: {
        workspaceId,
        AND: tokens.map((token) => ({
          name: { contains: token, mode: 'insensitive' as const },
        })),
      },
      select: EMPLOYEE_SEARCH_SELECT,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(
    workspaceId: string,
    employeeId: string,
  ): Promise<EmployeeData> {
    return this.findEmployeeOrThrow(workspaceId, employeeId);
  }

  async update(
    workspaceId: string,
    employeeId: string,
    dto: UpdateEmployeeDto,
  ): Promise<EmployeeData> {
    await this.findEmployeeOrThrow(workspaceId, employeeId);

    const employee = await this.prisma.employee.update({
      where: { id: employeeId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.paidCommission !== undefined && {
          paidCommission: dto.paidCommission,
        }),
        ...(dto.pendingCommission !== undefined && {
          pendingCommission: dto.pendingCommission,
        }),
      },
      select: EMPLOYEES_SELECT,
    });
    return toEmployeeData(employee, this.toUsd);
  }

  // Unconditional — Transaction.employeeId is onDelete: SetNull, so deleting
  // an employee just clears the link on their past transactions instead of
  // being blocked by them.
  async remove(workspaceId: string, employeeId: string): Promise<void> {
    await this.findEmployeeOrThrow(workspaceId, employeeId);
    await this.prisma.employee.delete({ where: { id: employeeId } });
  }

  private async findEmployeeOrThrow(
    workspaceId: string,
    employeeId: string,
  ): Promise<EmployeeData> {
    await this.exchangeRateService.refresh();
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, workspaceId },
      select: EMPLOYEES_SELECT,
    });
    if (!employee) throw new NotFoundException(EMPLOYEE_NOT_FOUND);
    return toEmployeeData(employee, this.toUsd);
  }
}
