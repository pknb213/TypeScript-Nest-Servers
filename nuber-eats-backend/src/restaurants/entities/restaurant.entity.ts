import {Field, InputType, ObjectType} from "@nestjs/graphql";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import {IsBoolean, IsOptional, IsString, Length} from "class-validator";
import {CoreEntity} from "../../common/entities/core.entity";
import {Category} from "./category.entity";
import {User} from "../../users/entities/user.entity";
import { Dish } from "./dish.entity";
import { Order } from "../../orders/entities/order.entity";

@InputType('RestaurantInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
    @Field(is => String)
    @Column()
    @IsString()
    @Length(5)
    name: string

    @Field(type => String)
    @Column()
    @IsString()
    coverImg: string

    @Field(type => String, {defaultValue: "강남"})
    @Column()
    @IsString()
    address: string

    @Field(type => Category, {nullable: true})
    @ManyToOne(
      type => Category,
        category => category.restaurants,
        {nullable: true, onDelete: 'SET NULL'}
    )
    category: Category

    @Field(type => User)
    @ManyToOne(
      type => User,
        user => user.restaurants,
      {onDelete: "CASCADE"}
    )
    owner: User

    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerId: number

    @Field(type => [Order])
    @OneToMany(
      type => Order,
        order => order.restaurant
    )
    orders: Order[]

    @Field(type => [Dish])
    @OneToMany(
      type => Dish,
        dish => dish.restaurant
    )
    menu: Dish[]

    @Field(type => Boolean)
    @Column({default: false, nullable: true})
    isPromoted: boolean

    @Field(type => Date, {nullable: true})
    @Column({nullable: true})
    promotedUntil: Date
}