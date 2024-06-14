import { BadGatewayException, Injectable } from "@nestjs/common";
import { Product } from "../entities/product.entity";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Variant } from "../entities/variant.entity";
import { VariantOptionValue } from "../entities/variant_option_value.entity";
import { SameAttributeVariant } from "src/entities/same_attribute_variant";
import { NullAttributeVariant } from "src/entities/null_attribute_variant";

class CreateVariantBluePrintDto {
    variants: Variant[];
    variant_option_values: VariantOptionValue[];
}

class CreateSameAttributeVariantBluePrintDto extends CreateVariantBluePrintDto {
    variants: SameAttributeVariant[];
}

class CreateNullAttributeVariantBluePrintDto extends CreateVariantBluePrintDto {
    variants: NullAttributeVariant[];
}


@Injectable()
export abstract class VariantFactory {
    constructor(
        @InjectRepository(Product)
        protected readonly productRepository: Repository<Product>,
        @InjectRepository(Variant)
        protected readonly variantRepository: Repository<Variant>,
        @InjectRepository(VariantOptionValue)
        protected readonly variantOptionValueRepository: Repository<VariantOptionValue>,
        @InjectDataSource()
        protected readonly dataSource: DataSource,
    ) { }

    cartesian(...a) {
        if (a.length === 0) return [];
        if (a.length === 1) return a[0].map(e => [e]);
        return a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
    }

    async createVariants(product_id: number): Promise<CreateVariantBluePrintDto> {
        try {
            let product = await this.productRepository.findOne({
                relations: ["options", "options.values"],
                where: { id: product_id },
            });
            if (!product) {
                throw new Error("Product not found, cannot create variants for it.");
            }
            let { options } = product;
            if (options.length === 0) return { variants: [], variant_option_values: [] }
            let valueOnlyArr = options.map(o => o.values);
            let cartesianArr = this.cartesian(...valueOnlyArr);
            let variants: Variant[] = [];
            let variantOptionValues = [];
            for (let i = 0; i < cartesianArr.length; i++) {
                let variant = new Variant({ product_id })
                for (let j = 0; j < cartesianArr[i].length; j++) {
                    variantOptionValues.push({
                        option_value_id: cartesianArr[i][j].id,
                        option_id: options[j].id,
                    });
                }
                variants.push(variant);
            }
            return { variants, variant_option_values: variantOptionValues };
        } catch (error) {
            throw new BadGatewayException("Có lỗi xảy ra khi tạo biến thể sản phẩm")
        }
    }

    async saveVariants(product_id: number): Promise<Variant[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let product = await this.productRepository.findOne({
                relations: ["options", "options.values"],
                where: { id: product_id },
            });
            if (!product) {
                throw new Error("Product not found, cannot create variants for it.");
            }
            product.quantity = 0;
            let { variants, variant_option_values } = await this.createVariants(product_id);
            variants = await this.variantRepository.save(variants);
            variant_option_values = variant_option_values.map((v, i) => ({ ...v, variant_id: variants[i].id }));

            await this.variantOptionValueRepository.save(variant_option_values);
            product.quantity = variants.reduce((acc, v) => acc + v.quantity, 0);
            await this.productRepository.save(product);

            await queryRunner.commitTransaction();
            return variants;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }

    }
}

@Injectable()
export class SameAttributeVariantFactory extends VariantFactory {
    constructor(
        @InjectRepository(Product)
        productRepository: Repository<Product>,
        @InjectRepository(Variant)
        variantRepository: Repository<Variant>,
        @InjectRepository(VariantOptionValue)
        variantOptionValueRepository: Repository<VariantOptionValue>,
        @InjectDataSource()
        dataSource: DataSource,
    ) {
        super(productRepository, variantRepository, variantOptionValueRepository, dataSource);
    }

    async createVariants(product_id: number): Promise<CreateSameAttributeVariantBluePrintDto> {
        try {
            let { variants, variant_option_values }: CreateVariantBluePrintDto = await super.createVariants(product_id);
            let product = await this.productRepository.findOne({
                relations: ["options", "options.values"],
                where: { id: product_id },
            });
            if (!product) {
                throw new Error("Product not found, cannot create variants for it.");
            }
            let sameAttributeVariants = variants.map(v => new SameAttributeVariant(v, product));
            return { variants: sameAttributeVariants, variant_option_values };
        } catch (error) {
            throw new BadGatewayException("Có lỗi xảy ra khi tạo biến thể sản phẩm")
        }
    }
}

@Injectable()
export class NullAttributeVariantFactory extends VariantFactory {
    constructor(
        @InjectRepository(Product)
        productRepository: Repository<Product>,
        @InjectRepository(Variant)
        variantRepository: Repository<Variant>,
        @InjectRepository(VariantOptionValue)
        variantOptionValueRepository: Repository<VariantOptionValue>,
        @InjectDataSource()
        dataSource: DataSource,
    ) {
        super(productRepository, variantRepository, variantOptionValueRepository, dataSource);
    }

    async createVariants(product_id: number): Promise<CreateNullAttributeVariantBluePrintDto> {
        try {
            let { variants, variant_option_values }: CreateVariantBluePrintDto = await super.createVariants(product_id);
            let product = await this.productRepository.findOne({
                relations: ["options", "options.values"],
                where: { id: product_id },
            });
            if (!product) {
                throw new Error("Product not found, cannot create variants for it.");
            }
            let nullAttributeVariants = variants.map(v => new NullAttributeVariant(v, product));
            return { variants: nullAttributeVariants, variant_option_values };
        } catch (error) {
            throw new BadGatewayException("Có lỗi xảy ra khi tạo biến thể sản phẩm")
        }
    }
}