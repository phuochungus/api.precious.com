import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateVariantDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsString()
    name?: string;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(0)
    quantity?: number;
}
