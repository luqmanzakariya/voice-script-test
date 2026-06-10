import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Job } from './entities/job.entities';
import { CreateJobDto } from './dto/create.dto';
import { UpdateJobDto } from './dto/update.dto';
import { JobStatus } from './entities/job.entities';
import { UserRole } from '../users/entities/user.entity';
import { AssignJobDto } from './dto/assign-job.dto';
import { JobResponseDto } from './dto/job-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    private usersService: UsersService,
  ) {}

  private toDto(job: Job): JobResponseDto {
    return plainToInstance(JobResponseDto, job, {
      excludeExtraneousValues: true,
    });
  }

  async create(createJobDto: CreateJobDto) {
    const job = this.jobsRepository.create({
      ...createJobDto,
      status: JobStatus.NEW,
    });
    return this.toDto(await this.jobsRepository.save(job));
  }

  async findAll(status?: JobStatus) {
    const jobs = await this.jobsRepository.find({
      ...(status ? { where: { status } } : {}),
      relations: { reporter: true },
    });
    return jobs.map((job) => this.toDto(job));
  }

  async assignJob(dto: AssignJobDto) {
    const job = await this.jobsRepository.findOne({
      where: { id: dto.jobId },
      relations: { reporter: true, editor: true },
    });

    if (!job) {
      throw new NotFoundException(`Job with id ${dto.jobId} not found`);
    }

    if (dto.reporterId !== undefined) {
      const reporter = await this.usersService.findById(dto.reporterId);
      if (reporter.role !== UserRole.REPORTER) {
        throw new NotFoundException(`User is not a reporter`);
      }

      if (reporter.available && job.status === JobStatus.NEW) {
        job.reporter = reporter;
        await this.usersService.setAvailable(reporter.id, false);
        job.status = JobStatus.ASSIGNED;
        return this.toDto(await this.jobsRepository.save(job));
      } else {
        throw new NotFoundException(
          `reporter is unavailable or job status not match`,
        );
      }
    }

    if (dto.editorId !== undefined) {
      const editor = await this.usersService.findById(dto.editorId);
      if (editor.role !== UserRole.EDITOR) {
        throw new NotFoundException(`User is not an editor`);
      }

      if (editor.available && job.status === JobStatus.TRANSCRIBED) {
        job.editor = editor;
        await this.usersService.setAvailable(editor.id, false);
        job.status = JobStatus.REVIEWED;
        return this.toDto(await this.jobsRepository.save(job));
      } else {
        throw new NotFoundException(
          `editor is unavailable or job status not match`,
        );
      }
    }

    throw new NotFoundException(`put at least one of reporterId or editorId`);
  }

  async updateStatus(updateJobDto: UpdateJobDto, userRole?: UserRole) {
    const job = await this.jobsRepository.findOne({
      where: { id: updateJobDto.jobId },
      relations: { reporter: true, editor: true },
    });

    if (!job) {
      throw new NotFoundException(
        `Job with id ${updateJobDto.jobId} not found`,
      );
    }

    if (job.status === JobStatus.COMPLETED) {
      throw new NotFoundException(`Cannot update a completed job`);
    }

    if (userRole === UserRole.ADMIN) {
      job.status = updateJobDto.status;

      if (updateJobDto.status === JobStatus.NEW) {
        if (job.reporter) {
          await this.usersService.setAvailable(job.reporter.id, true);
          job.reporter = null;
        }
        if (job.editor) {
          await this.usersService.setAvailable(job.editor.id, true);
          job.editor = null;
        }
      }

      if (
        updateJobDto.status === JobStatus.TRANSCRIBED ||
        updateJobDto.status === JobStatus.REVIEWED
      ) {
        if (job.editor) {
          await this.usersService.setAvailable(job.editor.id, true);
          job.editor = null;
        }
        if (job.reporter) {
          await this.usersService.setAvailable(job.reporter.id, true);
          job.reporter = null;
        }
      }
    } else if (userRole === UserRole.REPORTER) {
      if (job.status !== JobStatus.ASSIGNED) {
        throw new NotFoundException(
          `Reporter can only update jobs with status ASSIGNED`,
        );
      }
      if (updateJobDto.status !== JobStatus.TRANSCRIBED) {
        throw new NotFoundException(
          `Reporter can only change status to TRANSCRIBED`,
        );
      }
      job.status = JobStatus.TRANSCRIBED;
      if (job.reporter) {
        await this.usersService.setAvailable(job.reporter.id, true);
      }
    } else if (userRole === UserRole.EDITOR) {
      if (job.status !== JobStatus.REVIEWED) {
        throw new NotFoundException(
          `Editor can only update jobs with status REVIEWED`,
        );
      }
      if (updateJobDto.status !== JobStatus.COMPLETED) {
        throw new NotFoundException(
          `Editor can only change status to COMPLETED`,
        );
      }
      job.status = JobStatus.COMPLETED;
      if (job.editor) {
        await this.usersService.setAvailable(job.editor.id, true);
      }
    }

    return this.toDto(await this.jobsRepository.save(job));
  }
}
