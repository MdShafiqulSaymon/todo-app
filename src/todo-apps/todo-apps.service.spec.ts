import { Test, TestingModule } from '@nestjs/testing';
import { TodoAppsService } from './todo-apps.service';

describe('TodoAppsService', () => {
  let service: TodoAppsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoAppsService],
    }).compile();

    service = module.get<TodoAppsService>(TodoAppsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
