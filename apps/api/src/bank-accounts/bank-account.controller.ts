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
import { RequireUserRole, UserRoleGuard } from '../auth/guards/user-role.guard';
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

@ApiTags('bank-accounts')
@ApiBearerAuth()
@Controller('bank-accounts')
@UseGuards(JwtAuthGuard, UserRoleGuard)
@RequireUserRole('CEO', 'ACCOUNTANT')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireUserRole('ACCOUNTANT')
  @ApiOperation({ summary: 'Create a new bank account' })
  @ApiResponse({
    status: 201,
    description: 'Bank account created',
    type: BankAccountResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  async create(
    @Body() dto: CreateBankAccountDto,
  ): Promise<ApiRes<BankAccountData>> {
    const bankAccount = await this.bankAccountService.create(dto);
    return ok(bankAccount, 'Bank account created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'List and search bank accounts' })
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
    @Query() query: ListBankAccountsQueryDto,
  ): Promise<PaginatedApiResponse<BankAccountData>> {
    const result = await this.bankAccountService.findAll(
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
    @Param('bankAccountId', new ParseUUIDPipe()) bankAccountId: string,
  ): Promise<ApiRes<BankAccountData>> {
    const bankAccount = await this.bankAccountService.findOne(bankAccountId);
    return ok(bankAccount);
  }

  @Patch(':bankAccountId')
  @RequireUserRole('ACCOUNTANT')
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
    @Param('bankAccountId', new ParseUUIDPipe()) bankAccountId: string,
    @Body() dto: UpdateBankAccountDto,
  ): Promise<ApiRes<BankAccountData>> {
    const bankAccount = await this.bankAccountService.update(
      bankAccountId,
      dto,
    );
    return ok(bankAccount, 'Bank account updated successfully');
  }

  @Delete(':bankAccountId')
  @HttpCode(HttpStatus.OK)
  @RequireUserRole('ACCOUNTANT')
  @ApiOperation({ summary: 'Delete a bank account' })
  @ApiParam({ name: 'bankAccountId', description: 'Bank account UUID' })
  @ApiResponse({ status: 200, description: 'Bank account deleted' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Bank account not found' })
  async remove(
    @Param('bankAccountId', new ParseUUIDPipe()) bankAccountId: string,
  ): Promise<ApiRes<null>> {
    await this.bankAccountService.remove(bankAccountId);
    return ok(null, 'Bank account deleted successfully');
  }
}
