import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Cart } from './cart.entity';
import { Variant } from './variant.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, cart => cart.items, { nullable: false })
  cart: Cart;

  @ManyToOne(() => Variant)
  variant: Variant;

  @Column()
  quantity: number;

  @Column()
  price: number;
}
