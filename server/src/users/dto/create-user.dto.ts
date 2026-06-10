import { IsString, IsNotEmpty, IsNumber, Min, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

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
