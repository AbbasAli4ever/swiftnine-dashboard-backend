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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Record a new transaction',
    description:
      'Looks up an existing client by exact clientName match; creates a new client automatically if none matches.',
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction created',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({
    status: 409,
    description: 'A transaction with this reference ID already exists',
  })
  async create(
    @Body() dto: CreateTransactionDto,
  ): Promise<ApiRes<TransactionData>> {
    const transaction = await this.transactionService.create(dto);
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
  async findAll(
    @Query() query: ListTransactionsQueryDto,
  ): Promise<PaginatedApiResponse<TransactionData>> {
    const result = await this.transactionService.findAll(
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
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(
    @Param('transactionId', new ParseUUIDPipe()) transactionId: string,
  ): Promise<ApiRes<TransactionData>> {
    const transaction = await this.transactionService.findOne(transactionId);
    return ok(transaction);
  }

  @Patch(':transactionId')
  @ApiOperation({ summary: 'Update transaction fields' })
  @ApiParam({ name: 'transactionId', description: 'Transaction UUID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Transaction or client not found' })
  async update(
    @Param('transactionId', new ParseUUIDPipe()) transactionId: string,
    @Body() dto: UpdateTransactionDto,
  ): Promise<ApiRes<TransactionData>> {
    const transaction = await this.transactionService.update(
      transactionId,
      dto,
    );
    return ok(transaction, 'Transaction updated successfully');
  }

  @Delete(':transactionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiParam({ name: 'transactionId', description: 'Transaction UUID' })
  @ApiResponse({ status: 200, description: 'Transaction deleted' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async remove(
    @Param('transactionId', new ParseUUIDPipe()) transactionId: string,
  ): Promise<ApiRes<null>> {
    await this.transactionService.remove(transactionId);
    return ok(null, 'Transaction deleted successfully');
  }
}
