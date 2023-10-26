import { Module } from '@nestjs/common';
import { CategoryResolver, DishResolver, RestaurantsResolver } from "./restaurants.resolver";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Restaurant} from "./entities/restaurant.entity";
import {RestaurantsService} from "./restaurants.service";
import {CategoryRepository} from "./repositories/category.reposigory";
import {TypeOrmExModule} from "../common/typeorm.module";
import { Dish } from "./entities/dish.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Restaurant, Dish]),
        TypeOrmExModule.forCustomRepository([CategoryRepository])
    ],
    providers: [
        RestaurantsResolver,
        CategoryResolver,
        DishResolver,
        RestaurantsService
    ]
})
export class RestaurantsModule {}