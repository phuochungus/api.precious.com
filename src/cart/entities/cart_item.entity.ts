import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../product/entities/product.entity';
import { Variant } from '../../variant/entities/variant.entity';


@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, cart => cart.items)
  cart: Cart;

  @ManyToOne(() => Variant)
  variant: Variant;

  @Column()
  quantity: number;
}
