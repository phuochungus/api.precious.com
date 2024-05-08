import { IsString } from "class-validator";

export class RedirectURLDto {
    @IsString()
    redirectURL: string;
}