import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JobStatus } from '../jobs/entities/job.entities';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  findByJobStatus(@Query('jobStatus') jobStatus: JobStatus) {
    return this.usersService.findByJobStatus(jobStatus);
  }

  @Roles(UserRole.ADMIN)
  @Get('by-role')
  findByRole(@Query('role') role: UserRole) {
    return this.usersService.findByRole(role);
  }
}
