import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) { }

  async create(createAddressDto: CreateAddressDto) {
    const address = this.addressRepository.create(createAddressDto);
    return await this.addressRepository.save(address);
  }

  async findAll() {
    const addresses = await this.addressRepository.find();
    return addresses;
  }

  async findOne(id: number) {
    const address = await this.addressRepository.findOne({ where: { id } });
    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    return await this.addressRepository.update(id, updateAddressDto);
  }

  async remove(id: number) {
    return await this.addressRepository.delete(id);
  }
}
