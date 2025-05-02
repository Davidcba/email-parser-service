import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { UserDTO } from '../user/dto/user.dto';
import { SourceUser } from '../user/dto/source-user.dto';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        SourceUser,
        UserDTO,
        forMember((d) => d.firstName, mapFrom((s) => s.first_name)),
        forMember((d) => d.lastName, mapFrom((s) => s.last_name))
      );
    };
  }
}
