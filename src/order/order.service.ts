import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDto) {
    const { items, status } = dto;

    const productIds = items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        deletedAt: null,
      },
    });

    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p.id);
      const missingIds = productIds.filter((id) => !foundIds.includes(id));

      const deletedProducts = await this.prisma.product.findMany({
        where: {
          id: { in: missingIds },
          deletedAt: { not: null },
        },
      });

      if (deletedProducts.length > 0) {
        throw new BadRequestException(
          `Os seguintes produtos foram deletados e não podem ser adicionados ao pedido: ${deletedProducts.map((p) => p.name).join(', ')}`,
        );
      }

      throw new NotFoundException(
        `Produtos não encontrados: ${missingIds.join(', ')}`,
      );
    }

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new NotFoundException(
          `Produto #${item.productId} não encontrado`,
        );
      }
      if (product.quantity < item.quantity) {
        throw new BadRequestException(
          `Produto "${product.name}" não possui quantidade suficiente. Disponível: ${product.quantity}, Solicitado: ${item.quantity}`,
        );
      }
    }

    let totalPedido = 0;
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new NotFoundException(
          `Produto #${item.productId} não encontrado`,
        );
      }
      totalPedido += product.price * item.quantity;
    }

    const order = await this.prisma.order.create({
      data: {
        total_pedido: totalPedido,
        status: status || 'Pendente',
        item: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        item: {
          include: {
            produto: true,
          },
        },
      },
    });

    for (const item of items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    return order;
  }

  async getAllOrders() {
    return await this.prisma.order.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        item: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  async getOrderById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        item: {
          include: {
            produto: true,
          },
        },
      },
    });

    if (!order || order.deletedAt) {
      throw new NotFoundException(`Pedido #${id} não encontrado`);
    }

    return order;
  }

  async updateOrderById(id: number, updateOrderDto: UpdateOrderDto) {
    await this.getOrderById(id);

    return this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderDto.status,
      },
      include: {
        item: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  async softDeletedOrder(id: number) {
    await this.getOrderById(id);
    return await this.prisma.order.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
