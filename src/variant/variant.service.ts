import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Variant } from '../entities/variant.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageService } from '../firebase/storage.service';
import { VariantFactory } from './variant.factory';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant) private variantsRepository: Repository<Variant>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly storageService: StorageService,
    private readonly variantFactory: VariantFactory
  ) { }

  async create(createVariantDto: CreateVariantDto, files?: Express.Multer.File[]) {
    if (!files || files.length == 0) {
      let { id } = await this.variantsRepository.save(createVariantDto);
      return id;
    }
    let variant = await this.variantsRepository.save({ ...createVariantDto });
    const img_paths = await Promise.all(files.map(async file => {
      let img_path = await this.storageService.uploadFile({ file, key: `/variant/${variant.id}/${file.originalname}` });
      return img_path;
    }));
    variant.img_paths = img_paths;
    let { id } = await this.variantsRepository.save(variant);
    return id;
  }

  async createVariantsForProduct(product_id: number) {
    const product = await this.productRepository.findOne({ where: { id: product_id }, relations: ['variants'] });
    await this.variantsRepository.softRemove(product)
    return this.variantFactory.createVariants(product_id);
  }

  async uploadImage(id: number, file: Express.Multer.File[]) {
    let variant = await this.variantsRepository.findOne({ where: { id } });
    if (!variant) {
      throw new NotFoundException(`Variant with id ${id} not found`);
    }

    const img_paths = await Promise.all(file.map(async file => {
      let img_path = await this.storageService.uploadFile({ file, key: `/variant/${variant.id}/${file.originalname}` });
      return img_path;
    }))
    variant.img_paths = img_paths;
    return await this.variantsRepository.save(variant);

  }

  async findAll() {
    return await this.variantsRepository.find({ relations: ['variant_option_values'] });
  }

  async findOne(id: number) {
    return await this.variantsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateVariantDto: UpdateVariantDto, files?: Express.Multer.File[]) {
    // return await this.variantsRepository.update(id, updateVariantDto);
    let variant = await this.variantsRepository.findOne({ where: { id } });

    const img_paths = await Promise.all(files.map(async file => {
      let img_path = await this.storageService.uploadFile({ file, key: `/variant/${variant.id}/${file.originalname}` });
      return img_path;
    }));
    if (updateVariantDto.quantity) {
      const product = await this.productRepository.findOne({ where: { id: variant.product_id } });
      if (product) {
        product.quantity += updateVariantDto.quantity - variant.quantity;
        await this.productRepository.save(product);
      }
    }
    variant.img_paths = img_paths;
    variant = { ...variant, ...updateVariantDto } as Variant;
    await this.variantsRepository.save(variant)
    return await this.variantsRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.variantsRepository.softDelete(id);

  }
}
