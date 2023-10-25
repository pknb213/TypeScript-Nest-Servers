import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { CoreEntity } from "../../common/entities/core.entity";
import { Dish, DishOption } from "../../restaurant/entities/dish.entity";

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
  @Field(type => [DishOption], {nullable: true})
  @Column({type: "json", nullable: true})
  options?: DishOption[]
}