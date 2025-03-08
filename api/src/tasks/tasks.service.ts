import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from '@/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@/tasks/dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '@/tasks/entities/task.entity';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { UserWithoutPassword } from '@/users/types/user-without-password.type';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: createTaskDto.authorId,
      },
    });
    if (!user) {
      throw new HttpException(
        {
          message: 'User not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const newTask = new Task();
    newTask.content = createTaskDto.content;
    newTask.authorId = createTaskDto.authorId;
    const savedTask = await this.tasksRepository.save(newTask);
    return this.findOne(savedTask.id);
  }

  findAll(
    // user: UserWithoutPassword,
    authorId?: number,
  ) {
    // TODO: add authorization
    // if (user.role === 'normal' && user.id !== authorId) {
    //   throw new HttpException(
    //     {
    //       message: 'You are not allowed to access this resource',
    //     },
    //     HttpStatus.FORBIDDEN,
    //   );
    // }
    return this.tasksRepository.find({
      where: {
        authorId,
      },
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    return this.tasksRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        author: true,
      },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    await this.tasksRepository.update(id, updateTaskDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.tasksRepository.delete(id);
  }
}
