import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DatabaseService } from '../src/database/database.service';

describe('API (e2e)', () => {
  let app: INestApplication<App>;
  let tasksPath = '/tasks';

  beforeEach(async () => {
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
    const database = app.get(DatabaseService);
    await database.query('TRUNCATE TABLE tasks RESTART IDENTITY');
    await database.query(
      "INSERT INTO tasks (title, completed) VALUES('Первая задача', true), ('Вторая задача', false)",
    );
  });

  it('GET /tasks returns 200 and tasks', async () => {
    const response = await request(app.getHttpServer())
      .get(`${tasksPath}`)
      .expect(200);
    const tasks = response.body;
    expect(tasks).toHaveLength(2);
    expect(tasks[0]).toEqual({
      id: 1,
      title: 'Первая задача',
      completed: true,
    });
  });

  it('GET /tasks/1 returns 200 and a task', async () => {
    const response = await request(app.getHttpServer())
      .get(`${tasksPath}/1`)
      .expect(200);
    expect(response.body).toEqual({
      id: 1,
      title: 'Первая задача',
      completed: true,
    });
  });

  it('GET /tasks/:id returns 400 if the id is not integer', () => {
    return request(app.getHttpServer()).get(`${tasksPath}/wrong`).expect(400);
  });

  it('POST /tasks returns 201', async () => {
    const testTaskTitle = 'Новая задача для тестов';
    const response = await request(app.getHttpServer())
      .post(tasksPath)
      .send({ title: testTaskTitle })
      .expect(201);
    expect(response.body).toEqual({
      title: testTaskTitle,
      id: 3,
      completed: false,
    });
  });

  it('POST /tasks returns 400 when title is empty', () => {
    return request(app.getHttpServer())
      .post(tasksPath)
      .send({ title: '' })
      .expect(400);
  });

  it('POST /tasks returns 400 when send nonWhitelisted property', () => {
    return request(app.getHttpServer())
      .post(tasksPath)
      .send({ title: 'Обновленный заголовок', extra: true })
      .expect(400);
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

  it('PATCH /tasks/:id updates a task and returns it', async () => {
    const response = await request(app.getHttpServer())
      .patch(`${tasksPath}/1`)
      .send({ completed: false })
      .expect(200);
    expect(response.body).toEqual({
      id: 1,
      title: 'Первая задача',
      completed: false,
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

  it('PATCH /tasks/:id returns 400 when if send wrong property', () => {
    return request(app.getHttpServer())
      .patch(`${tasksPath}/1`)
      .send({
        title: 'Обновленый заголовок',
        extra: true,
      })
      .expect(400);
  });

  it('PATCH /tasks/:id returns 400 when the title is not string', () => {
    return request(app.getHttpServer())
      .patch(`${tasksPath}/1`)
      .send({
        title: 123,
      })
      .expect(400);
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
