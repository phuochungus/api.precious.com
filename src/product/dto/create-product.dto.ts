import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    short_description: string;

    @IsString()
    description: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(5)
    rating: number = 5;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    category_id: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    quantity?: number;
}
