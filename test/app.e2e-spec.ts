import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('API (e2e)', () => {
  let app: INestApplication<App>;
  let tasksPath = '/tasks';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET / returns the greeting', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('PATCH /tasks/:id updates a task and returns it', async () => {
    const response = await request(app.getHttpServer())
      .patch(`${tasksPath}/1`)
      .send({ title: 'Обновленный заголовок' })
      .expect(200);
    expect(response.body).toEqual({
      id: 1,
      title: 'Обновленный заголовок',
      completed: true,
    });
  });

  it('PATCH /tasks/:id returns 404 when the task does not exist', () => {
    return request(app.getHttpServer())
      .patch(`${tasksPath}/999`)
      .send({
        title: 'Обновленый заголовок',
      })
      .expect(404);
  });

  it('DELETE /tasks/:id returns 204 and removes the task', async () => {
    await request(app.getHttpServer()).delete(`${tasksPath}/1`).expect(204);
    await request(app.getHttpServer()).get(`${tasksPath}/1`).expect(404);
  });

  it('DELETE /tasks/:id returns 404 when the task does not exist', () => {
    return request(app.getHttpServer()).delete(`${tasksPath}/999`).expect(404);
  });

  afterEach(async () => {
    await app.close();
  });
});
