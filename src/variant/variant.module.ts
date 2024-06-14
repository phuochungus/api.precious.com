import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { VariantController } from './variant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from '../entities/variant.entity';
import { FirebaseModule } from '../firebase/firebase.module';
import { Product } from '../entities/product.entity';
import { SameAttributeVariantFactory, VariantFactory } from './variant.factory';
import { VariantOptionValue } from '../entities/variant_option_value.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Variant, Product, VariantOptionValue]), FirebaseModule, ProductModule],
  controllers: [VariantController],
  providers: [VariantService, {
    provide: VariantFactory,
    useClass: SameAttributeVariantFactory,
  }],
  exports: [VariantService, VariantFactory]
})
export class VariantModule { }
