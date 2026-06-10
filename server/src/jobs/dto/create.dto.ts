import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  caseName!: string;

  @IsNumber()
  @IsNotEmpty()
  duration!: number;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  locationType!: string;
}
