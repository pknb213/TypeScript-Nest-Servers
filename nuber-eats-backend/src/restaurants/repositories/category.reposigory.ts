import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import {Category} from "../entities/category.entity";
import {CustomRepository} from "../../common/custom-repository.decorator";

@CustomRepository(Category)
export class CategoryRepository extends Repository<Category> {
    // constructor(private dataSource: DataSource) {
    //     super(Category, dataSource.createEntityManager());
    // }

    async getOrCreate(name: string): Promise<Category> {
        try {
            const categoryName = name
                .trim()
                .toLowerCase()
            const categorySlug = categoryName.replace(/ /g, "-")
            let category = await this.findOne({where: {slug: categorySlug}})
            if (!category) {
                category = await this.save(
                    this.create({
                        slug: categorySlug,
                        name: categoryName
                    })
                )
            }
            return category
        }
        catch (e) {
            console.log("\nError >>:", e)
        }
    }
}