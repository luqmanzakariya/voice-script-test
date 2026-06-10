import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entities';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), UsersModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
