import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthResponseDto } from './health/health.dto';

@ApiTags('system')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns database connectivity status',
  })
  @ApiResponse({
    status: 200,
    type: HealthResponseDto,
    description: 'Service is healthy',
  })
  @ApiResponse({ status: 503, description: 'Database unreachable' })
  async checkHealth(): Promise<HealthResponseDto> {
    return this.appService.checkDbConnection();
  }
}
