import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PodcastsModule } from './rest/podcast/podcasts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainModule } from './graphql/domain/domain.module';
import { EventsModule } from './ws/events/events.module';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver} from '@nestjs/apollo';
import {EventsGateway} from "./ws/events/events.gateway";
import { ProductsModule } from './graphql/products/products.module';
import { UsersModule } from './rest/users/users.module';
import { PaymentsModule } from './rest/payments/payments.module';
import { CommonModule } from './rest/common/common.module';
import { AuthModule } from './global/auth/auth.module';
import {UserEntity} from "./rest/users/entities/user.entity";
import { JwtModule } from './global/jwt/jwt.module';
import { KafkaModule } from './rest/kafka/kafka.module';

@Module({
  imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'db.sqlite3',
        logging: true,
        synchronize: true,
        entities: [UserEntity]
      }),
      GraphQLModule.forRoot({
        driver: ApolloDriver,
        autoSchemaFile: true,
      }),
      AuthModule,
      DomainModule,
      EventsModule,
      PodcastsModule,
      ProductsModule,
      UsersModule,
      PaymentsModule,
      CommonModule,
      JwtModule.forRoot({
        privateKey: "8mMJe5dMGORyoRPLvngA8U4aLTF3WasX"
      }),
      KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
