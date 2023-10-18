import { Module } from '@nestjs/common';
import { CategoryResolver, DishResolver, RestaurantResolver } from "./restaurant.resolver";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Restaurant} from "./entities/restaurant.entity";
import {RestaurantService} from "./restaurant.service";
import {CategoryRepository} from "./repositories/category.reposigory";
import {TypeOrmExModule} from "../common/typeorm.module";
import { Dish } from "./entities/dish.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Restaurant, Dish]),
        TypeOrmExModule.forCustomRepository([CategoryRepository])
    ],
    providers: [
        RestaurantResolver,
        CategoryResolver,
        DishResolver,
        RestaurantService
    ]
})
export class RestaurantModule {}