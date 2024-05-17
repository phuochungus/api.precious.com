import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';
import { VariantModule } from '../variant/variant.module';
import { OptionModule } from '../option/option.module';
import { TypeModule } from '../type/type.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Variant } from '../entities/variant.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    FirebaseModule,
    ProductModule,
    CategoryModule,
    VariantModule,
    OptionModule,
    TypeModule,
    TypeOrmModule.forFeature([Product, Variant]),
    UserModule
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule { }
