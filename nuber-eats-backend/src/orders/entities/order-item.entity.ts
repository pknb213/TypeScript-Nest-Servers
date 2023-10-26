import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { CoreEntity } from "../../common/entities/core.entity";
import { Dish, DishChoice } from "../../restaurants/entities/dish.entity";

@InputType("OrderItemOptionInputType", {isAbstract: true})
@ObjectType()
export class OrderItemOption {
  @Field(type => String)
  name: string
  @Field(type => String, {nullable: true})
  choice?: String
  @Field(type => Int, {nullable: true})
  extra?: number
}

@InputType('OrderItemInputType', { isAbstract: true})
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
  @Field(type => Dish)
  @ManyToOne(
    type => Dish,
    {nullable: true, onDelete: 'CASCADE'}
  )
  dish: Dish

  /** 아래 options을 relationship으로 하지 않은 이유는 잦은 변동이 발생할 수 있기 때문이다. */
  @Field(type => [OrderItemOption], {nullable: true})
  @Column({type: "json", nullable: true})
  options?: OrderItemOption[]
}