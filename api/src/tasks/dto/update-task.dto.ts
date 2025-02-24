import { PartialType, PickType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '@/tasks/types/status.type';

export class UpdateTaskDto extends PartialType(
  PickType(CreateTaskDto, ['content']),
) {
  @IsOptional()
  @IsEnum(TaskStatus)
  taskStatus?: TaskStatus;
}
