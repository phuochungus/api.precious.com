import { Type } from "class-transformer";
import { IsInt, IsNumber, Min } from "class-validator";

export class CreateVariantDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;

    @Type(() => Number)
    @IsInt()
    product_id: number;

    @IsInt()
    @Min(0)
    quantity: number;
}
