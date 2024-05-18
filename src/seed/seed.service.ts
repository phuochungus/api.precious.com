import { Injectable } from '@nestjs/common';
import { StorageService } from '../firebase/storage.service';
import { readFileSync, readdirSync } from 'fs';
import { ProductService } from '../product/product.service';
import { faker } from '@faker-js/faker';
import { CategoryService } from '../category/category.service';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { VariantFactory } from '../variant/variant.factory';
import { VariantService } from '../variant/variant.service';
import { CreateOptionDto } from '../option/dto/create_option.dto';
import { OptionService } from '../option/option.service';
import { TypeService } from '../type/type.service';
import { Type } from '../entities/type.entity';
import { Product } from '../entities/product.entity';
import { Variant } from '../entities/variant.entity';
import * as path from 'path';
import { Role } from 'src/entities/admin.entity';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/entities/user.entity';
import { Option } from 'src/entities/option.entity';

@Injectable()
export class SeedService {
    constructor(
        private readonly storageService: StorageService,
        private readonly productService: ProductService,
        private readonly categoryService: CategoryService,
        private readonly variantFactory: VariantFactory,
        private readonly variantService: VariantService,
        private readonly optionService: OptionService,
        private readonly typeService: TypeService,
        private readonly userService: UserService,
        @InjectDataSource() private readonly dataSource: DataSource,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(Variant) private readonly variantRepository: Repository<Variant>,
    ) { }

    private NUM_OF_PRODUCTS = 30;
    private CATEGORIES = ['Rings', 'Necklaces', 'Bracelets', 'Earrings'];

    private MATERIALS = ['Gold', 'Silver', 'Platinum', 'Titanium'];
    private GEMS = ['Diamond', 'Ruby', 'Sapphire', 'Emerald'];
    private COLORS = ['Red', 'Blue', 'Green', 'Yellow'];
    private SIZES = ['1', '2', '3', '4'];
    private TYPES = ["New Arrive", "Popular"]


    mockMulterFromFile = (filePath: string) => {
        const fileBuffer = readFileSync(filePath);
        const filename = path.basename(filePath);

        return {
            originalname: filename,
            buffer: fileBuffer
        } as Express.Multer.File;
    }


    async reInitAll() {
        await this.deleteAllFilesInBucket();
        await this.dataSource.synchronize(true);

    }

    async createRandomOptions(product_id: number) {
        const options = [{
            product_id,
            name: 'Material',
            values: this.MATERIALS.map(material => ({ value: material })),
        }, {
            product_id,
            name: 'Gem',
            values: this.GEMS.map(gem => ({ value: gem }))
        }, {
            product_id,
            name: 'Color',
            values: this.COLORS.map(color => ({ value: color }))
        }, {
            product_id,
            name: 'Size',
            values: this.SIZES.map(size => ({ value: size }))
        }];
        for (let i = 0; i < options.length; i++) {
            options[i] = { ...options[i] };
            options[i].product_id = product_id;
            for (let j = 0; j < options[i].values.length; j++) {
                options[i].values[j] = { ...options[i].values[j] };
            }
            options[i].values = faker.helpers.shuffle(options[i].values);
            options[i].values = faker.helpers.arrayElements(options[i].values, { min: 2, max: options[i].values.length });
        }

        return faker.helpers.arrayElements(options, { min: 1, max: options.length });
    }

    async startV1() {
        await this.createAdmin();
        console.log('===Starting seed v1');
        const ringImgs = readdirSync(path.join(process.cwd(), 'src/seed/images/rings')).map(file => this.mockMulterFromFile(path.join(process.cwd(), 'src/seed/images/rings', file)));

        const Rings = await this.categoryService.create({
            name: ' Rings'
        })

        let Types: Type[] = []
        for (let name of this.TYPES) {
            Types.push(await this.typeService.create({ name }))
        }

        for (let i = 0; i < this.NUM_OF_PRODUCTS; i++) {
            console.log('===Creating product', i);
            // Create product
            let product = await this.productService.create({
                name: faker.lorem.word(),
                category_id: Rings,
                short_description: faker.lorem.sentence({ min: 2, max: 3 }),
                rating: faker.number.float({ min: 3, max: 5, multipleOf: 0.5 }),
                description: faker.lorem.sentence({ min: 5, max: 10 }),
            }, faker.helpers.arrayElements(ringImgs, { min: 2, max: 5 }));
            let options = await this.createRandomOptions(product.id);
            for (let option of options) {
                console.log('===Creating option', option);
                let savedOption = await this.dataSource.getRepository(Option).save(option);
                console.log('===Saved option', savedOption);
            }

            let variants = await this.variantFactory.createVariants(product.id);
            product.types = faker.helpers.arrayElements(Types, { min: 1, max: Types.length });

            for (let variant of variants) {
                variant = await this.variantService.uploadImage(variant.id, faker.helpers.arrayElements(ringImgs, { min: 1, max: 3 }));
                variant.price = faker.number.int({ min: 1, max: 490 }) * 100000;
                variant.quantity = 10000;
                if (!product.price || product.price == 0) product.price = variant.price;
                await this.variantRepository.save(variant);
            }
            await this.productRepository.update({ id: product.id }, { price: product.price })
            console.log('===Product created', i);
        }
    }

    private async createAdmin() {
        return await this.userService.create({ uid: 'uMtcOEqJF2YASucnOqDGCbdc7sP2', userRole: UserRole.ADMIN });
    }

    async deleteAllFilesInBucket() {
        const bucket = this.storageService.firebaseService.getStorage().bucket();

        try {
            const [files] = await bucket.getFiles();
            const deletePromises = files.map(file => file.delete());
            await Promise.all(deletePromises);
            console.log('All files in the bucket have been deleted.');
        } catch (error) {
            console.error('Failed to delete files:', error);
        }
    }


}
