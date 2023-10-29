import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./entities/order.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { User } from "../users/entities/user.entity";
import { Restaurant } from "../restaurants/entities/restaurant.entity";
import { OrderItem } from "./entities/order-item.entity";
import { Dish } from "../restaurants/entities/dish.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,

    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,

    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,

    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>
  ) {}

  async createOrder (
    customer: User,
    { restaurantId, items }: CreateOrderInput
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: {
          id: restaurantId
        }
      })
      if (!restaurant) {
        return {
          ok: false,
          error: "Restaurant not found",
        }
      }
      console.log(restaurant);
      let orderFinalPrice = 0
      for (const item of items) {
        const dish = await this.dishes.findOne({
          where: {
            id: item.dishId
          }
        })
        if (!dish) {
          return {
            ok: false,
            error: "Dish not found."
          }
        }
        let dishFinalPrice = dish.price
        for (const itemOption of item.options) {
          const dishOption = dish.options.find(
            dishOption => dishOption.name === itemOption.name
          )
          if (dishOption) {
            if (dishOption.extra) {
              console.log(`$USD + ${dishOption.extra}`);
              dishFinalPrice = dishFinalPrice + dishOption.extra
            } else {
              const dishOptionChoice = dishOption.choices.find(
                optionChoice => optionChoice.name === itemOption.choice
              )
              if (dishOptionChoice) {
                if (dishOptionChoice.extra) {
                  console.log(`$USD + ${dishOptionChoice.extra}`);
                }
              }
            }
          }
          orderFinalPrice = orderFinalPrice + dishFinalPrice
        }
        console.log(`\nPrice: ${orderFinalPrice}`);
        await this.orderItems.save(
          this.orderItems.create({
            dish,
            options: item.options
          })
        )
      }
    } catch (error) {
      console.log(error);
      return {ok: false, error: error}
    }
  }
}