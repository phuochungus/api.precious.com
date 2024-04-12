import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entity/Cart.entity';
import { CartItem } from '../entity/CartItem.entity';
import { Product } from '../entity/Product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async updateCartItems(
    userId: number,
    updates: { productId: number; quantity: number }[],
  ): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId }, items: [] });
    } else {
      // Clear existing items to replace them with the updates
      await this.cartItemRepository.remove(cart.items);
      cart.items = [];
    }

    // Process updates
    for (const update of updates) {
      if (update.quantity > 0) {
        const product = await this.productRepository.findOneBy({
          id: update.productId,
        });
        if (!product) {
          continue; // Optionally handle this situation (e.g., error message)
        }
        const cartItem = this.cartItemRepository.create({
          cart,
          product,
          quantity: update.quantity,
        });
        cart.items.push(cartItem);
      }
      // If quantity is 0 or less, it's effectively removed by not re-adding it
    }

    await this.cartRepository.save(cart);
    return cart;
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items'],
    });

    if (cart) {
      await this.cartItemRepository.remove(cart.items);
      // Optionally, you could also remove the cart itself if that fits your model better
    }
  }
}
