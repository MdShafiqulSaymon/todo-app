import { Test, TestingModule } from '@nestjs/testing';
import { TodoAppsController } from './todo-apps.controller';

describe('TodoAppsController', () => {
  let controller: TodoAppsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoAppsController],
    }).compile();

    controller = module.get<TodoAppsController>(TodoAppsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
