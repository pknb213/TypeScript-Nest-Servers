import {Args, Int, Mutation, Parent, Query, ResolveField, Resolver} from "@nestjs/graphql";
import {Restaurant} from "./entities/restaurant.entity";
import {CreateRestaurantInput, CreateRestaurantOutput} from "./dtos/create-restaurant.dto";
import {RestaurantService} from "./restaurant.service";
import {AuthUser} from "../auth/auth-user.decorator";
import {User} from "../users/entities/user.entity";
import {Role} from "../auth/role.decorator";
import {EditRestaurantInput, EditRestaurantOutput} from "./dtos/edit-restaurant.dto";
import {DeleteRestaurantInput, DeleteRestaurantOutput} from "./dtos/delete-restaurant.dto";
import {Category} from "./entities/category.entiey";
import {AllCategoriesOutput} from "./dtos/all-categories.dto";
import {CategoryInput, CategoryOutput} from "./dtos/category.dto";
import {RestaurantsInput, RestaurantsOutput} from "./dtos/restaurants.dto";
import {RestaurantInput, RestaurantOutput} from "./dtos/restaurant.dto";
import {SearchRestaurantInput, SearchRestaurantOutput} from "./dtos/search-restaurant.dto";

@Resolver(of => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) {
    }

    @Mutation(returns => CreateRestaurantOutput)
    @Role(['Owner'])
    async createRestaurant(
        @AuthUser() authUser: User,
        @Args('input') createRestaurantInput: CreateRestaurantInput
    ): Promise<CreateRestaurantOutput> {
        return this.restaurantService.createRestaurant(
            authUser,
            createRestaurantInput
        )

    }

    @Mutation(returns => EditRestaurantOutput)
    @Role(['Owner'])
    async editRestaurant(
        @AuthUser() owner: User,
        @Args('input') editRestaurantInput: EditRestaurantInput
    ): Promise<EditRestaurantOutput> {
        return this.restaurantService.editRestaurant(owner, editRestaurantInput)
    }

    @Mutation(returns => DeleteRestaurantOutput)
    @Role(['Owner'])
    async deleteRestaurant(
        @AuthUser() owner: User,
        @Args('input') deleteRestaurantInput: DeleteRestaurantInput
    ): Promise<DeleteRestaurantOutput> {
        return this.restaurantService.deleteRestaurant(owner, deleteRestaurantInput)
    }

    @Query(returns => RestaurantsOutput)
    restaurants(@Args('input') restaurantsInput: RestaurantsInput): Promise<RestaurantsOutput> {
        return this.restaurantService.allRestaurants(restaurantsInput)
    }

    @Query(returns => RestaurantsOutput)
    restaurant(@Args('input') restaurantInput: RestaurantInput): Promise<RestaurantOutput> {
        return this.restaurantService.findRestaurantById(restaurantInput)
    }

    @Query(returns => SearchRestaurantOutput)
    searchRestaurant(@Args('input') searchRestaurantInput: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
        return this.restaurantService.searchRestaurantByName(searchRestaurantInput)
    }
}

@Resolver(of => Category)
export class CategoryResolver {
    constructor(
        private readonly restaurantService: RestaurantService
    ) {
    }

    @ResolveField(type => Int)
    restaurantCount(
        @Parent()
            category: Category
    ): Promise<number> {
        return this.restaurantService.countRestaurant(category)
    }

    @Query(type => AllCategoriesOutput)
    allCategories(): Promise<AllCategoriesOutput> {
        return this.restaurantService.allCategories()
    }

    @Query(type => CategoryOutput)
    category(@Args('input') categoryInput: CategoryInput): Promise<CategoryOutput> {
        return this.restaurantService.findCategoryBySlug(categoryInput)
    }

    @Query(returns => RestaurantOutput)
    restaurant(
        @Args('input') restaurantInput: RestaurantInput
    ): Promise<RestaurantOutput> {
        return this.restaurantService.findRestaurantById(restaurantInput)
    }
}