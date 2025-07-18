import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { KafkaJS } from '@confluentinc/kafka-javascript';
import { ConfigService } from '@nestjs/config';
import { IEventWriterService } from '../event_writer/event_writer.interface';
import { IWikiPost } from '../event_writer/models/dto/wikipost.interface';
import { WikiPostDto } from '../event_writer/models/dto/wikipost.dto';
import { IWikiEvent } from './models/dto/wiki_event.interface';
import { WikiEventDto } from './models/dto/wiki_event.dto';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    @Inject('IEventWriterService')
    private readonly eventWriterService: IEventWriterService,
  ) {}
  private consumer: KafkaJS.Consumer;

  async onModuleInit() {
    this.consumer = new KafkaJS.Kafka().consumer({
      'bootstrap.servers': this.configService.get<string>('KAFKA_BROKER_URL'),
      kafkaJS: {
        groupId: 'nest_kafka_1',
        fromBeginning: true,
      },
    });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'demo_ts1' });
    await this.getKafkaEvents();
    this.logger.log('Connected successfully');
  }

  async onModuleDestroy() {
    this.consumer.disconnect();
  }

  private async getKafkaEvents() {
    let messageRcvd = false;
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const valueObj = JSON.parse(message.value?.toString() ?? '');
        const new_event: IWikiEvent = new WikiEventDto(
          valueObj.id,
          valueObj.title,
          valueObj.title_url,
          valueObj.timestamp,
          valueObj.source,
        );
        if (new_event.id) {
          const result = await this.eventWriterService.upsertWikiPost(
            new_event.id.toString(),
            new_event.title,
            new_event.title_url,
            new_event.timestamp,
            new_event.source,
          );
          this.logger.log(`Message value: ${JSON.stringify(result)}`);
        }
        messageRcvd = true;
      },
    });

    while (!messageRcvd) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // private async upsertDbWikiPost() {
  //     this.eventWriterService.upsertWikiPost();
  // }
}
