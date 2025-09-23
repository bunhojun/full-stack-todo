import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { TasksService } from '@/tasks/tasks.service';
import { CreateTaskDto } from '@/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@/tasks/dto/update-task.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiQuery({
    name: 'authorId',
    type: Number,
    required: false,
    description: 'Filter tasks by authorId',
  })
  findAll(
    // TODO: add authorization or use role guard
    // @Request() req: { user: UserWithoutPassword },
    @Query('authorId', new DefaultValuePipe(-1), ParseIntPipe) authorId: number,
  ) {
    return this.tasksService.findAll(
      // req.user,
      authorId >= 0 ? authorId : undefined,
    );
  }

  @Get(':id')
  @ApiQuery({
    name: 'author',
    type: Boolean,
    required: false,
    description: 'Include author information',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
