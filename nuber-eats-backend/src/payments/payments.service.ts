import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import {LessThan, Repository} from "typeorm";
import { Mutation } from "@nestjs/graphql";
import { CreatePaymentInput, CreatePaymentOutput } from "./dtos/create-payment.dto";
import { Role } from "../auth/role.decorator";
import { AuthUser } from "../auth/auth-user.decorator";
import { User } from "../users/entities/user.entity";
import { Restaurant } from "../restaurants/entities/restaurant.entity";
import {GetPaymentsOutput} from "./dtos/get-payments.dto";
import {Cron, Interval} from "@nestjs/schedule";

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
    try {
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
      await this.payments.save(
          this.payments.create({
            transactionId,
            user: owner,
            restaurant
          })
      )
      restaurant.isPromoted = true
      const date = new Date()
      date.setDate(date.getDate() + 7)
      restaurant.promotedUntil = date
      await this.restaurants.save(restaurant)
      return {
        ok: true,
      }
    } catch (e) {
      console.log(e)
      return { ok:false, error: "Can not create payment."}
    }
  }

  async getPayments(user: User): Promise<GetPaymentsOutput> {
    try {
      const payments = await this.payments.find({
        where: {
          user: {
            id: user.id
          }
        }
      })
      return { ok: true, payments }
    } catch (e) {
      console.log(e)
      return {ok :false, error: 'Could not load payments.'}
    }
  }

  @Cron('30 * * * * *')
  async checkForPayments() {
    console.log('Checking for payments....')
  }

  @Interval(5000)
  async checkForPayments2() {
    console.log('Checking for payments....')
  }

  @Interval(2000)
  async checkPromotedRestaurants() {
    const restaurants = await this.restaurants.find({
      where: {
        isPromoted: true,
        promotedUntil: LessThan(new Date()),
      }
    })
    console.log(restaurants)
    for (const restaurant of restaurants) {
      restaurant.isPromoted = false
      restaurant.promotedUntil = null
      await this.restaurants.save(restaurant)
    }
  }
}
