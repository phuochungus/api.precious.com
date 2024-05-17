import { IsEmail, IsEnum, IsInt, IsOptional, IsPhoneNumber, IsString } from "class-validator";
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

    @IsOptional()
    @IsString()
    phone_number: string;
}