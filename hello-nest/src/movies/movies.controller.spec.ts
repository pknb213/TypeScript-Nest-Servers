import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';

describe('MoviesController', () => {
  let controller: MoviesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const mockFn = jset.fn()

  const boundMockFn = mockFn.bind(thisContext0);
  boundMockFn('a', 'b');
  mockFn.call(thisContext1, 'a', 'b');
  mockFn.apply(thisContext2, ['a', 'b']);

  mockFn.mock.contexts[0] === thisContext0; // true
  mockFn.mock.contexts[1] === thisContext1; // true
  mockFn.mock.contexts[2] === thisContext2; // true

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
