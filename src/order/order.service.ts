import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderStatus } from 'src/order/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { Variant } from 'src/entities/variant.entity';
import { UpdateStatusOrderDto } from 'src/order/dto/update-order.dto';
import { CartItem } from 'src/entities/cart_item.entity';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) { }

  async create(createOrderDto: CreateOrderDto) {
    let result_id: number = null;
    const queryRunner = this.orderRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      let createItems: CartItem[] = [];
      for (let item of createOrderDto.items) {
        //check if items stock is available
        const variant = await queryRunner.manager.findOne(Variant, { where: { id: item.variant_id } })
        if (!variant) {
          throw new NotFoundException(`Variant with id ${item.variant_id} not found`)
        }

        if (variant.quantity < item.quantity) {
          throw new NotFoundException(`Stock not available for variant with id ${item.variant_id}`)
        }
        //reduce stock
        variant.quantity -= item.quantity;
        createItems.push(new CartItem());
        await queryRunner.manager.save(variant);
      }

      let order = await this.orderRepository.save({ items: createItems, status: OrderStatus.PENDING, user_id: createOrderDto.user_id });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return await this.orderRepository.findOne({ where: { id: result_id } });
  }

  async findAll() {
    return await this.orderRepository.find();
  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({ where: { id: id } });
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
          variant.quantity += item.quantity;
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
}
