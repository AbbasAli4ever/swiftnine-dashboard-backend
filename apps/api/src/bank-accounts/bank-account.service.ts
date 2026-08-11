import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import { PublicAssetsS3Service } from '@app/common';
import type { Prisma } from '@app/database/generated/prisma/client';
import type {
  AccountType,
  Currency,
} from '@app/database/generated/prisma/enums';
import {
  BANK_ACCOUNT_HAS_TRANSACTIONS,
  BANK_ACCOUNT_NOT_FOUND,
  BANK_ACCOUNT_SELECT,
  BANK_LOGO_ALLOWED_MIME_TYPES,
  BANK_LOGO_KEY_PREFIX,
  BANK_LOGO_MAX_FILE_SIZE_BYTES,
  BANK_LOGO_PRESIGN_EXPIRES_IN_SECONDS,
} from './bank-account.constants';
import type { CreateBankAccountDto } from './dto/create-bank-account.dto';
import type { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import type { ListBankAccountsQuery } from './dto/list-bank-accounts-query.dto';
import type { LogoPresignResponseDto } from './dto/logo-presign-response.dto';

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly publicAssetsS3: PublicAssetsS3Service,
  ) {}

  async create(
    workspaceId: string,
    dto: CreateBankAccountDto,
  ): Promise<BankAccountData> {
    const bankAccount = await this.prisma.bankAccount.create({
      data: {
        workspaceId,
        bankName: dto.bankName,
        accountType: dto.accountType,
        currencyType: dto.currencyType,
        amount: dto.amount,
        logoUrl: dto.logoUrl,
      },
      select: BANK_ACCOUNT_SELECT,
    });
    return toBankAccountData(bankAccount);
  }

  async createLogoUploadUrl(
    file: Express.Multer.File,
  ): Promise<LogoPresignResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const allowedMimeTypes: readonly string[] = BANK_LOGO_ALLOWED_MIME_TYPES;
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Unsupported file type: ${file.mimetype}`);
    }
    if (file.size > BANK_LOGO_MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        `File is too large: ${file.size} bytes exceeds the ${BANK_LOGO_MAX_FILE_SIZE_BYTES} byte limit`,
      );
    }

    const sanitizedFileName = file.originalname.replace(/\s+/g, '_');
    const key = this.publicAssetsS3.buildKey(
      BANK_LOGO_KEY_PREFIX,
      `${randomUUID()}-${sanitizedFileName}`,
    );

    const uploadUrl = await this.publicAssetsS3.createPresignedPutUrl(
      key,
      BANK_LOGO_PRESIGN_EXPIRES_IN_SECONDS,
    );

    return {
      uploadUrl,
      logoUrl: this.publicAssetsS3.getPublicUrl(key),
      expiresIn: BANK_LOGO_PRESIGN_EXPIRES_IN_SECONDS,
    };
  }

  async findAll(
    workspaceId: string,
    query: ListBankAccountsQuery,
  ): Promise<BankAccountListResult> {
    const where: Prisma.BankAccountWhereInput = { workspaceId };

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

  async findOne(
    workspaceId: string,
    bankAccountId: string,
  ): Promise<BankAccountData> {
    return this.findBankAccountOrThrow(workspaceId, bankAccountId);
  }

  async update(
    workspaceId: string,
    bankAccountId: string,
    dto: UpdateBankAccountDto,
  ): Promise<BankAccountData> {
    const bankAccount = await this.findBankAccountOrThrow(
      workspaceId,
      bankAccountId,
    );
    const updateData: Prisma.BankAccountUpdateInput = {};

    if (dto.bankName !== undefined) updateData.bankName = dto.bankName;
    if (dto.accountType !== undefined) updateData.accountType = dto.accountType;
    if (dto.currencyType !== undefined)
      updateData.currencyType = dto.currencyType;
    if (dto.amount !== undefined) updateData.amount = dto.amount;
    if (dto.logoUrl !== undefined) updateData.logoUrl = dto.logoUrl;

    if (Object.keys(updateData).length === 0) return bankAccount;

    const updated = await this.prisma.bankAccount.update({
      where: { id: bankAccountId },
      data: updateData,
      select: BANK_ACCOUNT_SELECT,
    });
    return toBankAccountData(updated);
  }

  async remove(workspaceId: string, bankAccountId: string): Promise<void> {
    await this.findBankAccountOrThrow(workspaceId, bankAccountId);

    const transactionCount = await this.prisma.transaction.count({
      where: { bankAccountId },
    });
    if (transactionCount > 0) {
      throw new ConflictException(BANK_ACCOUNT_HAS_TRANSACTIONS);
    }

    await this.prisma.bankAccount.delete({ where: { id: bankAccountId } });
  }

  private async findBankAccountOrThrow(
    workspaceId: string,
    bankAccountId: string,
  ): Promise<BankAccountData> {
    const bankAccount = await this.prisma.bankAccount.findFirst({
      where: { id: bankAccountId, workspaceId },
      select: BANK_ACCOUNT_SELECT,
    });
    if (!bankAccount) throw new NotFoundException(BANK_ACCOUNT_NOT_FOUND);
    return toBankAccountData(bankAccount);
  }
}
