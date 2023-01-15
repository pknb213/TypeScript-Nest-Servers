import {ArgsType, Field, InputType} from "@nestjs/graphql";
import {IsBoolean, IsString, Length} from "class-validator";

@ArgsType()
export class CreateRestaurantDto {
    @Field(type => String)
    @IsString()
    @Length(5, 10)
    name: string
    @Field(type => Boolean, {nullable: true})
    @IsBoolean()
    isVegan: boolean
    @Field(type => String, {nullable: true})
    @IsBoolean()
    address: string
    @Field(type => String, {nullable: true})
    @IsString()
    ownerName: string
}