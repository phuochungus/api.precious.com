import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { OrderStatus } from "src/entities/order.entity";

export class UpdateStatusOrderDto {
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;

    @IsOptional()
    @IsBoolean()
    is_paid?: boolean;
}