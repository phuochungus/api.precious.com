import { Expose } from "class-transformer";
import { CartItem } from "src/entities/cart_item.entity";
import { User } from "src/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

enum OrderStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
        cascade: true,
    })
    items: CartItem[];

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Expose()
    get total_price(): number {
        return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }
}
