import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TodoAppsService } from '../../todo-apps/todo-apps.service';
import { CollaboratorRole } from '../../todo-apps/schemas/todo-app.schema';

@Injectable()
export class TodoAppPermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private todoAppsService: TodoAppsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<CollaboratorRole>(
      'role',
      context.getHandler(),
    );
    
    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    

    let todoAppId = null;

    if (request.params && request.params.todoAppId) {
      todoAppId = request.params.todoAppId;
    } 

    else if (request.body && request.body.todoAppId) {
      todoAppId = request.body.todoAppId;
    } 

    else if (request.query) {
      todoAppId = request.query.todoAppId;
    }
    
    if (!todoAppId) {
      // console.log('No todoAppId found in the request', { 
      //   params: request.params, 
      //   body: request.body,
      //   query: request.query
      // });
      return true;
    }

    try {
      const todoApp = await this.todoAppsService.findOne(todoAppId, user.userId);

      if (todoApp.ownerId.toString() === user.userId) {
        return true;
      }

      const collaborator = todoApp.collaborators.find(c => 
        c.userId.toString() === user.userId
      );
      
      if (!collaborator) {
        throw new ForbiddenException('You do not have access to this TodoApp');
      }

      if (requiredRole === CollaboratorRole.VIEWER) {
        return true;
      } else if (requiredRole === CollaboratorRole.EDITOR) {
        return collaborator.role === CollaboratorRole.EDITOR;
      }
      
      return false;
    } catch (error) {
      console.error('Error in permissions guard:', error);
      throw new ForbiddenException('Access denied');
    }
  }
}