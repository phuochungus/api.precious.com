import { Injectable } from '@nestjs/common';
import { CreateOptionvalueDto } from './dto/create-optionvalue.dto';
import { UpdateOptionvalueDto } from './dto/update-optionvalue.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Optionvalue } from 'src/optionvalue/entities/optionvalue.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OptionvalueService {
  constructor(
    @InjectRepository(Optionvalue)
    private optionvalueRepository: Repository<Optionvalue>,
  ) { }

  create(createOptionvalueDto: CreateOptionvalueDto) {
    return
  }

  findAll() {
    return `This action returns all optionvalue`;
  }

  findOne(id: number) {
    return `This action returns a #${id} optionvalue`;
  }

  update(id: number, updateOptionvalueDto: UpdateOptionvalueDto) {
    return `This action updates a #${id} optionvalue`;
  }

  remove(id: number) {
    return `This action removes a #${id} optionvalue`;
  }
}
