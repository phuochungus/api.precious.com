import { Type } from "class-transformer";
import { IsArray, IsInt, IsString } from "class-validator";
import { CartObject } from "src/cart/DTO/update.dto";

export class CreateOrderItemDto extends CartObject {
    price: number;
}

export class CreateOrderDto {
    @IsArray()
    @Type(() => CartObject)
    items: CartObject[];

    @IsInt()
    user_id: number;

    @IsString()
    address: string;
}

