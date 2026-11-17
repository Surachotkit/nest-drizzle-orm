import { z } from 'zod';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { createUserSchema, idSchema, updateUserSchema } from './users.schemas.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', { schema: idSchema }) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body({ schema: createUserSchema }) body: z.infer<typeof createUserSchema>) {
    return this.usersService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', { schema: idSchema }) id: number,
    @Body({ schema: updateUserSchema })
    body: z.infer<typeof updateUserSchema>,
  ) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', { schema: idSchema }) id: number) {
    return this.usersService.remove(id);
  }
}
