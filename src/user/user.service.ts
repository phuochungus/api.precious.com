import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from 'src/user/dto/update-user-dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByUid(uid: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { uid } });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['addresses'] });
  }


  async delete(id: number) {
    return await this.userRepository.delete(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOne({ where: { id } });
  }
}
