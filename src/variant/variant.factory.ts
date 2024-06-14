import { Inject, Injectable } from "@nestjs/common";
import { Product } from "../entities/product.entity";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Variant } from "../entities/variant.entity";
import { VariantOptionValue } from "../entities/variant_option_value.entity";


@Injectable()
export class VariantFactory {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Variant)
        private readonly variantRepository: Repository<Variant>,
        @InjectRepository(VariantOptionValue)
        private readonly variantOptionValueRepository: Repository<VariantOptionValue>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    cartesian(...a) {
        if (a.length === 0) return [];
        if (a.length === 1) return a[0].map(e => [e]);
        return a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
    }

    async createVariants(product_id: number) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let product = await this.productRepository.findOne({
                relations: ["options", "options.values"],
                where: { id: product_id },
            })
            if (!product) {
                throw new Error("Product not found, can not create variants for it.")
            }
            let { options } = product;
            if (options.length === 0) return []
            let valueOnlyArr = options.map(o => o.values);
            let cartesianArr = this.cartesian(...valueOnlyArr);
            let variants: Variant[] = []
            for (let i = 0; i < cartesianArr.length; i++) {
                let variant = await this.variantRepository.save({
                    name: product.name,
                    quantity: 0,
                    product_id: product.id,
                    price: product.price || 100000,
                })
                for (let j = 0; j < cartesianArr[i].length; j++) {
                    await this.variantOptionValueRepository.save({
                        variant_id: variant.id,
                        option_value_id: cartesianArr[i][j].id,
                        option_id: options[j].id,
                    })
                }
                variants.push(variant)
            }
            await queryRunner.commitTransaction()
            return variants
        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }
    }
}