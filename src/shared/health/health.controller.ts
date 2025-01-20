import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: MikroOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Check system health',
    description:
      'Performs a health check to ensure the system and database are operational.',
  })
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
