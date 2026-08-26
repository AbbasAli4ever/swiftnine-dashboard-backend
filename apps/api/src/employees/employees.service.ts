import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import {
  EMPLOYEE_NOT_FOUND,
  EMPLOYEE_SEARCH_SELECT,
  EMPLOYEES_SELECT,
} from './employees.constants';
import type { CreateEmployeeDto } from './dto/create-employee.dto';
import type { UpdateEmployeeDto } from './dto/update-employee.dto';
import type { ListEmployeesQuery } from './dto/list-employees-query.dto';

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
  pendingCommission: number;
  // Not stored — always paidCommission + pendingCommission, computed here so
  // the two figures can never drift out of sync with their own sum.
  totalCommission: number;
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

function toEmployeeData(row: RawEmployeeData): EmployeeData {
  const paidCommission = Number(row.paidCommission);
  const pendingCommission = Number(row.pendingCommission);
  return {
    ...row,
    paidCommission,
    pendingCommission,
    totalCommission: round2(paidCommission + pendingCommission),
    transactions: mapEmployeeTransactions(row.transactions),
  };
}

export type EmployeeListResult = {
  items: EmployeeData[];
  total: number;
  page: number;
  limit: number;
};

export type EmployeeSearchResult = Prisma.EmployeeGetPayload<{
  select: typeof EMPLOYEE_SEARCH_SELECT;
}>;

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    workspaceId: string,
    dto: CreateEmployeeDto,
  ): Promise<EmployeeData> {
    const employee = await this.prisma.employee.create({
      data: {
        workspaceId,
        name: dto.name,
        paidCommission: dto.paidCommission,
        pendingCommission: dto.pendingCommission,
      },
      select: EMPLOYEES_SELECT,
    });
    return toEmployeeData(employee);
  }

  async findAll(
    workspaceId: string,
    query: ListEmployeesQuery,
  ): Promise<EmployeeListResult> {
    const where: Prisma.EmployeeWhereInput = { workspaceId };

    if (query.q) {
      where.name = { contains: query.q, mode: 'insensitive' };
    }

    const skip = (query.page - 1) * query.limit;

    const [total, items] = await Promise.all([
      this.prisma.employee.count({ where }),
      this.prisma.employee.findMany({
        where,
        select: EMPLOYEES_SELECT,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
    ]);

    return {
      items: items.map(toEmployeeData),
      total,
      page: query.page,
      limit: query.limit,
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
    return toEmployeeData(employee);
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
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, workspaceId },
      select: EMPLOYEES_SELECT,
    });
    if (!employee) throw new NotFoundException(EMPLOYEE_NOT_FOUND);
    return toEmployeeData(employee);
  }
}
