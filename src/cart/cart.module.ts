import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart_item.entity';
import { Variant } from '../entities/variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Variant])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule { }
