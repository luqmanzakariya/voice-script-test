import { IsString, IsNotEmpty } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  caseName: string;

  @IsString()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  locationType: string;
}
