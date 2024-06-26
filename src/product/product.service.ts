import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StorageService } from '../firebase/storage.service';
import { Product } from '../entities/product.entity';
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

  async findAll(type?: number, categoryId?: number) {
    return await this.productsRepository.find({
      order: { id: 'DESC' },
      relations: ['types', 'options'],
      ...(type && { where: { types: { id: type } } }),
      ...(categoryId && { where: { category: { id: categoryId } } })
    });
  }


  async findWithPagination(start: number, limit: number, typeId?: number, categoryId?: number) {
    return await this.productsRepository.find({
      order: { id: 'DESC' },
      skip: start,
      take: limit,
      relations: ['types', 'options'],
      ...(typeId && { where: { types: { id: typeId } } }),
      ...(categoryId && { where: { category: { id: categoryId } } })
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

  async remove(id: number) {
    const product = await this.productsRepository.findOne({ where: { id }, relations: ['variants'], withDeleted: true });
    return await this.productsRepository.softRemove(product);
  }

  async calculateQuantity() {
    const products = await this.productsRepository.find({ relations: ['variants'] });
    for (const product of products) {
      product.quantity = product.variants.reduce((acc, variant) => acc + variant.quantity, 0);
    }
    await this.productsRepository.save(products);
  }
}
