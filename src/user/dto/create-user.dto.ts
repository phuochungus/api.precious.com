import { IsEnum, IsString } from "class-validator";
import { UserRole } from "src/entities/user.entity";

export class CreateUserDto {
    @IsString()
    uid: string;

    @IsEnum(UserRole)
    userRole: UserRole = UserRole.USER;
}