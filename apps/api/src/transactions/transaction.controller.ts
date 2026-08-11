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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
  TransactionService,
  type TransactionData,
} from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  ListTransactionsQueryDto,
  type ListTransactionsQuery,
} from './dto/list-transactions-query.dto';
import {
  PaginatedTransactionsResponseDto,
  TransactionResponseDto,
} from './dto/transaction-response.dto';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard, WorkspaceGuard, AccountingRoleGuard)
@RequireAccountingRole('CEO', 'ACCOUNTANT')
@ApiHeader({
  name: 'x-workspace-id',
  required: true,
  description: 'Active workspace ID',
})
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireAccountingRole('ACCOUNTANT')
  @ApiOperation({
    summary: 'Record a new transaction',
    description:
      "The client and bank account referenced must already exist, and the currency must match the bank account's currencyType. saleDate defaults to now if omitted — set it explicitly to backdate a late-entered sale.",
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction created',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Client or bank account not found' })
  @ApiResponse({
    status: 400,
    description:
      "Transaction currency doesn't match the bank account's currency",
  })
  @ApiResponse({
    status: 409,
    description: 'A transaction with this reference ID already exists',
  })
  async create(
    @Req() req: WorkspaceRequest,
    @Body() dto: CreateTransactionDto,
  ): Promise<ApiRes<TransactionData>> {
    const transaction = await this.transactionService.create(
      req.workspaceContext.workspaceId,
      dto,
    );
    return ok(transaction, 'Transaction created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'List and filter transactions' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search client name or reference ID',
    example: 'Acme',
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
    name: 'clientId',
    required: false,
    description: 'Filter to transactions belonging to a single client',
    example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a',
  })
  @ApiQuery({
    name: 'paymentPlatform',
    required: false,
    description: 'Comma-separated payment platforms to filter by',
    example: 'WHOP,AIRWALLEX',
  })
  @ApiQuery({
    name: 'currency',
    required: false,
    description: 'Comma-separated currencies to filter by',
    example: 'USD,PKR',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    description:
      'Filter to transactions with saleDate on or after this date (inclusive)',
    example: '2026-07-01',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    description:
      'Filter to transactions with saleDate on or before this date (inclusive)',
    example: '2026-07-31',
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
    description: 'Paginated transactions returned',
    type: PaginatedTransactionsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  async findAll(
    @Req() req: WorkspaceRequest,
    @Query() query: ListTransactionsQueryDto,
  ): Promise<PaginatedApiResponse<TransactionData>> {
    const result = await this.transactionService.findAll(
      req.workspaceContext.workspaceId,
      query as ListTransactionsQuery,
    );
    return paginated(result.items, result.total, result.page, result.limit);
  }

  @Get(':transactionId')
  @ApiOperation({ summary: 'Get a single transaction by id' })
  @ApiParam({ name: 'transactionId', description: 'Transaction UUID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction returned',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(
    @Req() req: WorkspaceRequest,
    @Param('transactionId', new ParseUUIDPipe()) transactionId: string,
  ): Promise<ApiRes<TransactionData>> {
    const transaction = await this.transactionService.findOne(
      req.workspaceContext.workspaceId,
      transactionId,
    );
    return ok(transaction);
  }

  @Patch(':transactionId')
  @RequireAccountingRole('ACCOUNTANT')
  @ApiOperation({
    summary: 'Update transaction fields',
    description:
      "Changing bankAccountId, saleAmount, currency, or type reverses the transaction's prior effect on its old bank account and re-applies it to the new state.",
  })
  @ApiParam({ name: 'transactionId', description: 'Transaction UUID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  @ApiResponse({
    status: 404,
    description: 'Transaction, client, or bank account not found',
  })
  @ApiResponse({
    status: 400,
    description:
      "Transaction currency doesn't match the bank account's currency",
  })
  async update(
    @Req() req: WorkspaceRequest,
    @Param('transactionId', new ParseUUIDPipe()) transactionId: string,
    @Body() dto: UpdateTransactionDto,
  ): Promise<ApiRes<TransactionData>> {
    const transaction = await this.transactionService.update(
      req.workspaceContext.workspaceId,
      transactionId,
      dto,
    );
    return ok(transaction, 'Transaction updated successfully');
  }

  @Delete(':transactionId')
  @HttpCode(HttpStatus.OK)
  @RequireAccountingRole('ACCOUNTANT')
  @ApiOperation({
    summary: 'Delete a transaction',
    description:
      "Reverses this transaction's effect on its linked bank account's balance before deleting it.",
  })
  @ApiParam({ name: 'transactionId', description: 'Transaction UUID' })
  @ApiResponse({ status: 200, description: 'Transaction deleted' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async remove(
    @Req() req: WorkspaceRequest,
    @Param('transactionId', new ParseUUIDPipe()) transactionId: string,
  ): Promise<ApiRes<null>> {
    await this.transactionService.remove(
      req.workspaceContext.workspaceId,
      transactionId,
    );
    return ok(null, 'Transaction deleted successfully');
  }
}
