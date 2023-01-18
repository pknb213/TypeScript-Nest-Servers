import {Field, ObjectType} from "@nestjs/graphql";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
@Entity()
export class Restaurant {
    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id: number
    @Field(is => String)
    @Column()
    name: string
    @Field(type => Boolean, {nullable: true})
    @Column()
    isVegan: boolean
    @Field(type => String, {nullable: true})
    @Column()
    address: string
    @Field(type => String, {nullable: true})
    @Column()
    ownerName: string
    @Field(type => String)
    @Column()
    categoryName: string
}