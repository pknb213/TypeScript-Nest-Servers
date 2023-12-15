import {Field, InputType, Int, ObjectType} from "@nestjs/graphql";
import {CommonOutputType} from "./common-output.dto";

@InputType()
export class PaginationInput {
    @Field(type => Int, {defaultValue: 1})
    page: number
}

@ObjectType()
export class PaginationOutput extends CommonOutputType{
    @Field(type => Int, {nullable: true})
    totalPages?: number
    @Field(type => Int, {nullable: true})
    totalResults?: number
}