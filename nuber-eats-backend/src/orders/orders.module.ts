import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { OrderService } from "./order.service";
import { OrderResolver } from "./order.resolver";
import { Restaurant } from "../restaurants/entities/restaurant.entity";
import { OrderItem } from "./entities/order-item.entity";
import { Dish } from "../restaurants/entities/dish.entity";

@Module({
  imports: [TypeOrmModule.forFeature([
    Order, Restaurant, OrderItem, Dish
  ])],
  providers: [
    OrderService,
    OrderResolver,
  ]
})
export class OrdersModule {}
