import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { TodoAppsService } from './todo-apps.service';
  import { CreateTodoAppDto } from './dto/create-todo-app.dto';
  import { UpdateTodoAppDto } from './dto/update-todo-app.dto';
  import { AddCollaboratorDto } from './dto/add-collaborator.dto';
  import { TodoAppPermissionsGuard } from '../shared/guards/permissions.guard';
  import { Roles } from '../shared/decorators/roles.decorator';
  import { CollaboratorRole } from './schemas/todo-app.schema';
  
  @Controller('todo-apps')
  @UseGuards(AuthGuard('jwt'))
  export class TodoAppsController {
    constructor(private readonly todoAppsService: TodoAppsService) {}
  
    @Post()
    create(@Body() createTodoAppDto: CreateTodoAppDto, @Request() req) {
      return this.todoAppsService.create(createTodoAppDto, req.user.userId);
    }
  
    @Get()
    findAll(@Request() req) {
      return this.todoAppsService.findAll(req.user.userId);
    }
  
    @Get(':id')
    @UseGuards(TodoAppPermissionsGuard)
    @Roles(CollaboratorRole.VIEWER)
    findOne(@Param('id') id: string, @Request() req) {
      return this.todoAppsService.findOne(id, req.user.userId);
    }
  
    @Patch(':id')
    @UseGuards(TodoAppPermissionsGuard)
    @Roles(CollaboratorRole.EDITOR)
    update(
      @Param('id') id: string,
      @Body() updateTodoAppDto: UpdateTodoAppDto,
      @Request() req,
    ) {
      return this.todoAppsService.update(id, updateTodoAppDto, req.user.userId);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
      return this.todoAppsService.remove(id, req.user.userId);
    }
  
    @Post(':id/collaborators')
    addCollaborator(
      @Param('id') id: string,
      @Body() addCollaboratorDto: AddCollaboratorDto,
      @Request() req,
    ) {
      return this.todoAppsService.addCollaborator(
        id,
        addCollaboratorDto.email,
        addCollaboratorDto.role,
        req.user.userId,
      );
    }
  
    @Delete(':id/collaborators/:collaboratorId')
    removeCollaborator(
      @Param('id') id: string,
      @Param('collaboratorId') collaboratorId: string,
      @Request() req,
    ) {
      return this.todoAppsService.removeCollaborator(
        id,
        collaboratorId,
        req.user.userId,
      );
    }
  }