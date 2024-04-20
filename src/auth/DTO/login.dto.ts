import { IsString } from "class-validator";

export class LoginDTO {
    @IsString()
    idToken: string;
}