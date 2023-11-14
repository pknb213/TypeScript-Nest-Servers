import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { Order } from "./entities/order.entity";
import { OrderService } from "./order.service";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { AuthUser } from "../auth/auth-user.decorator";
import { User } from "../users/entities/user.entity";
import { Role } from "../auth/role.decorator";
import { GetOrdersOutput, GetOrdersInput } from "./dtos/get-orders.dto";
import { GetOrderInput, GetOrderOutput } from "./dtos/get-order.dto";
import { EditOrderInput, EditOrderOutput } from "./dtos/edit-order.dto";
import { Inject } from "@nestjs/common";
import { NEW_COOKED_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER, PUB_SUB } from "../common/common.constants";
import { PubSub } from "graphql-subscriptions";
import { OrderUpdatesInput } from "./dtos/order-updates.dto";
@Resolver(of => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    @Inject(PUB_SUB) private readonly pubsub: PubSub
  ) {
  }

  @Mutation(returns => CreateOrderOutput)
  @Role(["Client"])
  async createOrder(
    @AuthUser() customer: User,
    @Args("input")
      createOrderInput: CreateOrderInput
  ): Promise<CreateOrderOutput> {
    return this.orderService.createOrder(customer, createOrderInput)
  }

  @Query(returns => GetOrdersOutput)
  @Role(["Any"])
  async getOrders(
    @AuthUser() user: User,
    @Args("input") getOrdersInput: GetOrdersInput
  ): Promise<GetOrdersOutput> {
    return this.orderService.getOrders(user, getOrdersInput)
  }

  @Query(returns => GetOrderOutput)
  @Role(["Any"])
  async getOrder(
    @AuthUser() user: User,
    @Args("input") getOrderInput: GetOrderInput
  ): Promise<GetOrderOutput> {
    return this.orderService.getOrder(user, getOrderInput)
  }

  @Mutation(returns => EditOrderOutput)
  @Role(['Any'])
  async editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput
  ): Promise<EditOrderOutput> {
    return this.orderService.editOrder(user, editOrderInput)
  }

  @Subscription(returns => Order, {
    filter: ({ pendingOrders: { ownerId } }, { _ }, { user }) => {
      console.log(ownerId, user.id);
      return ownerId === user.id
    },
    resolve: ({ pendingOrders: { order } }) => order
  })
  @Role(["Owner"])
  pendingOrders() {
    return this.pubsub.asyncIterator(NEW_PENDING_ORDER)
  }

  @Subscription(returns => Order)
  @Role(["Delivery"])
  cookedOrders(){
    return this.pubsub.asyncIterator(NEW_COOKED_ORDER)
  }

  @Subscription(returns => Order, {
    filter: (
      { orderUpdates: order }: {orderUpdates: Order},
      { input }: { input: OrderUpdatesInput },
      { user }: { user: User }
    ) => {
      console.log(order);
      if (
        order.driverId !== user.id &&
        order.customerId !== user.id &&
        order.restaurant.ownerId !== user.id
      ) {
        return false
      }
      return order.id === input.id
    }
  })
  @Role(["Any"])
  orderUpdates(
    @Args('input') orderUpdateInput: OrderUpdatesInput
  ){
    return this.pubsub.asyncIterator(NEW_ORDER_UPDATE)
  }
}
