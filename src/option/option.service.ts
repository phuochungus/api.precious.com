import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from '../entities/option.entity';
import { Repository } from 'typeorm';
import { CreateOptionDto } from './dto/create_option.dto';

@Injectable()
export class OptionService {
    constructor(
        @InjectRepository(Option)
        private optionRepository: Repository<Option>
    ) { }

    async findAll() {
        return await this.optionRepository.find();
    }

    async deleteOption(id: number) {
        return await this.optionRepository.softDelete(id);
    }

    async createOption(createOptionDto: CreateOptionDto) {
        return await this.optionRepository.save(createOptionDto);
    }
}
