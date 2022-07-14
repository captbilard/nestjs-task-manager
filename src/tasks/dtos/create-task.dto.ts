import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class TaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
