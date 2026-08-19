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
  ClientsService,
  type ClientData,
  type ClientListItemData,
  type ClientSearchResult,
} from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {
  ListClientsQueryDto,
  type ListClientsQuery,
} from './dto/list-clients-query.dto';
import {
  SearchClientsQueryDto,
  type SearchClientsQuery,
} from './dto/search-clients-query.dto';
import {
  ClientResponseDto,
  ClientSearchResultDto,
  PaginatedClientsResponseDto,
} from './dto/client-response.dto';

@ApiTags('clients')
@ApiBearerAuth()
@Controller('clients')
@UseGuards(JwtAuthGuard, WorkspaceGuard, AccountingRoleGuard)
@RequireAccountingRole('CEO', 'ACCOUNTANT')
@ApiHeader({
  name: 'x-workspace-id',
  required: true,
  description: 'Active workspace ID',
})
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireAccountingRole('ACCOUNTANT')
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: 201,
    description: 'Client created',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  async create(
    @Req() req: WorkspaceRequest,
    @Body() dto: CreateClientDto,
  ): Promise<ApiRes<ClientData>> {
    const client = await this.clientsService.create(
      req.workspaceContext.workspaceId,
      dto,
    );
    return ok(client, 'Client created successfully');
  }

  @Get()
  @ApiOperation({
    summary: 'List and search clients',
    description:
      'Each client includes a transaction count, a total sale amount per currency, and every linked transaction (with the bank account it came through).',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search by client name',
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
    name: 'sortBy',
    required: false,
    description: 'Field to sort by. Defaults to clientName.',
    example: 'clientName',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort direction. Defaults to asc.',
    example: 'asc',
  })
  @ApiOkResponse({
    description: 'Paginated clients returned',
    type: PaginatedClientsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  async findAll(
    @Req() req: WorkspaceRequest,
    @Query() query: ListClientsQueryDto,
  ): Promise<PaginatedApiResponse<ClientListItemData>> {
    const result = await this.clientsService.findAll(
      req.workspaceContext.workspaceId,
      query as ListClientsQuery,
    );
    return paginated(result.items, result.total, result.page, result.limit);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search clients by name, matching words in any order',
    description:
      'Splits the query into words and returns every client whose clientName contains all of them, in any order (e.g. "Corp Acme" matches "Acme Corp Inc").',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search text — one or more words, matched in any order',
    example: 'Corp Acme',
  })
  @ApiResponse({
    status: 200,
    description: 'Matching clients returned',
    type: [ClientSearchResultDto],
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  async search(
    @Req() req: WorkspaceRequest,
    @Query() query: SearchClientsQueryDto,
  ): Promise<ApiRes<ClientSearchResult[]>> {
    const clients = await this.clientsService.search(
      req.workspaceContext.workspaceId,
      (query as SearchClientsQuery).q,
    );
    return ok(clients);
  }

  @Get(':clientId')
  @ApiOperation({ summary: 'Get a single client by id' })
  @ApiParam({ name: 'clientId', description: 'Client UUID' })
  @ApiResponse({
    status: 200,
    description: 'Client returned',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findOne(
    @Req() req: WorkspaceRequest,
    @Param('clientId', new ParseUUIDPipe()) clientId: string,
  ): Promise<ApiRes<ClientData>> {
    const client = await this.clientsService.findOne(
      req.workspaceContext.workspaceId,
      clientId,
    );
    return ok(client);
  }

  @Patch(':clientId')
  @RequireAccountingRole('ACCOUNTANT')
  @ApiOperation({ summary: 'Rename a client' })
  @ApiParam({ name: 'clientId', description: 'Client UUID' })
  @ApiResponse({
    status: 200,
    description: 'Client updated',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async update(
    @Req() req: WorkspaceRequest,
    @Param('clientId', new ParseUUIDPipe()) clientId: string,
    @Body() dto: UpdateClientDto,
  ): Promise<ApiRes<ClientData>> {
    const client = await this.clientsService.update(
      req.workspaceContext.workspaceId,
      clientId,
      dto,
    );
    return ok(client, 'Client updated successfully');
  }

  @Delete(':clientId')
  @HttpCode(HttpStatus.OK)
  @RequireAccountingRole('ACCOUNTANT')
  @ApiOperation({ summary: 'Delete a client' })
  @ApiParam({ name: 'clientId', description: 'Client UUID' })
  @ApiResponse({ status: 200, description: 'Client deleted' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({
    status: 409,
    description: 'Client still has transactions linked to it',
  })
  async remove(
    @Req() req: WorkspaceRequest,
    @Param('clientId', new ParseUUIDPipe()) clientId: string,
  ): Promise<ApiRes<null>> {
    await this.clientsService.remove(
      req.workspaceContext.workspaceId,
      clientId,
    );
    return ok(null, 'Client deleted successfully');
  }
}
