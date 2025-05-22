
import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
