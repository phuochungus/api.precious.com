import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class PaginateDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    start?: number;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    quantity?: number;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    type?: number;


}