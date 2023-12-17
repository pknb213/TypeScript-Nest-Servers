import {PickType} from "@nestjs/mapped-types";
import {Product} from "../entities/product.entity";
import {CommonOutput} from "../../common/dtos/common-output.dto";

export class CreateProductInput extends PickType(Product, [
    "name",
    "category",
    "price",
    "coverImg"
]) {}

export class CreateProductOutput extends CommonOutput {}