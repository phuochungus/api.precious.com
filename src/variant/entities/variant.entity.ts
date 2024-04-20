import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { VariantOptionValue } from '../../variant-option-value/entity/variant_option_value.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Variant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text", { array: true, default: [] })
    img_paths: string[];

    @Column()
    price: number;

    @ManyToOne(() => Product, product => product.variants, { nullable: false })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    product_id: number;

    @OneToMany(() => VariantOptionValue, variantOptionValue => variantOptionValue.variant)
    variant_option_values: VariantOptionValue[];

    @Expose()
    get img_paths_url() {
        return this.img_paths.map(path => `https://storage.googleapis.com/${process.env.STORAGE_BUCKET_NAME}/${path}`);
    }
}
