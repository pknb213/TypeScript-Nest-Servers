import {Mutation, Query, Resolver} from '@nestjs/graphql';
import {ProductsService} from "./products.service";
import {CreateProductInput, CreateProductOutput} from "./dtos/create-product.dto";
import {SearchAllProductOutput, SearchProductInput, SearchProductOutput} from "./dtos/search-product.dto";
import {EditProductInput, EditProductOutput} from "./dtos/edit-product.dto";
import {DeleteProductInput, DeleteProductOutput} from "./dtos/delete-product.dto";

@Resolver()
export class ProductsResolver {
    constructor(
        private readonly productsService: ProductsService
    ) {}

    @Mutation()
    async crateProduct(
        createProductInput: CreateProductInput
    ): Promise<CreateProductOutput> {
        try {

            return {ok: true, data: 1}
        } catch (e) {
            console.log(e)
            return {ok: false, error: e}
        }
    }

    @Query()
    async getProduct(
        searchProductInput: SearchProductInput
    ): Promise<SearchProductOutput> {
        try {
            return {ok: true, data: 1}
        } catch (e) {
            console.log(e)
            return {ok: false, error: e}
        }
    }

    @Query()
    async getAllProduct(
        searchProductInput: SearchAllProductOutput
    ): Promise<SearchAllProductOutput> {
        try {
            return {ok: true, data: 1}
        } catch (e) {
            console.log(e)
            return {ok: false, error: e}
        }
    }

    @Mutation()
    async editProduct(
        editProductInput: EditProductInput
    ): Promise<EditProductOutput> {
        try {
            return {ok: true, data: 1}
        } catch (e) {
            console.log(e)
            return {ok: false, error: e}
        }
    }

    @Mutation()
    async deleteProduct(
        deleteProductInput: DeleteProductInput
    ): Promise<DeleteProductOutput> {
        try {
            return {ok: true, data: 1}
        } catch (e) {
            console.log(e)
            return {ok: false, error: e}
        }
    }
}
