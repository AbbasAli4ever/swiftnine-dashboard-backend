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
  EmployeesService,
  type EmployeeData,
  type EmployeeSearchResult,
} from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  ListEmployeesQueryDto,
  type ListEmployeesQuery,
} from './dto/list-employees-query.dto';
import {
  SearchEmployeesQueryDto,
  type SearchEmployeesQuery,
} from './dto/search-employees-query.dto';
import {
  EmployeeResponseDto,
  EmployeeSearchResultDto,
  PaginatedEmployeesResponseDto,
} from './dto/employee-response.dto';

@ApiTags('employees')
@ApiBearerAuth()
@Controller('employees')
@UseGuards(JwtAuthGuard, WorkspaceGuard, AccountingRoleGuard)
@RequireAccountingRole('CEO', 'ACCOUNTANT')
@ApiHeader({
  name: 'x-workspace-id',
  required: true,
  description: 'Active workspace ID',
})
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireAccountingRole('ACCOUNTANT')
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({
    status: 201,
    description: 'Employee created',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  async create(
    @Req() req: WorkspaceRequest,
    @Body() dto: CreateEmployeeDto,
  ): Promise<ApiRes<EmployeeData>> {
    const employee = await this.employeesService.create(
      req.workspaceContext.workspaceId,
      dto,
    );
    return ok(employee, 'Employee created successfully');
  }

  @Get()
  @ApiOperation({
    summary: 'List and search employees',
    description:
      'Each employee includes a transaction count, total commission per currency, and every linked transaction (with the client it was for).',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search by employee name',
    example: 'Sara',
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
    description: 'Paginated employees returned',
    type: PaginatedEmployeesResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  async findAll(
    @Req() req: WorkspaceRequest,
    @Query() query: ListEmployeesQueryDto,
  ): Promise<PaginatedApiResponse<EmployeeData>> {
    const result = await this.employeesService.findAll(
      req.workspaceContext.workspaceId,
      query as ListEmployeesQuery,
    );
    return paginated(result.items, result.total, result.page, result.limit);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search employees by name, matching words in any order',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search text — one or more words, matched in any order',
    example: 'Sara Khan',
  })
  @ApiResponse({
    status: 200,
    description: 'Matching employees returned',
    type: [EmployeeSearchResultDto],
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  async search(
    @Req() req: WorkspaceRequest,
    @Query() query: SearchEmployeesQueryDto,
  ): Promise<ApiRes<EmployeeSearchResult[]>> {
    const employees = await this.employeesService.search(
      req.workspaceContext.workspaceId,
      (query as SearchEmployeesQuery).q,
    );
    return ok(employees);
  }

  @Get(':employeeId')
  @ApiOperation({ summary: 'Get a single employee by id' })
  @ApiParam({ name: 'employeeId', description: 'Employee UUID' })
  @ApiResponse({
    status: 200,
    description: 'Employee returned',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async findOne(
    @Req() req: WorkspaceRequest,
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
  ): Promise<ApiRes<EmployeeData>> {
    const employee = await this.employeesService.findOne(
      req.workspaceContext.workspaceId,
      employeeId,
    );
    return ok(employee);
  }

  @Patch(':employeeId')
  @RequireAccountingRole('ACCOUNTANT')
  @ApiOperation({ summary: 'Rename an employee' })
  @ApiParam({ name: 'employeeId', description: 'Employee UUID' })
  @ApiResponse({
    status: 200,
    description: 'Employee updated',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async update(
    @Req() req: WorkspaceRequest,
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
    @Body() dto: UpdateEmployeeDto,
  ): Promise<ApiRes<EmployeeData>> {
    const employee = await this.employeesService.update(
      req.workspaceContext.workspaceId,
      employeeId,
      dto,
    );
    return ok(employee, 'Employee updated successfully');
  }

  @Delete(':employeeId')
  @HttpCode(HttpStatus.OK)
  @RequireAccountingRole('ACCOUNTANT')
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiParam({ name: 'employeeId', description: 'Employee UUID' })
  @ApiResponse({ status: 200, description: 'Employee deleted' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'ACCOUNTANT role required' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({
    status: 409,
    description: 'Employee still has transactions linked to it',
  })
  async remove(
    @Req() req: WorkspaceRequest,
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
  ): Promise<ApiRes<null>> {
    await this.employeesService.remove(
      req.workspaceContext.workspaceId,
      employeeId,
    );
    return ok(null, 'Employee deleted successfully');
  }
}
