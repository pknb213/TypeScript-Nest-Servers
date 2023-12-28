import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RestaurantsModule} from './restaurants/restaurants.module';
import {ConfigModule} from "@nestjs/config";
import * as Joi from 'joi'
import {UsersModule} from './users/users.module';
import {CommonModule} from './common/common.module';
import {User} from "./users/entities/user.entity";
import {JwtModule} from './jwt/jwt.module';
import {JwtMiddleware} from "./jwt/jwt.middleware";
import {AuthModule} from './auth/auth.module';
import {Verification} from "./users/entities/verfication.entity";
import {MailModule} from './mail/mail.module';
import * as process from "process";
import {Restaurant} from "./restaurants/entities/restaurant.entity";
import {Category} from "./restaurants/entities/category.entity";
import { Dish } from "./restaurants/entities/dish.entity";
import { OrdersModule } from './orders/orders.module';
import { Order } from "./orders/entities/order.entity";
import { OrderItem } from "./orders/entities/order-item.entity";
import { Context } from "joi";
import { PaymentsModule } from './payments/payments.module';
import { Payment } from "./payments/entities/payment.entity";
import {ScheduleModule} from "@nestjs/schedule";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
      })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      entities: [User, Verification, Restaurant, Category, Dish, Order, OrderItem, Payment]
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      // Todo: 더 이상 지원 안함
      // installSubscriptionHandlers: true
      subscriptions: {
      //   // Todo: Graphql-ws가 아직 graphql playground 호환이 안되므로, 임시로 같이 사용한다.
      //   'subscriptions-transport-ws': {
      //     onConnect: (connectionParams) => {
      //       connectionParams.user = ["pknb213"]
      //       console.log("Context:", connectionParams);
      //       // return connectionParams
      //       return connectionParams
      //       // return {token: connectionParams['X-JWT']}
      //       // const TOKEN_KEY = 'x-jwt'
      //       // console.log({ user: connectionParams[TOKEN_KEY]});
      //       // return { user: connectionParams[TOKEN_KEY]}
      //     }
      //   },
        'graphql-ws': {
          onConnect: (context: Context) => {
            // console.log("Context:", context);
            const {connectionParams, extra} = context
            extra.user = {}
            extra.token = connectionParams
          }
        }
      },
      // context: ({ req, connection, extra, webSocket, context, connectionParams, token }) => {
      //   console.log("Req:", req);
      //   console.log("Extra:", extra);
      //   console.log("Conn:", connection);
      //   console.log("WS:", webSocket);
      //   console.log("Context:", context);
      //   console.log("CP:", connectionParams);
      //   console.log("Token:", token);
      // }
      context: ({req, extra}) => {
        const TOKEN_KEY = 'x-jwt'
        console.log(req ? req.headers[TOKEN_KEY] : extra.token[TOKEN_KEY]);
        return { token: req ? req.headers[TOKEN_KEY]: extra.token[TOKEN_KEY] }
      },
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      fromEmail: process.env.MAILGUN_DOMAIN_NAME,
      domain: process.env.MAILGUN_FROM_EMAIL
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    OrdersModule,
    CommonModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { // implements NestModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(JwtMiddleware).forRoutes({
  //     path: "graphql",
  //     method: RequestMethod.POST,
  //   })
  // }

}
