import {Field, InputType, ObjectType} from "@nestjs/graphql";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsBoolean, IsOptional, IsString, Length} from "class-validator";

@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class Restaurant {
    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id: number

    @Field(is => String)
    @Column()
    @IsString()
    @Length(5)
    name: string

    @Field(type => Boolean, {nullable: true}) // GraphQL
    @Column({default: true}) // DB
    @IsOptional()
    @IsBoolean()  // validation
    isVegan: boolean

    @Field(type => String, {defaultValue: "강남"})
    @Column()
    @IsString()
    address: string
}