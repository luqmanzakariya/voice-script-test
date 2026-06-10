import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsEnum,
  ValidateIf,
} from 'class-validator';
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

  @ValidateIf((o) => o.role === UserRole.REPORTER)
  @IsNumber()
  @Min(0)
  ratePerMinute?: number;

  @ValidateIf((o) => o.role === UserRole.EDITOR)
  @IsNumber()
  @Min(0)
  flatFee?: number;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}
