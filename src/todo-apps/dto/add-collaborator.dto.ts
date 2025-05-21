import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { CollaboratorRole } from '../schemas/todo-app.schema';

export class AddCollaboratorDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(CollaboratorRole)
  @IsNotEmpty()
  role: CollaboratorRole;
}
