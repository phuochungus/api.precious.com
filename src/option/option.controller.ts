import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Post()
  async createOption(@Body() createOptionDto: CreateOptionDto) {
    return await this.optionService.createOption(createOptionDto);
  }
}
