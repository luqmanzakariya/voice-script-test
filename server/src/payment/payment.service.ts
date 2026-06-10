import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../jobs/entities/job.entities';
import { Payment } from './entities/payment.entity';
// import { EDITOR_FLAT_FEE, REPORTER_RATE_PER_MINUTE } from './payment.constants';
// import { UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
// import { CreatePaymentDto } from './dto/create.dto';

export interface JobEarning {
  jobId: number;
  caseName: string;
  duration: number;
  earnings: number;
}

export interface PaymentSummary {
  userId: number;
  name: string;
  role: string;
  rateInfo: string;
  jobs: JobEarning[];
  totalEarnings: number;
}

@Injectable()
export class PaymentService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async generatePaymentsForUser(job: Job) {
    const reporter = await this.usersService.findById(job.reporter?.id || 0);
    if (!reporter) {
      throw new NotFoundException(
        `Reporter with id ${job.reporter?.id} not found`,
      );
    }

    const editor = await this.usersService.findById(job.editor?.id || 0);
    if (!editor) {
      throw new NotFoundException(`Editor with id ${job.editor?.id} not found`);
    }

    if (reporter) {
      const paymentReporter = this.paymentRepository.create({
        user: reporter,
        job: { id: job.id } as Job,
        caseName: job.caseName,
        duration: job.duration,
        role: reporter.role,
        earnings: job.duration * (reporter.ratePerMinute || 0),
        rateApplied: reporter.ratePerMinute || 0,
        rateType: 'PER_MINUTE',
      });
      await this.paymentRepository.save(paymentReporter);
    }

    if (editor) {
      const paymentEditor = this.paymentRepository.create({
        user: editor,
        job: { id: job.id } as Job,
        caseName: job.caseName,
        duration: job.duration,
        role: editor.role,
        earnings: editor.flatFee || 0,
        rateApplied: editor.flatFee || 0,
        rateType: 'FLAT_FEE',
      });
      await this.paymentRepository.save(paymentEditor);
    }
  }

  async getPaymentsByUserId(userId: number) {
    const user = await this.usersService.findById(userId);

    const payments = await this.paymentRepository.find({
      where: { user: { id: userId } },
      relations: { job: true },
      order: { calculatedAt: 'DESC' },
    });

    const jobs = payments.map((p) => ({
      paymentId: p.id,
      jobId: p.job.id,
      caseName: p.caseName,
      duration: p.duration,
      rateType: p.rateType,
      rateApplied: Number(p.rateApplied),
      earnings: Number(p.earnings),
      calculatedAt: p.calculatedAt,
    }));

    const totalEarnings = jobs.reduce((sum, j) => sum + j.earnings, 0);

    return {
      userId: user.id,
      name: user.name,
      role: user.role,
      totalEarnings,
      jobs,
    };
  }

  async getAllPayments() {
    const payments = await this.paymentRepository.find({
      relations: { user: true, job: true },
    });

    return payments.map((p) => ({
      id: p.id,
      caseName: p.caseName,
      duration: p.duration,
      role: p.role,
      rateType: p.rateType,
      rateApplied: Number(p.rateApplied),
      earnings: Number(p.earnings),
      calculatedAt: p.calculatedAt,
      user: {
        id: p.user.id,
        name: p.user.name,
        role: p.user.role,
      },
      job: {
        id: p.job.id,
      },
    }));
  }
}
