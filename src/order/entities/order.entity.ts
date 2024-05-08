import { Expose } from "class-transformer";
import { CartItem } from "src/entities/cart_item.entity";
import { User } from "src/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum OrderStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.orders, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column()
    user_id: number;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
        cascade: true,
    })
    items: CartItem[];

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Expose()
    get total_price(): number {
        return this.items?.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }
}
