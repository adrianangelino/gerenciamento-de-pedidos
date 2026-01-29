import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create-product')
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async createProduct(@Body() dto: CreateProductDto): Promise<Product> {
    return await this.productService.createProduct(dto);
  }

  @Get('/get-all-products')
  @ApiOperation({ summary: 'Buscar todos os produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso' })
  async getAllProducts(): Promise <Product[]> {
    return await this.productService.getAllProducts();
  }

  @Get('/by-name/:name')
  @ApiOperation({ summary: 'Buscar produtos por nome' })
  @ApiParam({ name: 'name', description: 'Nome do produto', example: 'Notebook' })
  @ApiResponse({ status: 200, description: 'Produtos encontrados' })
  async getProductByName(@Param('name') name: string): Promise<Product[]> {
    return await this.productService.getProductByName(name);
  }

  @Patch('/update-Product-By-Id/:id')
  @ApiOperation({ summary: 'Atualizar produto por ID' })
  @ApiParam({ name: 'id', description: 'ID do produto', example: 1 })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async updateProductById(@Param('id') id: string, @Body() dto: UpdateProductDto): Promise<Product> {
    return await this.productService.updateProductById(+id, dto);
  }

  @Delete('/soft-Deleted-Product/:id')
  @ApiOperation({ summary: 'Excluir produto (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID do produto', example: 1 })
  @ApiResponse({ status: 200, description: 'Produto excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async softDeletedProduct(@Param('id') id: string): Promise<Product> {
    return await this.productService.softDeletedProduct(+id);
  }
}
