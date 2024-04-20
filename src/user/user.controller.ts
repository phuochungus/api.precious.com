import { Controller, Delete, Get, Injectable, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiTags } from "@nestjs/swagger";

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

    @Delete("/:id")
    async delete(@Param('id') id: string) {
        return await this.userService.delete(id);
    }

}