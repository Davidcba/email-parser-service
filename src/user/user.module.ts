import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MapperModule } from '../mapper/mapper.module';

@Module({
  imports: [MapperModule],
  controllers: [UserController],
})
export class UserModule {}
