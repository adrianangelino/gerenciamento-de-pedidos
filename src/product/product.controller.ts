import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create-product')
  async createProduct(@Body() dto: CreateProductDto): Promise<Product> {
    return await this.productService.createProduct(dto);
  }

  @Get('/get-all-products')
  async getAllProducts(): Promise <Product[]> {
    return await this.productService.getAllProducts();
  }

  @Get('/by-name/:name')
  async getProductByName(@Param('name') name: string): Promise<Product[]> {
    return await this.productService.getProductByName(name);
  }

  @Patch('/update-Product-By-Id/:id')
  async updateProductById(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return await this.productService.updateProductById(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
