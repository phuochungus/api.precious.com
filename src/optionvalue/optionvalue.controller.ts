import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OptionvalueService } from './optionvalue.service';
import { CreateOptionvalueDto } from './dto/create-optionvalue.dto';
import { UpdateOptionvalueDto } from './dto/update-optionvalue.dto';

@Controller('optionvalue')
export class OptionvalueController {
  constructor(private readonly optionvalueService: OptionvalueService) { }

  @Post()
  create(@Body() createOptionvalueDto: CreateOptionvalueDto) {
    return this.optionvalueService.create(createOptionvalueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.optionvalueService.remove(id);
  }

}
