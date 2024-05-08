import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { Admin } from 'src/entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    ) { }

    async create(createAdminDto: CreateAdminDto) {
        return await this.adminRepository.save(createAdminDto);
    }
}
