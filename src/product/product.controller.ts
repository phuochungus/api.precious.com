import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiConsumes, ApiExtraModels, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PaginateDto } from './dto/page.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateProductDto)
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CreateProductDto) },
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
  create(@UploadedFiles() files: any, @Body() createProductDto: CreateProductDto) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }
    return this.productService.create(createProductDto, files);
  }

  @Get()
  async findAll(@Query() { start, quantity, type, categoryId }: PaginateDto) {
    if (start && quantity) {
      return await this.productService.findWithPagination(start, quantity, type, categoryId);
    }
    return await this.productService.findAll(type, categoryId);
  }

  @Post('calculate_quantity')
  calculateQuantity() {
    return this.productService.calculateQuantity();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
