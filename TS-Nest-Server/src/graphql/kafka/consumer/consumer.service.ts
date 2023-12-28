import {Injectable, OnApplicationShutdown} from '@nestjs/common';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopic, ConsumerSubscribeTopics, Kafka } from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown{
    private readonly kafka = new Kafka({
        clientId: "ts-nest-server kafka",
        brokers: ["localhost:29092"]
    })
    private readonly consumers: Consumer[] = []

    async consume(
        topic: ConsumerSubscribeTopics,
        config: ConsumerRunConfig
    ) {
        const consumer = this.kafka.consumer({
            groupId: 'ts-nest-server-test'
        })
        await consumer.connect()
        await consumer.subscribe(topic)
        await consumer.run(config)
        this.consumers.push(consumer)
    }

    async onApplicationShutdown() {
        for(const consumer of this.consumers) {
            await consumer.disconnect()
        }
    }
}
