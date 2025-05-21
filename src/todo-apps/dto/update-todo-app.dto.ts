import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoAppDto } from './create-todo-app.dto';

export class UpdateTodoAppDto extends PartialType(CreateTodoAppDto) {}
