import { Variant } from "src/entities/variant.entity";
import { Order } from "src/order/entities/order.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.items, { nullable: false })
    order: Order;

    @ManyToOne(() => Variant, { nullable: false })
    @JoinColumn({ name: "variant_id" })
    variant: Variant;

    @Column()
    variant_id: number;

    @Column()
    quantity: number;

    @Column()
    price: number;
}
