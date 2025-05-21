import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, TaskSchema } from './schemas/task.schema';
import { TodoAppsModule } from '../todo-apps/todo-apps.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    TodoAppsModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}