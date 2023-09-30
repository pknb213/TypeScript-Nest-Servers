import {Field, InputType, ObjectType} from "@nestjs/graphql";
import {CoreOutput} from "../../common/dtos/output.dto";
import {Restaurant} from "../entities/restaurant.entity";
import {string} from "joi";
import {PaginationInput, PaginationOutput} from "../../common/dtos/pagenation.dto";

@InputType()
export class SearchRestaurantInput extends PaginationInput{
    @Field(type => String)
    query: string
}

@ObjectType()
export class SearchRestaurantOutput extends PaginationOutput {
    @Field(type => [Restaurant], {nullable: true})
    restaurants?: Restaurant[]
}