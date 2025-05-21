import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { TodoApp } from '../../todo-apps/schemas/todo-app.schema';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  STALE = 'stale',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ 
    required: true, 
    enum: TaskStatus, 
    default: TaskStatus.STALE 
  })
  status: TaskStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TodoApp', required: true })
  todoAppId: TodoApp;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop()
  dueDate: Date;

  @Prop({ enum: TaskPriority })
  priority: TaskPriority;
}

export const TaskSchema = SchemaFactory.createForClass(Task);