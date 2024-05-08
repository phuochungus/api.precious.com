import { IsEnum, IsString } from "class-validator";
import { Role } from "src/entities/admin.entity";

export class CreateAdminDto {
    @IsString()
    uid: string;

    @IsEnum(Role)
    role: Role
}