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
});
