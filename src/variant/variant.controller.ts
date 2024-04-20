import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, ClassSerializerInterceptor, NotFoundException } from '@nestjs/common';
import { VariantService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { ApiBody, ApiConsumes, ApiExtraModels, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Variant')
@Controller('variant')
@UseInterceptors(ClassSerializerInterceptor)
export class VariantController {
  constructor(private readonly variantService: VariantService) { }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateVariantDto)
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CreateVariantDto) },
        {
          type: 'object',
          properties: {
            "img[]": {
              type: 'array',
              items: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      ]
    }
  })
  @Post()
  @UseInterceptors(FilesInterceptor('img[]'))
  create(@UploadedFiles() files: any, @Body() createVariantDto: CreateVariantDto) {
    return this.variantService.create(createVariantDto, files);
  }

  @Post('create_variants_for_product/:id')
  async createVariantsForProduct(@Param('id') id: string) {
    return await this.variantService.createVariantsForProduct(+id);
  }

  @Get()
  async findAll() {
    return await this.variantService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let variant = await this.variantService.findOne(+id);
    if (!variant) throw new NotFoundException('Variant not found');
    return variant;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
    return this.variantService.update(+id, updateVariantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variantService.remove(+id);
  }
}
