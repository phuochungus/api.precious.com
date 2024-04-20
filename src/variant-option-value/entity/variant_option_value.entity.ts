import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Variant } from "../../variant/entities/variant.entity";
import { OptionValue } from "../../option/entities/option_value.entity";
import { Option } from "../../option/entities/option.entity";


@Entity()
export class VariantOptionValue {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Variant, variant => variant.variant_option_values)
    @JoinColumn({ name: 'variant_id' })
    variant: Variant;

    @Column()
    variant_id: number;
    
    @ManyToOne(() => Option, option => option.variant_option_values, { eager: true })
    @JoinColumn({ name: 'option_id' })
    option: Option;

    @Column()
    option_id: number;

    @ManyToOne(() => OptionValue, optionValue => optionValue.variant_option_values, { eager: true })
    @JoinColumn({ name: 'option_value_id' })
    option_value: OptionValue;

    @Column()
    option_value_id: number;

}