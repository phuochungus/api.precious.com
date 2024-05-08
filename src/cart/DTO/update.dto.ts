import {
    IsArray,
    IsNumber,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CartObject {
    @IsNumber()
    @Min(0)
    variant_id: number;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class UpdateCartDTO {
    @IsArray()
    @Type(() => CartObject)
    updates: CartObject[];
}
