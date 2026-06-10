import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Body,
  Req,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create.dto';
import { UpdateJobDto } from './dto/update.dto';
import { AssignJobDto } from './dto/assign-job.dto';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { JobStatus } from './entities/job.entities';
import { Request } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Roles(UserRole.ADMIN, UserRole.REPORTER, UserRole.EDITOR)
  @Get()
  findAll(@Req() req: Request & { user: { role: UserRole } }) {
    const role = req.user.role;

    if (role === UserRole.REPORTER) {
      return this.jobsService.findAll(JobStatus.ASSIGNED);
    }

    if (role === UserRole.EDITOR) {
      return this.jobsService.findAll(JobStatus.TRANSCRIBED);
    }

    return this.jobsService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() payload: CreateJobDto) {
    return this.jobsService.create(payload);
  }

  @Roles(UserRole.ADMIN)
  @Post('assign')
  assign(@Body() payload: AssignJobDto) {
    return this.jobsService.assignJob(payload);
  }

  @Roles(UserRole.ADMIN)
  @Patch('update')
  updateStatus(
    @Req() req: Request & { user: { role: UserRole } },
    @Body() payload: UpdateJobDto,
  ) {
    const role = req.user.role;

    return this.jobsService.updateStatus(payload, role);
  }
}
