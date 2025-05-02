import { IsString, IsNotEmpty } from 'class-validator';

export class EmailParseDto {
  @IsString()
  @IsNotEmpty()
  path: string;
}