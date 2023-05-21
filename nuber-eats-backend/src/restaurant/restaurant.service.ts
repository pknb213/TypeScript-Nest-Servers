import {Injectable} from "@nestjs/common";
import {Restaurant} from "./entities/restaurant.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateRestaurantInput, CreateRestaurantOutput} from "./dtos/create-restaurant.dto";
import {User} from "../users/entities/user.entity";
import {Category} from "./entities/category.entiey";
import {EditRestaurantInput, EditRestaurantOutput} from "./dtos/edit-restaurant.dto";
import {CategoryRepository} from "./repositories/category.reposigory";
import {DeleteRestaurantInput, DeleteRestaurantOutput} from "./dtos/delete-restaurant.dto";
import {AllCategoriesOutput} from "./dtos/all-categories.dto";
import {CategoryInput, CategoryOutput} from "./dtos/category.dto";

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(CategoryRepository)
        private readonly categories: CategoryRepository
    ) {
    }

    async createRestaurant(
        owner: User,
        createRestaurantInput: CreateRestaurantInput
    ): Promise<CreateRestaurantOutput> {
        try {
            const newRestaurant = this.restaurants.create(createRestaurantInput)
            newRestaurant.owner = owner
            const category = await this.categories.getOrCreate(createRestaurantInput.categoryName)
            newRestaurant.category = category
            await this.restaurants.save(newRestaurant)
            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error: "Could not create restaurant"
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
        return this.restaurants.count({where: category })
    }

    async findCategoryBySlug({slug}: CategoryInput): Promise<CategoryOutput> {
        try {
            const category = await this.categories.findOne(
                {where: {slug}, relations: ["restaurants"]
                }
            )
            if(!category) return {ok: false, error: "Category not found"}
           return {ok: true, category}
        } catch (e) {
            return {ok: false, error: "Could not road category"}
        }
    }
}