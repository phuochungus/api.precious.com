import { Body, Controller, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { FirebaseAuthGuard } from '../guard/firebase-auth.guard';

@Controller('cart')
@UseGuards(FirebaseAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Put()
  async updateCart(@Req() req, @Body() updateDto: { updates: { productId: number; quantity: number }[] }) {
    const userId = req.user.id; // Assuming FirebaseAuthGuard attaches user info
    return this.cartService.updateCartItems(userId, updateDto.updates);
  }

  @Delete()
  async clearCart(@Req() req) {
    const userId = req.user.id; // Assuming FirebaseAuthGuard attaches user info
    await this.cartService.clearCart(userId);
    return { message: 'Cart cleared successfully' };
  }
}
