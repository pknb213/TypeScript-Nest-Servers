import {CoreOutput} from "../../common/dtos/output.dto";
import {Field, ObjectType} from "@nestjs/graphql";
import {Category} from "../entities/category.entiey";

@ObjectType()
export class AllCategoriesOutput extends CoreOutput {
    @Field(tpye => [Category], {nullable: true})
    categories?: Category[]
}