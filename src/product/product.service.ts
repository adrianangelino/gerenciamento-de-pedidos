import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: dto,
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.prisma.product.findMany({});
  }

  async getProductByName(name: string): Promise<Product[]> {
    return await this.prisma.product.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
  }

  async updateProductById(id: number, dto: UpdateProductDto) {
    return await this.prisma.product.update({
      where:{ id },
        data: dto 
    });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
