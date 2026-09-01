import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import {
  VENDOR_NOT_FOUND,
  VENDOR_SEARCH_SELECT,
  VENDORS_SELECT,
} from './vendors.constants';
import type { CreateVendorDto } from './dto/create-vendor.dto';
import type { UpdateVendorDto } from './dto/update-vendor.dto';
import type { ListVendorsQuery } from './dto/list-vendors-query.dto';

type RawVendorData = Prisma.VendorGetPayload<{
  select: typeof VENDORS_SELECT;
}>;

// Decimal out of Prisma, number over the wire — same conversion Employee and
// Clients do for their own Decimal columns.
export type VendorData = Omit<RawVendorData, 'pendingPayment'> & {
  pendingPayment: number;
};

function toVendorData(row: RawVendorData): VendorData {
  return {
    ...row,
    pendingPayment: Number(row.pendingPayment),
  };
}

export type VendorListResult = {
  items: VendorData[];
  total: number;
  page: number;
  limit: number;
  // Sum of pendingPayment across every vendor matching the current filter
  // (not just the current page) — a section-level total, independent of
  // pagination.
  totalPendingPayment: number;
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export type VendorSearchResult = Prisma.VendorGetPayload<{
  select: typeof VENDOR_SEARCH_SELECT;
}>;

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(workspaceId: string, dto: CreateVendorDto): Promise<VendorData> {
    const vendor = await this.prisma.vendor.create({
      data: {
        workspaceId,
        name: dto.name,
        pendingPayment: dto.pendingPayment,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
      select: VENDORS_SELECT,
    });
    return toVendorData(vendor);
  }

  async findAll(
    workspaceId: string,
    query: ListVendorsQuery,
  ): Promise<VendorListResult> {
    const where: Prisma.VendorWhereInput = { workspaceId };

    if (query.q) {
      where.name = { contains: query.q, mode: 'insensitive' };
    }

    const skip = (query.page - 1) * query.limit;

    const [total, items, pendingPaymentSum] = await Promise.all([
      this.prisma.vendor.count({ where }),
      this.prisma.vendor.findMany({
        where,
        select: VENDORS_SELECT,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
      this.prisma.vendor.aggregate({
        where,
        _sum: { pendingPayment: true },
      }),
    ]);

    return {
      items: items.map(toVendorData),
      total,
      page: query.page,
      limit: query.limit,
      totalPendingPayment: round2(
        Number(pendingPaymentSum._sum.pendingPayment ?? 0),
      ),
    };
  }

  async search(workspaceId: string, q: string): Promise<VendorSearchResult[]> {
    const tokens = q.split(/\s+/).filter(Boolean);

    return this.prisma.vendor.findMany({
      where: {
        workspaceId,
        AND: tokens.map((token) => ({
          name: { contains: token, mode: 'insensitive' as const },
        })),
      },
      select: VENDOR_SEARCH_SELECT,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(workspaceId: string, vendorId: string): Promise<VendorData> {
    return this.findVendorOrThrow(workspaceId, vendorId);
  }

  async update(
    workspaceId: string,
    vendorId: string,
    dto: UpdateVendorDto,
  ): Promise<VendorData> {
    await this.findVendorOrThrow(workspaceId, vendorId);

    const vendor = await this.prisma.vendor.update({
      where: { id: vendorId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.pendingPayment !== undefined && {
          pendingPayment: dto.pendingPayment,
        }),
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate === null ? null : new Date(dto.dueDate),
        }),
      },
      select: VENDORS_SELECT,
    });
    return toVendorData(vendor);
  }

  // No linked-records check — a vendor has no relation to anything, so
  // removal is unconditional, same as Employee.
  async remove(workspaceId: string, vendorId: string): Promise<void> {
    await this.findVendorOrThrow(workspaceId, vendorId);
    await this.prisma.vendor.delete({ where: { id: vendorId } });
  }

  // findFirst scoped by workspaceId, not findUnique by id — a vendor from
  // another workspace must read as "not found", never leak across tenants.
  private async findVendorOrThrow(
    workspaceId: string,
    vendorId: string,
  ): Promise<VendorData> {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id: vendorId, workspaceId },
      select: VENDORS_SELECT,
    });
    if (!vendor) throw new NotFoundException(VENDOR_NOT_FOUND);
    return toVendorData(vendor);
  }
}
