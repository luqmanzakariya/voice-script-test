import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum JobStatus {
  NEW = 'NEW',
  ASSIGNED = 'ASSIGNED',
  TRANSCRIBED = 'TRANSCRIBED',
  REVIEWED = 'REVIEWED',
  COMPLETED = 'COMPLETED',
}

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  caseName!: string;

  @Column()
  duration!: number;

  @Column()
  city!: string;

  @Column({
    type: 'enum',
    enum: ['PHYSICAL', 'REMOTE'],
  })
  locationType!: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.NEW,
  })
  status!: JobStatus;

  @ManyToOne(() => User, { nullable: true, eager: false })
  reporter!: User | null;

  @ManyToOne(() => User, { nullable: true, eager: false })
  editor!: User | null;

  @CreateDateColumn()
  createdAt!: Date;
}
