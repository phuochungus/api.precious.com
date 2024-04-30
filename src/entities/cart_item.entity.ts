import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Or } from 'typeorm';
import { Cart } from './cart.entity';
import { Variant } from './variant.entity';
import { Order } from 'src/order/entities/order.entity';


@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, cart => cart.items)
  cart: Cart;

  @ManyToOne(() => Order, order => order.items)
  order: Order;

  @ManyToOne(() => Variant)
  variant: Variant;

  @Column()
  quantity: number;

  @Column()
  price: number;
}
