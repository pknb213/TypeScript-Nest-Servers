import {Args, Field, Mutation, Query, Resolver} from "@nestjs/graphql";
import { Restaurant } from "./entities/restaurant.entity";
import {CreateRestaurantDto} from "./dtos/create-restaurant.dto";
import {RestaurantService} from "./restaurant.service";
@Resolver(of => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) {}
    @Query(() => [Restaurant])
    restaurants(): Promise<Restaurant[]> {
        return this.restaurantService.getAll()
    }
    @Mutation(returns => Boolean)
    createRestaurant(
        @Args() createRestaurantDto: CreateRestaurantDto
    ): boolean {
        console.log(createRestaurantDto)
        return true
    }
}