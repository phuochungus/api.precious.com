import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StorageService } from '../firebase/storage.service';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    private readonly storageService: StorageService
  ) { }


  async create(createProductDto: CreateProductDto, files: Express.Multer.File[]) {
    if (!files || files.length == 0) {
      return await this.productsRepository.save(createProductDto);
    }
    let product = await this.productsRepository.save({ ...createProductDto });
    const img_paths = await Promise.all(files.map(async file => {
      let img_path = await this.storageService.uploadFile({ file, key: `/product/${product.id}/${file.originalname}` });
      return img_path;
    }));
    product.img_paths = img_paths;
    return await this.productsRepository.save(product);

  }

  async findAll(type?: number) {
    return await this.productsRepository.find({
      order: { id: 'DESC' },
      ...(type && { relations: ['types'] }),
      ...(type && { where: { types: { id: type } } })
    });
  }

  async findWithPagination(start: number, limit: number, type?: number) {
    return await this.productsRepository.find({
      order: { id: 'DESC' },
      skip: start,
      take: limit,
      ...(type && { relations: ['types'] }),
      ...(type && { where: { types: { id: type } } })
    });
  }

  async findOne(id: number) {
    return await this.productsRepository.findOne({
      where: { id },
      relations: ['variants', 'variants.variant_option_values', 'options', 'options.values'],
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    let product = this.productsRepository.findOneBy({ id });
    return await this.productsRepository.save({ ...product, ...updateProductDto });
  }

  remove(id: number) {
    return this.productsRepository.softDelete({ id });
  }
}
