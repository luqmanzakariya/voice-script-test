import {
  Get,
  Controller,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  getAllPayments() {
    return this.paymentService.getAllPayments();
  }

  @Roles(UserRole.ADMIN)
  @Get('user/:userId')
  getPaymentsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.paymentService.getPaymentsByUserId(userId);
  }
}
