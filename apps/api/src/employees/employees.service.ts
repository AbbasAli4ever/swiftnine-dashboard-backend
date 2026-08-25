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

export type EmployeeData = Omit<
  RawEmployeeData,
  'paidCommission' | 'pendingCommission'
> & {
  paidCommission: number;
  pendingCommission: number;
  // Not stored — always paidCommission + pendingCommission, computed here so
  // the two figures can never drift out of sync with their own sum.
  totalCommission: number;
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function toEmployeeData(row: RawEmployeeData): EmployeeData {
  const paidCommission = Number(row.paidCommission);
  const pendingCommission = Number(row.pendingCommission);
  return {
    ...row,
    paidCommission,
    pendingCommission,
    totalCommission: round2(paidCommission + pendingCommission),
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

  // No linked-transactions check any more — an employee has no relation to
  // delete around, so removal is unconditional.
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
