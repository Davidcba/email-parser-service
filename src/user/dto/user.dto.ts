import { AutoMap } from '@automapper/classes';

export class UserDTO {
  @AutoMap()
  id: number;

  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;
}
