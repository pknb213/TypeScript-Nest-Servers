import { Module } from '@nestjs/common';
import {CategoryResolver, RestaurantResolver} from "./restaurant.resolver";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Restaurant} from "./entities/restaurant.entity";
import {RestaurantService} from "./restaurant.service";
import {CategoryRepository} from "./repositories/category.reposigory";
import {TypeOrmExModule} from "../common/typeorm.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Restaurant]),
        TypeOrmExModule.forCustomRepository([CategoryRepository])
    ],
    providers: [RestaurantResolver, CategoryResolver, RestaurantService]
})
export class RestaurantModule {}