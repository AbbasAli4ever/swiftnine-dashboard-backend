import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import {
  EMPLOYEE_HAS_TRANSACTIONS,
  EMPLOYEE_NOT_FOUND,
  EMPLOYEE_SEARCH_SELECT,
  EMPLOYEES_LIST_SELECT,
  EMPLOYEES_SELECT,
} from './employees.constants';
import type { CreateEmployeeDto } from './dto/create-employee.dto';
import type { UpdateEmployeeDto } from './dto/update-employee.dto';
import type { ListEmployeesQuery } from './dto/list-employees-query.dto';

export type CommissionCurrencyTotal = { currency: string; total: number };

/**
 * Only transactions that actually carry a commission contribute — an
 * employee's sale with no commission set shouldn't show up as a currency
 * with a 0 total.
 */
function sumCommissionByCurrency(
  transactions: {
    commissionAmount: Prisma.Decimal | null;
    commissionCurrency: string | null;
  }[],
): CommissionCurrencyTotal[] {
  const totals = new Map<string, number>();
  for (const transaction of transactions) {
    if (
      transaction.commissionAmount === null ||
      !transaction.commissionCurrency
    ) {
      continue;
    }
    const amount = Number(transaction.commissionAmount);
    totals.set(
      transaction.commissionCurrency,
      (totals.get(transaction.commissionCurrency) ?? 0) + amount,
    );
  }
  return Array.from(totals, ([currency, total]) => ({ currency, total }));
}

type RawEmployeeData = Prisma.EmployeeGetPayload<{
  select: typeof EMPLOYEES_SELECT;
}>;

type MappedTransaction<
  T extends {
    saleAmount: Prisma.Decimal;
    commissionAmount: Prisma.Decimal | null;
  },
> = Omit<T, 'saleAmount' | 'commissionAmount'> & {
  saleAmount: number;
  commissionAmount: number | null;
};

function mapTransactions<
  T extends {
    saleAmount: Prisma.Decimal;
    commissionAmount: Prisma.Decimal | null;
  },
>(transactions: T[]): MappedTransaction<T>[] {
  return transactions.map((transaction) => ({
    ...transaction,
    saleAmount: Number(transaction.saleAmount),
    commissionAmount:
      transaction.commissionAmount === null
        ? null
        : Number(transaction.commissionAmount),
  }));
}

export type EmployeeData = Omit<RawEmployeeData, 'transactions'> & {
  transactions: MappedTransaction<RawEmployeeData['transactions'][number]>[];
  totalCommission: CommissionCurrencyTotal[];
};

function toEmployeeData(row: RawEmployeeData): EmployeeData {
  return {
    ...row,
    transactions: mapTransactions(row.transactions),
    totalCommission: sumCommissionByCurrency(row.transactions),
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
      data: { workspaceId, name: dto.name },
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
        select: EMPLOYEES_LIST_SELECT,
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

  async search(
    workspaceId: string,
    q: string,
  ): Promise<EmployeeSearchResult[]> {
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
      data: { name: dto.name },
      select: EMPLOYEES_SELECT,
    });
    return toEmployeeData(employee);
  }

  async remove(workspaceId: string, employeeId: string): Promise<void> {
    const employee = await this.findEmployeeOrThrow(workspaceId, employeeId);
    if (employee._count.transactions > 0) {
      throw new ConflictException(EMPLOYEE_HAS_TRANSACTIONS);
    }

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
