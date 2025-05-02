import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailParserService } from './email-parser.service';

@Module({
  controllers: [EmailController],
  providers: [EmailParserService],
})
export class EmailModule {}
