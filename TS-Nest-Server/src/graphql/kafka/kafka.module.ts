import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { KafkaController } from './kafka.controller';
import { ProducerService } from './producer/producer.service';
import { ConsumerService } from './consumer/consumer.service';

@Module({
  providers: [ProducerService, ConsumerService], //KafkaService
  // controllers: [KafkaController],
  exports: [ProducerService, ConsumerService]
})
export class KafkaModule {}
