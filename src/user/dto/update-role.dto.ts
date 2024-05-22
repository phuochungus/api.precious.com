import { IsEnum } from "class-validator";
import { UserRole } from "src/entities/user.entity";

export class UpdateRoleDto {
    @IsEnum(UserRole)
    userRole: UserRole;
}