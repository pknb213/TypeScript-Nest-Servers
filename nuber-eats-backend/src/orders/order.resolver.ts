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
import { PUB_SUB } from "../common/common.constants";
import { PubSub } from "graphql-subscriptions";
@Resolver(of => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    @Inject(PUB_SUB) private readonly pubsub: PubSub
  ) {}

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

  @Mutation(returns => Boolean)
  async potatoReady(@Args('potatoId') potatoId: number) {
    await this.pubsub.publish('hotPotatos', {
      readyPotato: potatoId
      // readyPotato: `Your potato is ${potatoId} ready.`
    })
    return true
  }

  @Subscription(returns => String, {
    // filter: (payload, variables, context) => {
    filter: ({ readyPotato }, { potatoId }) => {
      // console.log(payload, variables, context);
      // return true
      return readyPotato === potatoId
    },
    resolve: ({ readyPotato }) => `Your potato with the id ${readyPotato} is ready!.`
  })
  @Role(['Any'])
  readyPotato(
    @AuthUser() user: User,
    @Args('potatoId') potatoId: number
  ) {
    return this.pubsub.asyncIterator('hotPotatos')
  }
}

