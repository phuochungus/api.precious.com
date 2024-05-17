import { Type } from "class-transformer";
import { IsInt, IsString, Min } from "class-validator";

export class CreateAddressDto {
    @IsString()
    address: string;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    user_id: number;
}
