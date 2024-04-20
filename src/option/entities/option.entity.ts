import { Code, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OptionValue } from "./option_value.entity";
import { Product } from "../../product/entities/product.entity";
import { VariantOptionValue } from "../../variant-option-value/entity/variant_option_value.entity";

@Entity()
export class Option {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => OptionValue, optionValue => optionValue.option, { eager: true, cascade: true })
    values: OptionValue[];

    @ManyToOne(() => Product, product => product.options)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @Column()
    product_id: number;

    @OneToMany(() => VariantOptionValue, variantOptionValue => variantOptionValue.option)
    variant_option_values: VariantOptionValue[];
}

