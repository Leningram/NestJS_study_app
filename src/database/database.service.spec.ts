import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { ConfigService } from '@nestjs/config';

jest.mock('@nestjs/config', () => ({
  ConfigService: class ConfigService {},
}));

describe('DatabaseService', () => {
  let service: DatabaseService;
  const configMock = {
    get: jest.fn(),
    getOrThrow: jest.fn().mockReturnValue('test-password'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        { provide: ConfigService, useValue: configMock },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
