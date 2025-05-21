import { SetMetadata } from '@nestjs/common';
import { CollaboratorRole } from '../../todo-apps/schemas/todo-app.schema';

export const Roles = (role: CollaboratorRole) => SetMetadata('role', role);
