import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type TodoAppDocument = TodoApp & Document;

export enum CollaboratorRole {
  VIEWER = 'viewer',
  EDITOR = 'editor',
}

export class Collaborator {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ 
    required: true, 
    enum: CollaboratorRole, 
    default: CollaboratorRole.VIEWER 
  })
  role: CollaboratorRole;
}

@Schema({ timestamps: true })
export class TodoApp {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: User;

  @Prop({ type: [{ userId: { type: MongooseSchema.Types.ObjectId, ref: 'User' }, role: String }], default: [] })
  collaborators: Collaborator[];
}

export const TodoAppSchema = SchemaFactory.createForClass(TodoApp);