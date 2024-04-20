import { Controller } from '@nestjs/common';
import { VariantOptionValueService } from './variant-option-value.service';

@Controller('variant-option-value')
export class VariantOptionValueController {
  constructor(private readonly variantOptionValueService: VariantOptionValueService) {}
}
