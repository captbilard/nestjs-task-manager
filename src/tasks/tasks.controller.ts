import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { TasksService } from './tasks.service';
import { TaskDto } from './dtos/create-task.dto';
import { GetTaskFiltersDto } from './dtos/get-TasksFilter.dto';
import { UpdateTaskStatusDto } from './dtos/update-TaskStatus.dto';
import { TaskEntity } from './tasks.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get('/:id')
  getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<TaskEntity> {
    return this.taskService.getTaskById(id, user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  createTask(
    @Body() body: TaskDto,
    @GetUser() user: User,
  ): Promise<TaskEntity> {
    return this.taskService.create(body, user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<TaskEntity | void> {
    return this.taskService.removeTask(id, user);
  }

  @Patch('/:id')
  updateTask(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
    @GetUser() user: User,
  ): Promise<TaskEntity> {
    return this.taskService.updateTaskStatus(id, status, user);
  }

  @Get()
  getAllTask(
    @Query() taskFilter: GetTaskFiltersDto,
    @GetUser() user: User,
  ): Promise<TaskEntity[]> {
    return this.taskService.getAllTask(taskFilter, user);
  }
}
