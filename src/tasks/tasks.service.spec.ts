import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { DatabaseService } from '../database/database.service';

jest.mock('../database/database.service', () => ({
  DatabaseService: class DatabaseService {},
}));

describe('TasksService', () => {
  let service: TasksService;
  const databaseMock = { query: jest.fn() };

  beforeEach(async () => {
    databaseMock.query.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: DatabaseService, useValue: databaseMock },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return tasks array', async () => {
    const tasks = [{ id: 1, title: 'Тестовая задача', completed: false }];
    databaseMock.query.mockResolvedValue({ rows: tasks });
    await expect(service.getTasks()).resolves.toEqual(tasks);
    expect(databaseMock.query).toHaveBeenCalledWith(
      'SELECT id, title, completed FROM tasks ORDER BY id',
    );
  });

  it('should create a task', async () => {
    const task = {
      id: 1,
      title: 'Новая тестовая задача',
      completed: false,
    };
    databaseMock.query.mockResolvedValue({ rows: [task] });
    await expect(service.createTask('Новая тестовая задача')).resolves.toEqual(
      task,
    );

    expect(databaseMock.query).toHaveBeenCalledWith(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, completed',
      ['Новая тестовая задача'],
    );
  });

  it('should return task by id', async () => {
    const task = { id: 1, title: 'Тестовая задача', completed: false };
    databaseMock.query.mockResolvedValue({ rows: [task] });
    await expect(service.getTaskById(1)).resolves.toEqual(task);
    expect(databaseMock.query).toHaveBeenCalledWith(
      'SELECT id, title, completed FROM tasks WHERE id = $1',
      [1],
    );
  });

  it('should throw NotFoundException if task is not found', async () => {
    databaseMock.query.mockResolvedValue({ rows: [] });
    await expect(service.getTaskById(9999)).rejects.toThrow('Task not found');

    expect(databaseMock.query).toHaveBeenCalledWith(
      'SELECT id, title, completed FROM tasks WHERE id = $1',
      [9999],
    );
  });

  it('should update task', async () => {
    const task = { id: 1, title: 'Обновленная задача', completed: false };
    databaseMock.query.mockResolvedValue({ rows: [task] });

    await expect(
      service.updateTask(1, { title: 'Обновленная задача' }),
    ).resolves.toEqual(task);
    expect(databaseMock.query).toHaveBeenCalledWith(
      'UPDATE tasks SET title = COALESCE($1, title), completed = COALESCE($2, completed) WHERE id = $3 RETURNING id, title, completed',
      [task.title, undefined, task.id],
    );
  });

  it('should throw NotFoundException when task not found', async () => {
    databaseMock.query.mockResolvedValue({ rows: [] });

    await expect(
      service.updateTask(999, { title: 'Обновленная задача' }),
    ).rejects.toThrow('Task not found');

    expect(databaseMock.query).toHaveBeenCalledWith(
      'UPDATE tasks SET title = COALESCE($1, title), completed = COALESCE($2, completed) WHERE id = $3 RETURNING id, title, completed',
      ['Обновленная задача', undefined, 999],
    );
  });

  it('should delete task', async () => {
    databaseMock.query.mockResolvedValue({ rows: [{ id: 1 }] });
    await expect(service.deleteTask(1)).resolves.toBeUndefined();
    expect(databaseMock.query).toHaveBeenCalledWith(
      'DELETE FROM tasks WHERE id = $1 RETURNING id',
      [1],
    );
  });

  it('should throw NotFoundException when task not found', async () => {
    databaseMock.query.mockResolvedValue({ rows: [] });
    await expect(service.deleteTask(999)).rejects.toThrow('Task not found');
    expect(databaseMock.query).toHaveBeenCalledWith(
      'DELETE FROM tasks WHERE id = $1 RETURNING id',
      [999],
    );
  });
});
