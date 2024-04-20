import { IsString } from "class-validator";

export class LoginEmailDTO {
    @IsString()
    email: string;

    @IsString()
    password: string;
}