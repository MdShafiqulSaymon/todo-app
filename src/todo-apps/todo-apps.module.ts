import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoAppsService } from './todo-apps.service';
import { TodoAppsController } from './todo-apps.controller';
import { TodoApp, TodoAppSchema } from './schemas/todo-app.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TodoApp.name, schema: TodoAppSchema }]),
    UsersModule,
  ],
  controllers: [TodoAppsController],
  providers: [TodoAppsService],
  exports: [TodoAppsService],
})
export class TodoAppsModule {}