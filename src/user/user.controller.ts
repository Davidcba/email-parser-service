import { Controller, Post, Body } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { SourceUser } from './dto/source-user.dto';
import { UserDTO } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(@InjectMapper() private readonly mapper: Mapper) {}

  @Post()
  mapUser(@Body() body: SourceUser): UserDTO {
    return this.mapper.map(body, SourceUser, UserDTO); 
  }
}
