import { Expose, Transform } from 'class-transformer';

export class JobResponseDto {
  @Expose()
  id!: number;

  @Expose()
  caseName!: string;

  @Expose()
  duration!: number;

  @Expose()
  city!: string;

  @Expose()
  locationType!: string;

  @Expose()
  status!: string;

  @Expose()
  @Transform(({ obj }) => obj.reporter?.id ?? null)
  reporterId!: number | null;
}
