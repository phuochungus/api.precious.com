import { Controller, Get, Post, Body, Patch, Param, HttpCode, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStatusOrderDto } from 'src/order/dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { RedirectURLDto } from 'src/order/dto/paid.dto';

@Controller('order')
@ApiTags('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto);
  }

  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.orderService.findOne(id);
  }

  @Post(':id/paid')
  async paid(@Param('id') id: number, @Body() { redirectURL }: RedirectURLDto) {
    return await this.orderService.paid(id, redirectURL);
  }

  @Post('/ipn_momo_webhook')
  @HttpCode(204)
  async ipnMomoWebhook(@Body() body: any) {
    console.log('===IPN MOMO WEBHOOK===');
    console.log(body);
    let { orderId } = JSON.parse(atob(body.extraData))
    if (!orderId) {
      console.error('expected orderId in extraData')
      console.error(body)
      return;
    }
    await this.orderService.updatePaid(orderId);
    return 'OK';
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateStatusOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }
}
