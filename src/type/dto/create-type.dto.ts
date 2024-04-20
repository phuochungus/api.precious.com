import { IsString } from "class-validator";

export class CreateTypeDto {
    @IsString()
    name: string;
}
