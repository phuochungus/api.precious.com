import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, DeleteDateColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { VariantOptionValue } from './variant_option_value.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Variant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

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

    @Column({ default: 0 })
    quantity: number = 0;

    @DeleteDateColumn()
    deleted_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Expose()
    get img_paths_url() {
        return this.img_paths.map(path => `https://storage.googleapis.com/${process.env.STORAGE_BUCKET_NAME}/${path}`);
    }
}
