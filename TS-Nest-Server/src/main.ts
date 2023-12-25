import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {WsAdapter} from "@nestjs/platform-ws";
// import {SocketIoAdapter} from "./ws/events/events.gateway";
import {RedisIoAdapter} from "./ws/adapters/redis-io.adapter";
import {Transport} from "@nestjs/microservices";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new WsAdapter(app)) // Todo: Using WS
    // app.useWebSocketAdapter(new SocketIoAdapter(app)); // Todo: Using SocketIo
    // Todo: Using Redis-io socket.
    /***
    1. Turn on the redis server.
    2. under comment enable.
    3. redis-io.socket.test.html test.
    */
    // const redisIoAdapter = new RedisIoAdapter(app);
    // await redisIoAdapter.connectToRedis();
    // app.useWebSocketAdapter(redisIoAdapter);
    /** Kafka Nestjs Microservice, But Use to kafkajs. because i want to dynamic topic. */
    /**app.connectMicroservice({
        transport: Transport.KAFKA,
        options: {
            client: {
                brokers: [],
            },
            consumer: {
                groupId: ''
            }
        }
    })
    await app.startAllMicroservices()*/
    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
