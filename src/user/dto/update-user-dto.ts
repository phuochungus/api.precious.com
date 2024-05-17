import { IsEmail, IsEnum, IsInt, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { Gender, UserRole } from "src/entities/user.entity";

export class UpdateUserDto {
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsInt()
    age?: number;

    @IsOptional()
    @IsString()
    phone_number?: string;

    @IsOptional()
    @IsEnum(UserRole)
    userRole?: UserRole;
}