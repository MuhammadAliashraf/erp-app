import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Registration is handled in AuthController usually, but can be here too.
  // We'll keep it simple and allow creating users here or via Auth.
  
  @Post()
  create(@Body() createUserDto: any) {
    // This is a raw create, should ideally hash password here or in service.
    // For now, let AuthService handle registration logic which uses UsersService.
    // So this might be admin only or protected.
    return this.usersService.create(createUserDto);
  }
}
