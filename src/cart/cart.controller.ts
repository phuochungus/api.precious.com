import { Body, Controller, Delete, Get, Put, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { FirebaseAuthGuard } from '../guard/firebase-auth.guard';
import { UpdateCartDTO } from './DTO/update.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(FirebaseAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Put()
  async updateCart(
    @Req() req,
    @Body() updateDto: UpdateCartDTO,
  ) {
    const userId = req.user.id;
    return this.cartService.updateCartItems(userId, updateDto);
  }

  @Delete()
  async clearCart(@Req() req) {
    const userId = req.user.id;
    await this.cartService.clearCart(userId);
    return { message: 'Cart cleared successfully' };
  }

  @Get()
  async getCart(@Req() req) {
    const userId = req.user.id;
    return await this.cartService.getCart(userId);
  }
}
