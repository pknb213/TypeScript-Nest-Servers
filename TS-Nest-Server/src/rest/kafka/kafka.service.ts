import { Injectable } from '@nestjs/common';
import {EachMessagePayload, Kafka} from "kafkajs";
import {ProducerService} from "./producer/producer.service";
import {ConsumerService} from "./consumer/consumer.service";

@Injectable()
export class KafkaService {
    private kafka = new Kafka({
        clientId: "ts-nest-server kafka",
        brokers: ["localhost:29092"]
    })
    private producer = this.kafka.producer()
    private consumer = this.kafka.consumer({
        groupId: "ts-nest-server group"
    })

    constructor(
        private readonly producerService: ProducerService,
        private readonly consumerService: ConsumerService,
    ) {
        this.consumer.connect()
        this.consumer.subscribe({
            topics: []
        })
        this.consumer.run({
            eachMessage: this.consumerCallback,
        })
    }

    async consumerCallback(payload: EachMessagePayload) {
        console.log('Kafka msg arrived')
        console.log(`topic: ${payload.topic}\nmessage: ${payload.message.value.toString()}`)
    }

    async addNewTopic(topic: string) {
        await this.consumer.stop()
        await this.consumer.subscribe({topic})
        await this.consumer.run({
            eachMessage: this.consumerCallback
        })
    }

    // Kafkajs (Module화 된 거 추가 함)
    async create() {
        const newUser = {userId: 1, name: "A"}
        await this.producerService.produce({
          topic: 'kafkajs-test',
          messages: [
            {
              value: JSON.stringify(newUser),
            },
          ],
        });
        return 'This action adds a new user';
    }
    async onModuleInit() {
        await this.consumerService.consume(
            {topics: ['kafkajs-test']},
            {
                eachMessage: async ({topic, partition, message}) => {
                    console.log({
                        key: message.key.toString(),
                        value: message.value.toString(),
                        topic: topic.toString(),
                        partition: partition.toString(),
                    });
                },
            }
        );
    }
}
