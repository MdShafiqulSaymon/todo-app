import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoAppDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}