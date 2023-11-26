import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PodcastsModule } from './rest/podcast/podcasts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './rest/auth/auth.module';
import { DomainModule } from './graphql/domain/domain.module';
import { EventsModule } from './ws/events/events.module';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import {EventsGateway} from "./ws/events/events.gateway";

@Module({
  imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'db.sqlite',
        logging: true,
        synchronize: true,
      }),
      GraphQLModule.forRoot({
        driver: ApolloDriver,
        autoSchemaFile: true,
      }),
      AuthModule,
      DomainModule,
      EventsModule,
      PodcastsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
