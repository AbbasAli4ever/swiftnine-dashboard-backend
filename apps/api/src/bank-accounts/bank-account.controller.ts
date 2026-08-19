import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ok,
  paginated,
  type ApiResponse as ApiRes,
  type PaginatedApiResponse,
} from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  AccountingRoleGuard,
  RequireAccountingRole,
} from '../auth/guards/accounting-role.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import {
  BankAccountService,
  type BankAccountData,
} from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import {
  ListBankAccountsQueryDto,
  type ListBankAccountsQuery,
} from './dto/list-bank-accounts-query.dto';
import {
  BankAccountResponseDto,
  PaginatedBankAccountsResponseDto,
} from './dto/bank-account-response.dto';
import { LogoPresignResponseDto } from './dto/logo-presign-response.dto';
import { BANK_LOGO_MAX_FILE_SIZE_BYTES } from './bank-account.constants';

@ApiTags('bank-accounts')
@ApiBearerAuth()
@Controller('bank-accounts')
@UseGuards(JwtAuthGuard, WorkspaceGuard, AccountingRoleGuard)
@RequireAccountingRole('CEO', 'ACCOUNTANT')
@ApiHeader({
  name: 'x-workspace-id',
  required: true,
  description: 'Active workspace ID',
})
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireAccountingRole('ACCOUNTANT')
  @ApiOperation({ summary: 'Create a new bank account' })
  @ApiResponse({
    status: 201,
    description: 'Bank account created',
    type: BankAccountResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  async create(
    @Req() req: WorkspaceRequest,
    @Body() dto: CreateBankAccountDto,
  ): Promise<ApiRes<BankAccountData>> {
    const bankAccount = await this.bankAccountService.create(
      req.workspaceContext.workspaceId,
      dto,
    );
    return ok(bankAccount, 'Bank account created successfully');
  }

  @Post('logo-presign')
  @RequireAccountingRole('ACCOUNTANT')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: BANK_LOGO_MAX_FILE_SIZE_BYTES },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({
    summary: 'Get a presigned URL to upload a bank logo',
    description:
      'Send the image file itself (multipart/form-data, field name "file"). The backend extracts fileName/mimeType/fileSize from it, returns a short-lived uploadUrl to PUT the same file to directly, and the permanent logoUrl to pass as logoUrl on POST/PATCH /bank-accounts once that upload completes.',
  })
  @ApiOkResponse({
    description: 'Presigned URL generated',
    type: LogoPresignResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  async createLogoUploadUrl(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ApiRes<LogoPresignResponseDto>> {
    const result = await this.bankAccountService.createLogoUploadUrl(file);
    return ok(result, 'Presigned URL generated');
  }

  @Get()
  @ApiOperation({
    summary: 'List and search bank accounts',
    description:
      'Each bank account includes a transaction count and every linked transaction (with the client it came from).',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search by bank name',
    example: 'HBL',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number. Defaults to 1.',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Page size. Defaults to 20, max 100.',
    example: 20,
  })
  @ApiQuery({
    name: 'accountType',
    required: false,
    description: 'Comma-separated account types to filter by',
    example: 'LOCAL,INTERNATIONAL',
  })
  @ApiQuery({
    name: 'currencyType',
    required: false,
    description: 'Comma-separated currencies to filter by',
    example: 'PKR,USD',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by. Defaults to createdAt.',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort direction. Defaults to desc.',
    example: 'desc',
  })
  @ApiOkResponse({
    description: 'Paginated bank accounts returned',
    type: PaginatedBankAccountsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  async findAll(
    @Req() req: WorkspaceRequest,
    @Query() query: ListBankAccountsQueryDto,
  ): Promise<PaginatedApiResponse<BankAccountData>> {
    const result = await this.bankAccountService.findAll(
      req.workspaceContext.workspaceId,
      query as ListBankAccountsQuery,
    );
    return paginated(result.items, result.total, result.page, result.limit);
  }

  @Get(':bankAccountId')
  @ApiOperation({ summary: 'Get a single bank account by id' })
  @ApiParam({ name: 'bankAccountId', description: 'Bank account UUID' })
  @ApiResponse({
    status: 200,
    description: 'Bank account returned',
    type: BankAccountResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Bank account not found' })
  async findOne(
    @Req() req: WorkspaceRequest,
    @Param('bankAccountId', new ParseUUIDPipe()) bankAccountId: string,
  ): Promise<ApiRes<BankAccountData>> {
    const bankAccount = await this.bankAccountService.findOne(
      req.workspaceContext.workspaceId,
      bankAccountId,
    );
    return ok(bankAccount);
  }

  @Patch(':bankAccountId')
  @RequireAccountingRole('ACCOUNTANT')
  @ApiOperation({ summary: 'Update bank account fields' })
  @ApiParam({ name: 'bankAccountId', description: 'Bank account UUID' })
  @ApiResponse({
    status: 200,
    description: 'Bank account updated',
    type: BankAccountResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Bank account not found' })
  async update(
    @Req() req: WorkspaceRequest,
    @Param('bankAccountId', new ParseUUIDPipe()) bankAccountId: string,
    @Body() dto: UpdateBankAccountDto,
  ): Promise<ApiRes<BankAccountData>> {
    const bankAccount = await this.bankAccountService.update(
      req.workspaceContext.workspaceId,
      bankAccountId,
      dto,
    );
    return ok(bankAccount, 'Bank account updated successfully');
  }

  @Delete(':bankAccountId')
  @HttpCode(HttpStatus.OK)
  @RequireAccountingRole('ACCOUNTANT')
  @ApiOperation({ summary: 'Delete a bank account' })
  @ApiParam({ name: 'bankAccountId', description: 'Bank account UUID' })
  @ApiResponse({ status: 200, description: 'Bank account deleted' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Bank account not found' })
  @ApiResponse({
    status: 409,
    description: 'Bank account still has transactions linked to it',
  })
  async remove(
    @Req() req: WorkspaceRequest,
    @Param('bankAccountId', new ParseUUIDPipe()) bankAccountId: string,
  ): Promise<ApiRes<null>> {
    await this.bankAccountService.remove(
      req.workspaceContext.workspaceId,
      bankAccountId,
    );
    return ok(null, 'Bank account deleted successfully');
  }
}
