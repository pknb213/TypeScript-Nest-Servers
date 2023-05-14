import {Field, InputType, ObjectType, PickType} from "@nestjs/graphql";
import {Restaurant} from "../entities/restaurant.entity";
import {CoreOutput} from "../../common/dtos/output.dto";

@InputType()
export class DeleteRestaurantInput extends PickType(Restaurant, [

]) {
    @Field(type => String)
    deleteName: string
}

@ObjectType()
export class DeleteRestaurantOutput extends CoreOutput {}