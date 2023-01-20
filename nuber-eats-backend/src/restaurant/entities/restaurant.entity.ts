import {Field, InputType, ObjectType} from "@nestjs/graphql";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsBoolean, IsString, Length} from "class-validator";

@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class Restaurant {
    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id: number

    @Field(is => String)
    @Column()
    @Length(5)
    name: string

    @Field(type => Boolean, {nullable: true})
    @Column()
    @IsBoolean()
    isVegan: boolean

    @Field(type => String, {nullable: true})
    @Column()
    @IsString()
    address: string

    @Field(type => String, {nullable: true})
    @Column()
    @IsString()
    ownerName: string

    @Field(type => String)
    @Column()
    @IsString()
    categoryName: string
}