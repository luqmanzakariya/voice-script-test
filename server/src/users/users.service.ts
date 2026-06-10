import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JobStatus } from '../jobs/entities/job.entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      available: true,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async setAvailable(id: number, available: boolean) {
    await this.findById(id);
    await this.usersRepository.update(id, { available });
  }

  async findByJobStatus(jobStatus: JobStatus) {
    const roleMap: Partial<Record<JobStatus, UserRole>> = {
      [JobStatus.NEW]: UserRole.REPORTER,
      [JobStatus.REVIEWED]: UserRole.EDITOR,
    };

    const role = roleMap[jobStatus];

    if (!role) {
      throw new BadRequestException(
        `No user role mapped for job status "${jobStatus}"`,
      );
    }

    return this.usersRepository.find({ where: { role } });
  }

  async findByRole(role: UserRole) {
    return this.usersRepository.find({ where: { role, available: true } });
  }
}
