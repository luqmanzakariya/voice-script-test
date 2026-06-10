import { IsString, IsNotEmpty, IsNumber, Min, IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsNumber()
  @Min(0)
  ratePerMinute!: number;

  @IsNumber()
  @Min(0)
  flatFee!: number;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}
