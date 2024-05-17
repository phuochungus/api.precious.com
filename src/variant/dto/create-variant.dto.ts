import { Type } from "class-transformer";
import { IsInt, IsNumber, IsString, Min } from "class-validator";

export class CreateVariantDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    name: string;

    @Type(() => Number)
    @IsInt()
    product_id: number;

    @IsInt()
    @Min(0)
    @Type(() => Number)
    quantity: number;
}
