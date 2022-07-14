import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTaskFiltersDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;

  @IsOptional()
  @IsString()
  search: string;
}
