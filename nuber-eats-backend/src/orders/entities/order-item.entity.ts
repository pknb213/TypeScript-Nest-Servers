import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { CoreEntity } from "../../common/entities/core.entity";
import { Dish, DishChoice } from "../../restaurant/entities/dish.entity";

@InputType("OrderItemOptionInputType", {isAbstract: true})
@ObjectType()
export class OrderItemOption {
  @Field(type => String)
  name: string

  @Field(type => DishChoice, {nullable: true})
  choice?: DishChoice

  @Field(type => Int, {nullable: true})
  extra?: number
}

@InputType('OrderItemInputType', { isAbstract: true})
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
  @ManyToOne(
    type => Dish,
    {nullable: true, onDelete: 'CASCADE'}
  )
  dish: Dish

  /** 아래 options을 relationship으로 하지 않은 이유는 잦은 변동이 발생할 수 있기 때문이다. */
  @Field(type => [DishChoice], {nullable: true})
  @Column({type: "json", nullable: true})
  options?: DishChoice[]
}