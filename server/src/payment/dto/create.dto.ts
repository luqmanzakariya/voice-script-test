import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class CreatePaymentDto {
  @IsNumber()
  user!: number;

  @IsNumber()
  job!: number;

  @IsString()
  @IsNotEmpty()
  caseName!: string;

  @IsString()
  @IsNotEmpty()
  duration!: number;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsNumber()
  earnings!: number;

  @IsNumber()
  rateApplied!: number;

  @IsString()
  @IsNotEmpty()
  rateType!: string; // 'PER_MINUTE' | 'FLAT_FEE'
}
