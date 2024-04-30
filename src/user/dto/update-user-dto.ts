import { IsEmail, IsEnum, IsInt, IsOptional } from "class-validator";
import { Gender } from "src/entities/user.entity";

export class UpdateUserDto {
    @IsEnum(Gender)
    gender: Gender;

    @IsOptional()
    @IsEmail()
    email?: string;


    @IsOptional()
    @IsInt()
    age?: number;
}