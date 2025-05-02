import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { MapperModule } from './mapper/mapper.module';
import { UserController } from './user/user.controller';

@Module({
  imports: [UserModule, EmailModule, MapperModule],
  controllers: [UserController],
  providers: []
})
export class AppModule {}
