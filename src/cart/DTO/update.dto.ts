import {
    IsArray,
    IsNumber,
    Min,
} from 'class-validator';
class CartObject {
    @IsNumber()
    @Min(0)
    variant_id: number;

    @IsNumber()
    @Min(1)
    quantity: number;
}
import { Type } from 'class-transformer';

export class UpdateCartDTO {
    @IsArray()
    @Type(() => CartObject)
    updates: CartObject[];
}
