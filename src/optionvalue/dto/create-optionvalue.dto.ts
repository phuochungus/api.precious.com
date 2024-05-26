import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class CreateOptionvalueDto {
    @IsString()
    value: string;

    @Type(() => Number)
    @IsInt()
    option_id: number;

}
