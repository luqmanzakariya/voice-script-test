import { IsNumber, IsOptional } from 'class-validator';

export class AssignJobDto {
  @IsNumber()
  jobId: number;

  @IsNumber()
  @IsOptional()
  reporterId?: number;

  @IsNumber()
  @IsOptional()
  editorId?: number;
}
