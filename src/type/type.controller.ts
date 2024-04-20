import { Controller, Post, Body, Get } from '@nestjs/common';
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('type')
@ApiTags('Type')
export class TypeController {
  constructor(private readonly typeService: TypeService) { }

  @Post()
  create(@Body() createTypeDto: CreateTypeDto) {
    return this.typeService.create(createTypeDto);
  }

  @Get()
  async findAll() {
    return await this.typeService.findAll();
  }
}
