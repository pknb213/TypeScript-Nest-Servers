import {Field, ObjectType} from "@nestjs/graphql";
import {PaginationOutput} from "./pagenation.dto";

@ObjectType()
export class CoreOutput {
    @Field(type => String, {nullable: true})
    error?: string

    @Field(type => Boolean)
    ok: boolean
}