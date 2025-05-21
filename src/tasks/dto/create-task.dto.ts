import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../schemas/task.schema';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.STALE;

  @IsMongoId()
  @IsNotEmpty()
  todoAppId: string;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
}