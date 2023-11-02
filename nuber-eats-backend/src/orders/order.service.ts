import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order, OrderStatus } from "./entities/order.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { User, UserRole } from "../users/entities/user.entity";
import { Restaurant } from "../restaurants/entities/restaurant.entity";
import { OrderItem } from "./entities/order-item.entity";
import { Dish } from "../restaurants/entities/dish.entity";
import { GetOrdersInput, GetOrdersOutput } from "./dtos/get-orders.dto";
import { GetOrderInput, GetOrderOutput } from "./dtos/get-order.dto";
import { EditOrderInput, EditOrderOutput } from "./dtos/edit-order.dto";

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
      const orderItems: OrderItem[] = []
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
              console.log(`\n$USD + ${dishOption.extra}`);
              dishFinalPrice = dishFinalPrice + dishOption.extra
            } else {
              const dishOptionChoice = dishOption.choices.find(
                optionChoice => optionChoice.name === itemOption.choice
              )
              if (dishOptionChoice) {
                if (dishOptionChoice.extra) {
                  console.log(`\n$USD + ${dishOptionChoice.extra}`);
                  dishFinalPrice = dishFinalPrice + dishOptionChoice.extra
                }
              }
            }
          }
          orderFinalPrice = orderFinalPrice + dishFinalPrice
        }
        console.log(`\nPrice: ${orderFinalPrice}`);
        const orderItem = await this.orderItems.save(
          this.orderItems.create({
            dish,
            options: item.options
          })
        )
        orderItems.push(orderItem)
      }
      const order = await this.orders.save(
        this.orders.create({
          customer,
          restaurant,
          total: orderFinalPrice,
          items: orderItems
        })
      )
      console.log(`\nOrder: `, order)
      return {
        ok: true,
      }
    } catch (error) {
      console.log(error);
      return {ok: false, error: 'Could not create order.'}
    }
  }

  async getOrders(
    user: User,
    { status }: GetOrdersInput
  ): Promise<GetOrdersOutput> {
    try {
      let orders = []
      if (user.role === UserRole.Client) {
        orders = await this.orders.find({
          where: {
            customer: {
              id: user.id
            },
            ...(status && { status })
          }
        })
      } else if (user.role === UserRole.Delivery) {
        orders = await this.orders.find({
          where: {
            driver: {
              id: user.id
            },
            ...(status && { status })
          }
        })
      } else if (user.role === UserRole.Owner) {
        const restaurants = await this.restaurants.find({
          where: {
            owner: {
              id: user.id
            }
          },
          relations: ["orders"]
        })
        orders = restaurants.map(restaurant => restaurant.orders).flat(1)
        if (status) {
          orders = orders.filter(order => order.status === status)
        }
        return {
          ok: true,
          orders
        }
      }
    } catch (error) {
      return {
        ok: false,
        error: 'Could not get orders'
      }
    }
  }

  canSeeOrder(user: User, order: Order): boolean {
    let ok = true
    if (user.role === UserRole.Client && order.customerId !== user.id) {
      ok = false
    }
    if (user.role === UserRole.Delivery && order.driverId !== user.id) {
      ok = false
    }
    if (user.role === UserRole.Delivery && order.restaurant.ownerId !== user.id) {
      ok = false
    }
    return ok
  }

  async getOrder(
    user: User,
    { id: orderId }: GetOrderInput
  ): Promise<GetOrderOutput> {
    try {
      const order = await this.orders.findOne({
        where: {
          id: orderId
        },
        relations: ['restaurant']
      })
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.'
        }
      }
      if ( !this.canSeeOrder(user, order) ) {
        return {
          ok: false,
          error: 'You can see that.'
        }
      }
      return {
        ok: true,
        order
      }
    } catch (error) {
      return {
        ok: false,
        error: "Could not get order."
      }
    }
  }

  async editOrder(
    user: User,
    {id: orderId, status}: EditOrderInput
  ): Promise<EditOrderOutput> {
    try {
      const order = await this.orders.findOne({
        where: {
          id: orderId
        },
        relations: ["restaurant"]
      })
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.'
        }
      }
      if (!this.canSeeOrder(user, order)) {
        return {
          ok: false,
          error: "Can't see this."
        }
      }
      let canEdit = true
      if (user.role === UserRole.Client) {
        canEdit = false
      }
      if (user.role === UserRole.Owner) {
        if (status !== OrderStatus.Cooking && status !== OrderStatus.Cooked) {
          canEdit = false
        }
      }
      if (user.role === UserRole.Delivery) {
        if (status !== OrderStatus.PickedUp && status !== OrderStatus.Delivered) {
          canEdit = false
        }
      }
      if (!canEdit) {
        return {
          ok: false,
          error: "You can't do that."
        }
      }
      await this.orders.save([
        {
        id: orderId,
        status
        }
      ])
      return {
        ok: true,

      }
    } catch (error) {
      console.log("Edit Error:", error);
      return {
        ok: false,
        error: "Could not edit order"
      }
    }
  }

}