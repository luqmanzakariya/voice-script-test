import { Controller } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() payload: LoginDto) {
    // Implement login logic here
    return this.authService.login(payload);
  }

  @Post('register')
  register(@Body() payload: RegisterDto) {
    // Implement registration logic here
    return this.authService.register(payload);
  }
}
