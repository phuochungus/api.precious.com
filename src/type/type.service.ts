import { Injectable } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from '../entities/type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type) private typesRepository: Repository<Type>,
  ) { }
  async create(createTypeDto: CreateTypeDto) {
    return await this.typesRepository.save(createTypeDto);
  }


  async findAll() {
    return await this.typesRepository.find();
  }

}
