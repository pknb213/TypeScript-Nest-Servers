import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TypeOrmExModule} from "../../global/custom-repo/typeorm.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    TypeOrmExModule.forCustomRepository([])
  ],
  providers: [ProductsService, ProductsResolver]
})
export class ProductsModule {}
