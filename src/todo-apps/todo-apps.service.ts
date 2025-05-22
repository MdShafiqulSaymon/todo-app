import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoApp, TodoAppDocument, CollaboratorRole } from './schemas/todo-app.schema';
import { CreateTodoAppDto } from './dto/create-todo-app.dto';
import { UpdateTodoAppDto } from './dto/update-todo-app.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TodoAppsService {
  constructor(
    @InjectModel(TodoApp.name) private todoAppModel: Model<TodoAppDocument>,
    private usersService: UsersService,
  ) {}

  async create(createTodoAppDto: CreateTodoAppDto, userId: string): Promise<TodoApp> {
    const newTodoApp = new this.todoAppModel({
      ...createTodoAppDto,
      ownerId: userId,
    });
    return newTodoApp.save();
  }

  async findAll(userId: string): Promise<TodoApp[]> {
    return this.todoAppModel.find({
      $or: [
        { ownerId: userId },
        { 'collaborators.userId': userId },
      ],
    }).exec();
  }

  async findOne(id: string, userId: string): Promise<TodoApp> {
    // console.log(id);
    const todoApp = await this.todoAppModel.findOne({
      _id: id,
      $or: [
        { ownerId: userId },
        { 'collaborators.userId': userId },
      ],
    }).exec();
    //console.log(todoApp);
    if (!todoApp) {
      throw new NotFoundException(`TodoApp with ID "${id}" not found or you don't have access`);
    }

    return todoApp;
  }

  async update(id: string, updateTodoAppDto: UpdateTodoAppDto, userId: string): Promise<TodoApp> {
    const todoApp = await this.todoAppModel.findOne({ _id: id }).exec();
    
    if (!todoApp) {
      throw new NotFoundException(`TodoApp with ID "${id}" not found`);
    }
    
    if (todoApp.ownerId.toString() !== userId) {
      const collaborator = todoApp.collaborators.find(c => 
        c.userId.toString() === userId && c.role === CollaboratorRole.EDITOR
      );
      
      if (!collaborator) {
        throw new ForbiddenException('You do not have permission to update this TodoApp');
      }
    }
    
    const updatedTodoApp = await this.todoAppModel.findByIdAndUpdate(
      id, 
      updateTodoAppDto, 
      { new: true }
    ).exec();
    
    if (!updatedTodoApp) {
      throw new NotFoundException(`TodoApp with ID "${id}" not found after update attempt`);
    }
    
    return updatedTodoApp;
  }

  async remove(id: string, userId: string): Promise<TodoApp> {
    const todoApp = await this.todoAppModel.findOne({ _id: id }).exec();
    
    if (!todoApp) {
      throw new NotFoundException(`TodoApp with ID "${id}" not found`);
    }
    
    if (todoApp.ownerId.toString() !== userId) {
      throw new ForbiddenException('Only the owner can delete a TodoApp');
    }
    
    const deletedTodoApp = await this.todoAppModel.findByIdAndDelete(id).exec();
    
    if (!deletedTodoApp) {
      throw new NotFoundException(`TodoApp with ID "${id}" not found after delete attempt`);
    }
    
    return deletedTodoApp;
  }

  async addCollaborator(todoAppId: string, collaboratorEmail: string, role: CollaboratorRole, userId: string): Promise<TodoApp> {
    const todoApp = await this.todoAppModel.findOne({ _id: todoAppId }).exec();
    
    if (!todoApp) {
      throw new NotFoundException(`TodoApp with ID "${todoAppId}" not found`);
    }
    
    if (todoApp.ownerId.toString() !== userId) {
      throw new ForbiddenException('Only the owner can add collaborators');
    }
    
    // Solution using destructuring with type casting
    const collaborator = await this.usersService.findByEmail(collaboratorEmail);
    if (!collaborator) {
      throw new NotFoundException(`User with email "${collaboratorEmail}" not found`);
    }
    
    // TypeScript fix: Destructure with type casting
    type UserWithId = { _id: string | any };
    const { _id: collaboratorId } = collaborator as UserWithId;
    
    // Check if already a collaborator
    const existingCollaborator = todoApp.collaborators.find(
      c => c.userId.toString() === (typeof collaboratorId === 'string' ? collaboratorId : collaboratorId.toString())
    );
    
    if (existingCollaborator) {
      // Update role if different
      if (existingCollaborator.role !== role) {
        const findForUndateColaborators = await this.todoAppModel.findOneAndUpdate(
          { _id: todoAppId, 'collaborators.userId': collaboratorId },
          { $set: { 'collaborators.$.role': role } },
          { new: true }
        ).exec();
        if (!findForUndateColaborators) {
          throw new NotFoundException(`Problem while adding colaborator ID "${todoAppId}" not found after removing collaborator attempt`);
        }
        return findForUndateColaborators;
      }
      return todoApp;
    }
    
    // Add new collaborator
    const addColl = await this.todoAppModel.findByIdAndUpdate(
      todoAppId,
      { $push: { collaborators: { userId: collaboratorId, role } } },
      { new: true }
    ).exec();
    if (!addColl) {
      throw new NotFoundException(`Problem while adding colaborator ID "${todoAppId}" not found after removing collaborator attempt`);
    }
  
    return addColl;
  }

  async removeCollaborator(todoAppId: string, collaboratorId: string, userId: string): Promise<TodoApp> {
    const todoApp = await this.todoAppModel.findOne({ _id: todoAppId }).exec();
    
    if (!todoApp) {
      throw new NotFoundException(`TodoApp with ID "${todoAppId}" not found`);
    }
    
    if (todoApp.ownerId.toString() !== userId) {
      throw new ForbiddenException('Only the owner can remove collaborators');
    }
    
    const updatedTodoApp = await this.todoAppModel.findByIdAndUpdate(
      todoAppId,
      { $pull: { collaborators: { userId: collaboratorId } } },
      { new: true }
    ).exec();
    
    if (!updatedTodoApp) {
      throw new NotFoundException(`TodoApp with ID "${todoAppId}" not found after removing collaborator attempt`);
    }
    
    return updatedTodoApp;
  }
}