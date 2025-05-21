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
    Query,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { TasksService } from './tasks.service';
  import { CreateTaskDto } from './dto/create-task.dto';
  import { UpdateTaskDto } from './dto/update-task.dto';
  import { UpdateTaskStatusDto } from './dto/update-task.dto';
  import { TodoAppPermissionsGuard } from '../shared/guards/permissions.guard';
  import { Roles } from '../shared/decorators/roles.decorator';
  import { CollaboratorRole } from '../todo-apps/schemas/todo-app.schema';
  
  @Controller('tasks')
  @UseGuards(AuthGuard('jwt'))
  export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
  
    @Post()
    @UseGuards(TodoAppPermissionsGuard)
    @Roles(CollaboratorRole.EDITOR)
    create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
      return this.tasksService.create(createTaskDto, req.user.userId);
    }
  
    @Get()
    @UseGuards(TodoAppPermissionsGuard)
    @Roles(CollaboratorRole.VIEWER)
    findAll(@Query('todoAppId') todoAppId: string, @Request() req) {
      return this.tasksService.findAll(todoAppId, req.user.userId);
    }
  
    @Get(':id')
    @UseGuards(TodoAppPermissionsGuard)
    @Roles(CollaboratorRole.VIEWER)
    findOne(@Param('id') id: string, @Request() req) {
      return this.tasksService.findOne(id, req.user.userId);
    }
  
    @Patch(':id')
    @UseGuards(TodoAppPermissionsGuard)
    @Roles(CollaboratorRole.EDITOR)
    update(
      @Param('id') id: string,
      @Body() updateTaskDto: UpdateTaskDto,
      @Request() req,
    ) {
      return this.tasksService.update(id, updateTaskDto, req.user.userId);
    }
  
    @Patch(':id/status')
    @UseGuards(TodoAppPermissionsGuard)
    @Roles(CollaboratorRole.EDITOR)
    updateStatus(
      @Param('id') id: string,
      @Body() updateTaskStatusDto: UpdateTaskStatusDto,
      @Request() req,
    ) {
      return this.tasksService.updateStatus(
        id,
        updateTaskStatusDto.status,
        req.user.userId,
      );
    }
  
    @Delete(':id')
    @UseGuards(TodoAppPermissionsGuard)
    @Roles(CollaboratorRole.EDITOR)
    remove(@Param('id') id: string, @Request() req) {
      return this.tasksService.remove(id, req.user.userId);
    }
  }