import {Field, ObjectType} from "@nestjs/graphql";
import {Category} from "../entities/category.entiey";
import {CoreOutput} from "../../common/dtos/output.dto";

@ObjectType()
export class CategoryInput {
    @Field(type => String)
    slug: string
}

@ObjectType()
export class CategoryOutput extends CoreOutput{
    @Field(type => Category, {nullable: true})
    category?: Category
}
