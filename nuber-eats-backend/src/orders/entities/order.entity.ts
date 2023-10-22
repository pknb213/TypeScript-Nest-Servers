import { Field, Float, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { CoreEntity } from "../../common/entities/core.entity";
import { User } from "../../users/entities/user.entity";
import { Restaurant } from "../../restaurant/entities/restaurant.entity";
import { Dish } from "../../restaurant/entities/dish.entity";
import { JoinTable } from "typeorm";

export enum OrderStatus {
  Pending = "Pending",
  Cooking = "Cooking",
  PickedUp = "PickedUp",
  Delivered = "Delivered"
}

registerEnumType(OrderStatus, {name: "OrderStatus"})

@InputType('OrderInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @Field(type => User, {nullable: true})
  @ManyToOne(
    type => User,
    user => user.orders,
    {onDelete: 'SET NULL', nullable: true} // customer를 지워도 order가 지워지지 않음
  )
  customer: User

  @Field(type => User, {nullable: true})
  @ManyToOne(
    type => User,
    user => user.rides,
    {onDelete: 'SET NULL', nullable: true}
  )
  driver?: User

  @Field(type => Restaurant)
  @ManyToOne(
    type => Restaurant,
    restaurant=> restaurant.orders,
    {onDelete: 'SET NULL', nullable: true}
  )
  restaurant: Restaurant

  @Field(type => [Dish])
  @ManyToMany(type => Dish)
  @JoinTable()
  dishes: Dish[]

  @Column()
  @Field(type => Float)
  total: number

  @Column({type: "enum", enum: OrderStatus})
  @Field(type => OrderStatus)
  status: OrderStatus

}