import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderStatus } from 'src/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { Variant } from 'src/entities/variant.entity';
import { UpdateStatusOrderDto } from 'src/order/dto/update-order.dto';
import { CartItem } from 'src/entities/cart_item.entity';
import { OrderItem } from 'src/entities/order_item.entity';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) { }

  async create(createOrderDto: CreateOrderDto) {
    const queryRunner = this.orderRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      let order = new Order();
      order.status = OrderStatus.PENDING;
      order.user_id = createOrderDto.user_id;
      order.address = createOrderDto.address;
      order.items = [];
      order.phone_number = createOrderDto.phone_number;

      for (let item of createOrderDto.items) {
        const variant = await queryRunner.manager.findOne(Variant, { where: { id: item.variant_id } })
        const product = await queryRunner.manager.findOne(Product, { where: { id: variant.product_id } })
        if (!variant) {
          throw new NotFoundException(`Variant with id ${item.variant_id} not found`)
        }

        if (variant.quantity < item.quantity) {
          throw new NotFoundException(`Stock not available for variant with id ${item.variant_id}`)
        }
        variant.quantity -= item.quantity;
        product.quantity -= item.quantity;

        await queryRunner.manager.save(variant);
        let cartItem = new OrderItem();
        cartItem.quantity = item.quantity;
        cartItem.price = variant.price;
        cartItem.variant = variant;
        order.items.push(cartItem);
      }
      if (order.items.length === 0) {
        throw new ConflictException('Order is empty')
      }
      order = await this.orderRepository.save(order);
      await queryRunner.commitTransaction();
      return await this.orderRepository.findOne({ where: { id: order.id }, relations: ['items'] });
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err.message)
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.orderRepository.find({ relations: ['items'] });
  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({ where: { id: id }, relations: ['items'] });
  }


  async update(id: number, updateOrderDto: UpdateStatusOrderDto) {
    let order = await this.orderRepository.findOne({ where: { id: id } });
    order.status = updateOrderDto.status;
    if (updateOrderDto.status === 'CANCELLED') {
      const queryRunner = this.orderRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      try {
        await queryRunner.startTransaction();
        for (let item of order.items) {
          const variant = await queryRunner.manager.findOne(Variant, { where: { id: item.variant.id } })
          const product = await queryRunner.manager.findOne(Product, { where: { id: variant.product_id } })
          variant.quantity += item.quantity;
          product.quantity += item.quantity;
          await queryRunner.manager.save(variant);
        }
        await queryRunner.commitTransaction();

        return await this.orderRepository.save(order);
      } catch (err) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }
  }

  async updatePaid(id: number) {
    await this.orderRepository.update(id, { is_paid: true });
  }

  async paid(id: number, redirectURL: string) {
    let order = await this.orderRepository.findOne({ where: { id: id }, relations: ['items'] });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    if (order.is_paid) throw new ConflictException(`Order with id ${id} already paid`);

    let partnerCode = "MOMO";
    let accessKey = process.env.MOMO_ACCESS_KEY;
    let secretkey = process.env.MOMO_SECRET_KEY;
    let requestId = partnerCode + new Date().getTime();
    let orderId = order.id.toString() + new Date().getTime();
    let orderInfo = "Thanh toán đơn hàng " + order.id;
    let redirectUrl = redirectURL;
    let ipnUrl = process.env.HOST_URL + '/api/order/ipn_momo_webhook'
    let amount = order.total_price.toString();
    let requestType = "captureWallet"
    let extraData = btoa(JSON.stringify({ orderId: order.id }));
    let rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)

    const crypto = require('crypto');
    let signature = crypto.createHmac('sha256', secretkey)
      .update(rawSignature)
      .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: 'en'
    });



    let res = await fetch('https://test-payment.momo.vn/v2/gateway/api/create', {
      method: 'POST',
      body: requestBody,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody).toString()
      }
    });
    let data = await res.json();
    console.log(data);
    return data;
  }
}
