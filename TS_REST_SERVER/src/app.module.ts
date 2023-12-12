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
import { UserModule } from './rest/user/user.module';
import { UserModule } from './product/user/user.module';
import { ProductsModule } from './rest/products/products.module';
import { UsersModule } from './product/users/users.module';
import { UsersModule } from './rest/users/users.module';
import { PaymentsModule } from './rest/payments/payments.module';
import { CommonController } from './rest/common/common.controller';
import { CommonModule } from './rest/common/common.module';
import { AuthModule } from './global/auth/auth.module';

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
      UserModule,
      ProductsModule,
      UsersModule,
      PaymentsModule,
      CommonModule,
  ],
  controllers: [AppController, CommonController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
