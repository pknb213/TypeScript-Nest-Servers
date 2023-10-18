import {Injectable} from "@nestjs/common";
import {Restaurant} from "./entities/restaurant.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {FindOperator, Like, Repository} from "typeorm";
import {CreateRestaurantInput, CreateRestaurantOutput} from "./dtos/create-restaurant.dto";
import {User} from "../users/entities/user.entity";
import {Category} from "./entities/category.entity";
import {EditRestaurantInput, EditRestaurantOutput} from "./dtos/edit-restaurant.dto";
import {CategoryRepository} from "./repositories/category.reposigory";
import {DeleteRestaurantInput, DeleteRestaurantOutput} from "./dtos/delete-restaurant.dto";
import {AllCategoriesOutput} from "./dtos/all-categories.dto";
import {CategoryInput, CategoryOutput} from "./dtos/category.dto";
import {take} from "rxjs";
import {RestaurantInput, RestaurantOutput} from "./dtos/restaurant.dto";
import {RestaurantsInput, RestaurantsOutput} from "./dtos/restaurants.dto";
import {SearchRestaurantInput, SearchRestaurantOutput} from "./dtos/search-restaurant.dto";
import {Raw} from "typeorm";
import { CreateDishInput, CreateDishOutput } from "./dtos/create-dish.dto";
import { Dish } from "./entities/dish.entity";

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        private categories: CategoryRepository,
        @InjectRepository(Dish)
        private readonly dishes: Repository<Dish>,
    ) {
    }

    async createRestaurant(
        owner: User,
        createRestaurantInput: CreateRestaurantInput
    ): Promise<CreateRestaurantOutput> {
        try {
            const newRestaurant = this.restaurants.create(createRestaurantInput)
            newRestaurant.owner = owner
            console.log("\n>>", newRestaurant)
            const category = await this.categories.getOrCreate(createRestaurantInput.categoryName)
            console.log("\n>>", category)
            newRestaurant.category = category
            await this.restaurants.save(newRestaurant)
            return {
                ok: true,
            }
        } catch (error) {
            console.log(error)
            return {
                ok: false,
                // error: error
                error: "Could not create restaurant",
            }
        }
    }

    async editRestaurant(
        owner: User,
        editRestaurantInput: EditRestaurantInput
    ): Promise<EditRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne(
                {
                    where: {id: editRestaurantInput.restaurantId},
                    loadRelationIds: true
                },
            )
            if (!restaurant) return {ok: true}
            if (owner.id !== restaurant.ownerId) return {
                ok: false,
                error: "You can't edit a restaurant then you don't own"
            }
            let category: Category = null
            if (editRestaurantInput.categoryName) category = await this.categories.getOrCreate(
                editRestaurantInput.categoryName
            )
            await this.restaurants.save([{
                id: editRestaurantInput.restaurantId,
                ...editRestaurantInput,
                ...(category && {category})
            }])
            return {ok: true}
        } catch {
            return {ok: false, error: "Could not restaurant"}
        }
    }

    async deleteRestaurant(
        owner: User,
        {restaurantId}: DeleteRestaurantInput
    ): Promise<DeleteRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne(
                {
                    where: {id: restaurantId},
                    loadRelationIds: true
                },
            )
            if (!restaurant) return {ok: true}
            if (owner.id !== restaurant.ownerId) return {
                ok: false,
                error: "You can't delete a restaurant then you don't own"
            }
            await this.restaurants.delete(restaurantId)
            return {ok: true}
        } catch {
            return {ok: false, error: "Could not restaurant"}
        }
    }

    async allCategories(): Promise<AllCategoriesOutput> {
        try {
            const categories = await this.categories.find()

            return {ok: true}
        } catch {
            return {ok: false, error: "Could not road categories"}
        }
    }

    async countRestaurant(category: Category): Promise<number> {
        return this.restaurants.count({where: category})
    }

    async findCategoryBySlug({slug, page}: CategoryInput): Promise<CategoryOutput> {
        try {
            const category = await this.categories.findOne(
                {
                    where: {slug}, relations: ["restaurants"]
                }
            )
            if (!category) return {ok: false, error: "Category not found"}
            const restaurant = await this.restaurants.find(
                {
                    where: {
                        category: {
                            id: category.id,
                        },
                    },
                    take: 25,
                    skip: (page - 1) * 25
                }
            )
            category.restaurants = restaurant
            const totalResults = await this.countRestaurant(category)
            return {ok: true, category, totalPages: Math.ceil(totalResults / 25)}
        } catch (e) {
            return {ok: false, error: "Could not road category"}
        }
    }

    async allRestaurants({page}: RestaurantsInput): Promise<RestaurantsOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount(
                {
                    skip: (page - 1) * 25,
                    take: 25
                }
            )
            return {
                ok: true,
                results: restaurants,
                totalPages: Math.ceil(totalResults / 25),
                totalResults
            }
        } catch {
            return {
                ok: false,
                error: "Could not load restaurants"
            }
        }
    }

    async findRestaurantById({
        restaurantId,
    }: RestaurantInput): Promise<RestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne({
                where: {id: restaurantId},
                relations: ['menu'],
                loadRelationIds: true
            },)
            if (!restaurant) {
                return {
                    ok: false,
                    error: "Restaurant not found",
                }
            }
            return {
                ok: true,
                restaurant,
            }
        } catch {
            return {
                ok: false,
                error: "Could not find restaurant."
            }
        }
    }

    async searchRestaurantByName({query, page}: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                where: {
                    // name: Like(`%${query}%`)
                    name: Raw(name => `${name} ILIKE '%${query}%'`)
                },
                skip: (page - 1) * 25,
                take: 25,
            })
            return {
                ok: true,
                restaurants,
                totalResults,
                totalPages: Math.ceil(totalResults / 25)
            }
        }
        catch {
            return {ok: false, error: "Could not search for resturants"}
        }
    }

    async createDish(
      owner: User,
      createDishInput: CreateDishInput
    ): Promise<CreateDishOutput> {
        try {
            const restaurant = await this.restaurants.findOne(
              {
                  where: {
                      id: createDishInput.restaurantId
                  }
              }
            )
            if(!restaurant) {
                return {
                    ok: false,
                    error: "Restaurant not found"
                }
            }
            if(owner.id != restaurant.ownerId) {
                return {
                    ok: false,
                    error: "You can't do that."
                }
            }
            const dish = await this.dishes.save(this.dishes.create({ ...createDishInput, restaurant }))
            return {
                ok: true
            }
        } catch (error) {
            console.log(error);
            return {
                ok: false,
                error: "Could not create dish."
            }
        }
    }
}