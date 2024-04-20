import { Module } from '@nestjs/common';
import { VariantOptionValueService } from './variant-option-value.service';
import { VariantOptionValueController } from './variant-option-value.controller';

@Module({
  controllers: [VariantOptionValueController],
  providers: [VariantOptionValueService],
})
export class VariantOptionValueModule {}
