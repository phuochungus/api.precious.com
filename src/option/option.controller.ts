import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/create_option.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('option')
@ApiTags('Option')
export class OptionController {
  constructor(private readonly optionService: OptionService) { }

  @Get()
  async findAll() {
    return await this.optionService.findAll();
  }

  @Delete("/:id")
  async deleteOption(@Param('id') id: number) {
    return await this.optionService.deleteOption(id);
  }

  @Post()
  async createOption(@Body() createOptionDto: CreateOptionDto) {
    return await this.optionService.createOption(createOptionDto);
  }
}
