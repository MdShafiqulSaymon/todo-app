import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TodoAppsService } from '../todo-apps/todo-apps.service';
import { CollaboratorRole } from '../todo-apps/schemas/todo-app.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private todoAppsService: TodoAppsService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const todoApp = await this.todoAppsService.findOne(createTaskDto.todoAppId, userId);

    if (todoApp.ownerId.toString() !== userId) {
      const collaborator = todoApp.collaborators.find(c => 
        c.userId.toString() === userId && c.role === CollaboratorRole.EDITOR
      );
      
      if (!collaborator) {
        throw new ForbiddenException('You do not have permission to create tasks in this TodoApp');
      }
    }
    
    const newTask = new this.taskModel({
      ...createTaskDto,
      createdBy: userId,
    });
    return newTask.save();
  }

  async findAll(todoAppId: string, userId: string): Promise<Task[]> {
    await this.todoAppsService.findOne(todoAppId, userId);
    
    return this.taskModel.find({ todoAppId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    await this.todoAppsService.findOne(task.todoAppId.toString(), userId);
    
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    const todoApp = await this.todoAppsService.findOne(task.todoAppId.toString(), userId);
    
    if (todoApp.ownerId.toString() !== userId) {
      const collaborator = todoApp.collaborators.find(c => 
        c.userId.toString() === userId && c.role === CollaboratorRole.EDITOR
      );
      
      if (!collaborator) {
        throw new ForbiddenException('You do not have permission to update tasks in this TodoApp');
      }
    }
    
    const updatedTask = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true }).exec();
    
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID "${id}" not found after update attempt`);
    }
    
    return updatedTask;
  }

  async updateStatus(id: string, status: TaskStatus, userId: string): Promise<Task> {
    return this.update(id, { status } as UpdateTaskDto, userId);
  }

  async remove(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    const todoApp = await this.todoAppsService.findOne(task.todoAppId.toString(), userId);
    
    if (todoApp.ownerId.toString() !== userId) {
      const collaborator = todoApp.collaborators.find(c => 
        c.userId.toString() === userId && c.role === CollaboratorRole.EDITOR
      );
      
      if (!collaborator) {
        throw new ForbiddenException('You do not have permission to delete tasks in this TodoApp');
      }
    }
    
    const deletedTask = await this.taskModel.findByIdAndDelete(id).exec();
    
    if (!deletedTask) {
      throw new NotFoundException(`Task with ID "${id}" not found after delete attempt`);
    }
    
    return deletedTask;
  }
}