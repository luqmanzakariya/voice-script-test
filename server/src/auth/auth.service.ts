import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(payload: LoginDto) {
    const user = await this.userService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(payload.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        role: user.role,
        email: user.email,
      }),
    };
  }

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });

    return {
      message: `User ${user.email} registered successfully`,
    };
  }
}
