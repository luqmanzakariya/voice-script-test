import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  REPORTER = 'REPORTER',
  EDITOR = 'EDITOR',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  @Column()
  city!: string;

  @Column({
    default: true,
  })
  available!: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role!: UserRole;

  @Column({
    nullable: true,
  })
  ratePerMinute!: number;

  @Column({
    nullable: true,
  })
  flatFee!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
