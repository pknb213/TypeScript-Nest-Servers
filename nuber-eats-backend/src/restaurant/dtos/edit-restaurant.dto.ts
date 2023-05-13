import {Field, InputType, ObjectType, PartialType} from "@nestjs/graphql";
import {CoreOutput} from "../../common/dtos/output.dto";
import {CreateRestaurantInput} from "./create-restaurant.dto";
import {Type} from "class-transformer";

@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {
    @Field(Type => Number)
    restaurantId: number
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput {}
