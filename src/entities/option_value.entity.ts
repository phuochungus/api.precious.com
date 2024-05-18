import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Option } from "./option.entity";
import { VariantOptionValue } from "./variant_option_value.entity";

@Entity()
export class OptionValue {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value: string;

    @ManyToOne(() => Option, option => option.values)
    option: Option;

    @OneToMany(() => VariantOptionValue, variantOptionValue => variantOptionValue.option_value)
    variant_option_values: VariantOptionValue[];
}