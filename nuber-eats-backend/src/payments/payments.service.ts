import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { Repository } from "typeorm";
import { Mutation } from "@nestjs/graphql";
import { CreatePaymentInput, CreatePaymentOutput } from "./dtos/create-payment.dto";
import { Role } from "../auth/role.decorator";
import { AuthUser } from "../auth/auth-user.decorator";
import { User } from "../users/entities/user.entity";
import { Restaurant } from "../restaurants/entities/restaurant.entity";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>
  ) {}

  async createPayment(
    owner: User,
    { transactionId, restaurantId }: CreatePaymentInput
  ): Promise<CreatePaymentOutput> {
    const restaurant = await this.restaurants.findOne({
      where: {
        id: restaurantId
      }
    })
    if (!restaurant) {
      return {
        ok: false,
        error: "Restaurant not found"
      }
    }
    if (restaurant.ownerId !== owner.id) {
      return {
        ok: false,
        error: 'You are not allowed to do this.'
      }
    }
    await this.restaurants.save(this.payments.create(){

    })
  }

}
