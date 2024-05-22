import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiTags } from "@nestjs/swagger";
import { UpdateUserDto } from "src/user/dto/update-user-dto";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UpdateRoleDto } from "src/user/dto/update-role.dto";

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Get()
    async findAll() {
        return await this.userService.findAll();
    }

    @Get("find_by_uid/:uid")
    async findByUid(@Param('uid') uid: string) {
        return await this.userService.findByUid(uid);
    }

    @Get("/find_by_id/:id")
    async findById(@Param('id') id: number) {
        return await this.userService.findById(id);
    }

    @Put("/update_role/:id")
    async updateRole(@Param('id') id: number, @Body() updateUserDto: UpdateRoleDto) {
        return await this.userService.updateRole(id, updateUserDto);
    }

    @Delete("/:id")
    async delete(@Param('id') id: number) {
        return await this.userService.delete(id);
    }

    @Put("/:id")
    async update(@Req() req: any, @Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        if (req.user.uid !== id) {
            throw new ForbiddenException('You do not have permission to update this user');
        }
        return await this.userService.update(id, updateUserDto);
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }
}