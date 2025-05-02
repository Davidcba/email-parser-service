import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { MapperModule } from '../mapper/mapper.module';
import { UserProfile } from '../mapper/user.profile';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
      ],
      controllers: [UserController],
      providers: [UserProfile],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
