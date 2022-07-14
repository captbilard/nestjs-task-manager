import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { TasksService } from './tasks.service';
import { TaskDto } from './dtos/create-task.dto';
import { GetTaskFiltersDto } from './dtos/get-TasksFilter.dto';
import { UpdateTaskStatusDto } from './dtos/update-TaskStatus.dto';
import { TaskEntity } from './tasks.entity';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get('/:id')
  getTask(@Param('id') id: string): Promise<TaskEntity> {
    return this.taskService.getTaskById(id);
  }

  @Post()
  createTask(@Body() body: TaskDto): Promise<TaskEntity> {
    return this.taskService.create(body);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<TaskEntity | void> {
    return this.taskService.removeTask(id);
  }

  @Patch('/:id')
  updateTask(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Promise<TaskEntity> {
    return this.taskService.updateTaskStatus(id, status);
  }

  @Get()
  getAllTask(@Query() taskFilter: GetTaskFiltersDto): Promise<TaskEntity[]> {
    return this.taskService.getAllTask(taskFilter);
  }
}
