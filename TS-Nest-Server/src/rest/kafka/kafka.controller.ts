import {Body, Controller, Post} from '@nestjs/common';
import {KafkaService} from "./kafka.service";

@Controller('kafka')
export class KafkaController {
    constructor(
        private readonly kafkaService: KafkaService
    ) {}

    @Post('/topic')
    async addNewTopic(
        @Body('topic') topic: string
    ): Promise<string> {
        console.log("Add New Topic: ", topic)
        if (topic == undefined) return 'topic is undefined'
        else {
            await this.kafkaService.addNewTopic(topic)
            return `New Topic: ${topic}`
        }
    }

    /**
     * @nestjs/microservices 설치 필요
     * NestJs에서 제공하는 Microservice 형태로 간단하지만, Dynamic한 Topic 구독이 불가능하며
     * Produce하는 과정에서 response을 받을 때도 문제가 됨.
     */
    // @MessagePattern("topic-name")
    // async helloKafka(
    //     @Payload() payload
    // ) {
    //     console.log(JSON.stringify(payload))
    // }
}
