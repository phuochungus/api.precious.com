import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, NotFoundException } from '@nestjs/common';
import { VariantService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { ApiBody, ApiConsumes, ApiExtraModels, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from 'src/product/product.service';

@ApiTags('Variant')
@Controller('variant')
export class VariantController {
  constructor(
    private readonly variantService: VariantService,
    private readonly productService: ProductService) { }

  // @ApiConsumes('multipart/form-data')
  // @ApiExtraModels(CreateVariantDto)
  // @ApiBody({
  //   schema: {
  //     allOf: [
  //       { $ref: getSchemaPath(CreateVariantDto) },
  //       {
  //         type: 'object',
  //         properties: {
  //           "img[]": {
  //             type: 'array',
  //             items: {
  //               type: 'string',
  //               format: 'binary',
  //             },
  //           },
  //         },
  //       },
  //     ]
  //   }
  // })
  // @Post()
  // @UseInterceptors(FilesInterceptor('img[]'))
  // create(@UploadedFiles() files: any, @Body() createVariantDto: CreateVariantDto) {
  //   return this.variantService.create(createVariantDto, files);
  // }

  @Post('create_variants_for_product/:id')
  async createVariantsForProduct(@Param('id') id: number) {
    await this.variantService.createVariantsForProduct(id);
    return await this.productService.findOne(id);
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

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateVariantDto)
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(UpdateVariantDto) },
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
  @UseInterceptors(FilesInterceptor('img[]'))
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateVariantDto: UpdateVariantDto, @UploadedFiles() files: any) {
    return this.variantService.update(id, updateVariantDto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.variantService.remove(id);
  }
}
