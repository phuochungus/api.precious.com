import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsNumber, IsString, Min } from "class-validator";

export class CreateValueDto {
    @IsString()
    value: string;
}

export class CreateOptionDto {
    @ApiProperty({ example: 'Material' })
    @IsString()
    name: string;

    @Type(() => CreateValueDto)
    @IsArray()
    @ApiProperty({ type: [CreateValueDto], example: [{ value: 'Gold' }, { value: 'Platinum' }, { value: 'Silver' }] })
    values: CreateValueDto[];

    @IsInt()
    @Min(1)
    product_id: number;
}