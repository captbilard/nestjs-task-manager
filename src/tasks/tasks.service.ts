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

  async getTaskById(id: string, user: User): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id: id, user: user },
    });

    if (!task) {
      throw new NotFoundException(`Task with id: "${id}" not found`);
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

  async removeTask(id: string, user: User): Promise<TaskEntity | void> {
    //this gives more call to the db so it's not optimal
    // const task = await this.getTaskById(id);

    // if (!task) {
    //   throw new NotFoundException('Task not found');
    // }

    // return this.taskRepository.remove(task);

    // the second method is more optimal for les calls to the db
    const result = await this.taskRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    } else {
      throw new HttpException(`Deleted successfully`, 200);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User) {
    const task = await this.getTaskById(id, user);
    task.status = status;

    return await this.taskRepository.save(task);
  }

  async getAllTask(
    taskFilter: GetTaskFiltersDto,
    user: User,
  ): Promise<TaskEntity[]> {
    const { status, search } = taskFilter;

    const query = this.taskRepository.createQueryBuilder('task');
    query.andWhere({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      //take note of the parenthesis covering the entire query, this makes the query builder treat them all as one huge query instead of a seperated queries.
      //Check older commit to have further understanding and the NestJs Zero to Hero course 75
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }
}
