import {Field, InputType, ObjectType} from "@nestjs/graphql";
import {Any, Column, Entity, ManyToOne} from "typeorm";
import {CommonEntity} from "../../common/entities/common.entity";

@InputType('ProductInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Product extends CommonEntity {
    @Field(is => String)
    @Column()
    name: string

    @Field(is => String)
    @Column()
    category: string

    @Field(is => String)
    @Column()
    coverImg: string

    @Field(is => Number)
    @Column()
    price: number

    @Field(is => String)
    // Todo: Seller Entity를 만들어야 겠다.
    // @ManyToOne(
    //   type => ,
    //     user => user,
    //   {onDelete: "CASCADE"}
    // )
    @Column()
    seller: string
}