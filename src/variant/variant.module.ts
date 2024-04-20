import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { VariantController } from './variant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { FirebaseModule } from '../firebase/firebase.module';
import { Product } from '../product/entities/product.entity';
import { VariantFactory } from './variant.factory';
import { VariantOptionValue } from '../variant-option-value/entity/variant_option_value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Variant, Product, VariantOptionValue]), FirebaseModule],
  controllers: [VariantController],
  providers: [VariantService, VariantFactory],
  exports: [VariantService, VariantFactory]
})
export class VariantModule { }
