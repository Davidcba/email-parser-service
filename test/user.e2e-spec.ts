import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as supertest from 'supertest';
const request = supertest.default;

import { AppModule } from '../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('valid input map', async () => {
    const res = await request(app.getHttpServer())
      .post('/user')
      .send({
        id: 1,
        first_name: 'Rafa',
        last_name: 'Nadal',
      })
      .expect(201);

      expect(res.body).toEqual({
        firstName: 'Rafa',
        lastName: 'Nadal',
      });
  });

  it('no last_name', async () => {
    const res = await request(app.getHttpServer())
      .post('/user')
      .send({
        id: 2,
        first_name: 'Roger',
      })
      .expect(400);

      expect(res.body.message).toContain('last_name should not be empty');
  });

  it('unexpected fields case ', async () => {
    const res = await request(app.getHttpServer())
      .post('/user')
      .send({
        id: 3,
        first_name: 'Novak',
        last_name: 'Djokovic',
        injected: true,
      })
      .expect(400);

      expect(res.body.message[0]).toMatch(/property .* should not exist/);
  });
});
