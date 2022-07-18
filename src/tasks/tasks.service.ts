import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { TaskDto } from './dtos/create-task.dto';
import { GetTaskFiltersDto } from './dtos/get-TasksFilter.dto';
import { TaskRepository } from './tasks.repository';
import { TaskEntity } from './tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  async getTaskById(id: string): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({ where: { id: id } });

    if (!task) {
      throw new NotFoundException(`Task with ${id} not found`);
    }

    return task;
  }

  async create(taskDto: TaskDto, user: User): Promise<TaskEntity> {
    const { title, description } = taskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    return await this.taskRepository.save(task);
  }

  async removeTask(id: string): Promise<TaskEntity | void> {
    //this gives more call to the db so it's not optimal
    // const task = await this.getTaskById(id);

    // if (!task) {
    //   throw new NotFoundException('Task not found');
    // }

    // return this.taskRepository.remove(task);

    // the second method is more optimal for les calls to the db
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    } else {
      throw new HttpException(`Deleted successfully`, 200);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus) {
    const task = await this.getTaskById(id);
    task.status = status;

    return await this.taskRepository.save(task);
  }

  async getAllTask(taskFilter: GetTaskFiltersDto): Promise<TaskEntity[]> {
    const { status, search } = taskFilter;

    const query = this.taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }
}
