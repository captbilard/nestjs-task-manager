import { EntityRepository, Repository } from 'typeorm';
import { TaskDto } from './dtos/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { TaskEntity } from './tasks.entity';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {}
