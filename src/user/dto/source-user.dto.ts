import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class SourceUser {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;
}
