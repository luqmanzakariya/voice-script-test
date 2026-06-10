import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Job } from '../../jobs/entities/job.entities';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false, eager: false })
  user!: User;

  @ManyToOne(() => Job, { nullable: false, eager: false })
  job!: Job;

  @Column()
  caseName!: string;

  @Column()
  duration!: number;

  @Column()
  role!: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  earnings!: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  rateApplied!: number;

  @Column()
  rateType!: string; // 'PER_MINUTE' | 'FLAT_FEE'

  @CreateDateColumn()
  calculatedAt!: Date;
}
