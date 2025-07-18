import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { KafkaJS } from '@confluentinc/kafka-javascript';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
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
        this.logger.log(`Message value: ${JSON.stringify(valueObj)}`);
        messageRcvd = true;
      },
    });

    while (!messageRcvd) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}
