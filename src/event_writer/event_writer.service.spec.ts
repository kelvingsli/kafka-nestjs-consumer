import { Test, TestingModule } from '@nestjs/testing';
import { EventWriterService } from './event_writer.service';

describe('EventWriterService', () => {
  let service: EventWriterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventWriterService],
    }).compile();

    service = module.get<EventWriterService>(EventWriterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
