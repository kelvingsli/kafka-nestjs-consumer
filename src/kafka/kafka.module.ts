import { Module, Logger } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { EventWriterModule } from '../event_writer/event_writer.module';

@Module({
  providers: [KafkaService, Logger],
  imports:[EventWriterModule]
})
export class KafkaModule {}
