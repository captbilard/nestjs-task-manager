import { EntityRepository, Repository } from 'typeorm';
import { TaskDto } from './dtos/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { TaskEntity } from './tasks.entity';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async createTask(task: TaskDto) {
    const { title, description, status } = task;
    if (status) {
      const task = this.create({
        title,
        description,
        status,
      });
    } else {
      const status = TaskStatus.OPEN;
      const task = this.create({
        title,
        description,
        status,
      });
    }

    return await this.save(task);
  }
}
