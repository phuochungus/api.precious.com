import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { VariantController } from './variant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from '../entities/variant.entity';
import { FirebaseModule } from '../firebase/firebase.module';
import { Product } from '../entities/product.entity';
import { VariantFactory } from './variant.factory';
import { VariantOptionValue } from '../entities/variant_option_value.entity';
import { ProductModule } from 'src/product/product.module';
import { SameAttributeVariant } from 'src/entities/same_attribute_variant';

@Module({
  imports: [TypeOrmModule.forFeature([Variant, Product, VariantOptionValue]), FirebaseModule, ProductModule],
  controllers: [VariantController],
  providers: [VariantService, {
    provide: VariantFactory,
    useClass: SameAttributeVariant,
  }],
  exports: [VariantService, VariantFactory]
})
export class VariantModule { }
