import { Controller, Get, Query } from '@nestjs/common';
import { EmailParserService } from './email-parser.service';
import { EmailParseDto } from './dto/email-parse.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailParserService) {}

  @Get('parse')
  async parseEmail(@Query() query: EmailParseDto) {
    return await this.emailService.extractJsonFromEmail(query.path);
  }
}
