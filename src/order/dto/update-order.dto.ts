import { IsEnum } from "class-validator";
import { OrderStatus } from "src/entities/order.entity";

export class UpdateStatusOrderDto {
    @IsEnum(OrderStatus)
    status: OrderStatus;
}