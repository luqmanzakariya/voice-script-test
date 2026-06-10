import { IsEnum, IsNumber } from 'class-validator';
import { JobStatus } from '../entities/job.entities';

export class UpdateJobDto {
  @IsNumber()
  jobId!: number;

  @IsEnum(JobStatus)
  status!: JobStatus;
}
