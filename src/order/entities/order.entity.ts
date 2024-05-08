import { Expose } from "class-transformer";
import { CartItem } from "src/entities/cart_item.entity";
import { OrderItem } from "src/entities/order_item.entity";
import { User } from "src/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => User, (user) => user.orders, { nullable: false, cascade: ['insert'] })
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column()
    user_id: number;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items: OrderItem[];

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Column({ default: false })
    is_paid: boolean = false

    @CreateDateColumn()
    created_at: Date;

    @Expose()
    get total_price(): number {
        return this.items?.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }
}
