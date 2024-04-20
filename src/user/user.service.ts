import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async findByUid(uid: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { uid } });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }


  async delete(id: string) {
    return await this.userRepository.delete(id);
  }
}
