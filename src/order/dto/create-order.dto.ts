import { Type } from "class-transformer";
import { IsArray, IsInt } from "class-validator";
import { CartObject } from "src/cart/DTO/update.dto";

export class CreateOrderDto {
    @IsArray()
    @Type(() => CartObject)
    items: CartObject[];

    @IsInt()
    user_id: number;
    
}

