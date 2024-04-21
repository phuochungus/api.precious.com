import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OptionValue } from "./option_value.entity";
import { Product } from "./product.entity";
import { VariantOptionValue } from "./variant_option_value.entity";

@Entity()
export class Option {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    product_id: number;

    @OneToMany(() => OptionValue, optionValue => optionValue.option, { eager: true, cascade: true })
    values: OptionValue[];

    @ManyToOne(() => Product, product => product.options)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @OneToMany(() => VariantOptionValue, variantOptionValue => variantOptionValue.option)
    variant_option_values: VariantOptionValue[];
}

