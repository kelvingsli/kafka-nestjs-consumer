import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventWriterService } from './event_writer.service';
import { IEventWriterService } from './event_writer.interface';
import { WikiPost } from './models/entity/wikipost.entity'

@Module({
  providers: [{
    provide: 'IEventWriterService',
    useClass: EventWriterService,
  }],
  exports: ['IEventWriterService'],
  imports: [TypeOrmModule.forFeature([WikiPost])],
})
export class EventWriterModule { }
