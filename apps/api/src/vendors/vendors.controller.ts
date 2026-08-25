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
  VendorsService,
  type VendorData,
  type VendorSearchResult,
} from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import {
  ListVendorsQueryDto,
  type ListVendorsQuery,
} from './dto/list-vendors-query.dto';
import {
  SearchVendorsQueryDto,
  type SearchVendorsQuery,
} from './dto/search-vendors-query.dto';
import {
  VendorResponseDto,
  VendorSearchResultDto,
  PaginatedVendorsResponseDto,
} from './dto/vendor-response.dto';

@ApiTags('vendors')
@ApiBearerAuth()
@Controller('vendors')
@UseGuards(JwtAuthGuard, WorkspaceGuard, AccountingRoleGuard)
@RequireAccountingRole('CEO', 'ACCOUNTANT')
@ApiHeader({
  name: 'x-workspace-id',
  required: true,
  description: 'Active workspace ID',
})
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireAccountingRole('ACCOUNTANT')
  @ApiOperation({
    summary: 'Create a new vendor',
    description:
      'Takes a name and an optional pendingPayment (PKR, defaults to 0). pendingPayment is entered manually — it is not derived from any transaction.',
  })
  @ApiResponse({
    status: 201,
    description: 'Vendor created',
    type: VendorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  async create(
    @Req() req: WorkspaceRequest,
    @Body() dto: CreateVendorDto,
  ): Promise<ApiRes<VendorData>> {
    const vendor = await this.vendorsService.create(
      req.workspaceContext.workspaceId,
      dto,
    );
    return ok(vendor, 'Vendor created successfully');
  }

  @Get()
  @ApiOperation({
    summary: 'List and search vendors',
    description:
      'Each vendor has a pendingPayment (PKR, entered manually) — the amount owed but not yet paid. No relation to Transaction.',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search by vendor name',
    example: 'Karachi',
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
    description: 'Field to sort by. Defaults to name.',
    example: 'name',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort direction. Defaults to asc.',
    example: 'asc',
  })
  @ApiOkResponse({
    description: 'Paginated vendors returned',
    type: PaginatedVendorsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  async findAll(
    @Req() req: WorkspaceRequest,
    @Query() query: ListVendorsQueryDto,
  ): Promise<PaginatedApiResponse<VendorData>> {
    const result = await this.vendorsService.findAll(
      req.workspaceContext.workspaceId,
      query as ListVendorsQuery,
    );
    return paginated(result.items, result.total, result.page, result.limit);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search vendors by name, matching words in any order',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search text — one or more words, matched in any order',
    example: 'Karachi Print',
  })
  @ApiResponse({
    status: 200,
    description: 'Matching vendors returned',
    type: [VendorSearchResultDto],
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  async search(
    @Req() req: WorkspaceRequest,
    @Query() query: SearchVendorsQueryDto,
  ): Promise<ApiRes<VendorSearchResult[]>> {
    const vendors = await this.vendorsService.search(
      req.workspaceContext.workspaceId,
      (query as SearchVendorsQuery).q,
    );
    return ok(vendors);
  }

  @Get(':vendorId')
  @ApiOperation({ summary: 'Get a single vendor by id' })
  @ApiParam({ name: 'vendorId', description: 'Vendor UUID' })
  @ApiResponse({
    status: 200,
    description: 'Vendor returned',
    type: VendorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async findOne(
    @Req() req: WorkspaceRequest,
    @Param('vendorId', new ParseUUIDPipe()) vendorId: string,
  ): Promise<ApiRes<VendorData>> {
    const vendor = await this.vendorsService.findOne(
      req.workspaceContext.workspaceId,
      vendorId,
    );
    return ok(vendor);
  }

  @Patch(':vendorId')
  @RequireAccountingRole('ACCOUNTANT')
  @ApiOperation({
    summary: 'Update a vendor',
    description:
      'name and pendingPayment are independently optional — send only the fields being changed. An empty body is rejected.',
  })
  @ApiParam({ name: 'vendorId', description: 'Vendor UUID' })
  @ApiResponse({
    status: 200,
    description: 'Vendor updated',
    type: VendorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async update(
    @Req() req: WorkspaceRequest,
    @Param('vendorId', new ParseUUIDPipe()) vendorId: string,
    @Body() dto: UpdateVendorDto,
  ): Promise<ApiRes<VendorData>> {
    const vendor = await this.vendorsService.update(
      req.workspaceContext.workspaceId,
      vendorId,
      dto,
    );
    return ok(vendor, 'Vendor updated successfully');
  }

  @Delete(':vendorId')
  @HttpCode(HttpStatus.OK)
  @RequireAccountingRole('ACCOUNTANT')
  @ApiOperation({ summary: 'Delete a vendor' })
  @ApiParam({ name: 'vendorId', description: 'Vendor UUID' })
  @ApiResponse({ status: 200, description: 'Vendor deleted' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async remove(
    @Req() req: WorkspaceRequest,
    @Param('vendorId', new ParseUUIDPipe()) vendorId: string,
  ): Promise<ApiRes<null>> {
    await this.vendorsService.remove(
      req.workspaceContext.workspaceId,
      vendorId,
    );
    return ok(null, 'Vendor deleted successfully');
  }
}
