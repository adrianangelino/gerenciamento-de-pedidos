import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '@prisma/client';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create-Order')
  @ApiOperation({ summary: 'Criar um novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async createOrder(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(dto);
  }

  @Get('/get-All-Orders')
  @ApiOperation({ summary: 'Buscar todos os pedidos' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos retornada com sucesso' })
  async getAllOrders(): Promise<Order[]> {
    return await this.orderService.getAllOrders();
  }

  @Get('/get-Order-By-Id/:id')
  @ApiOperation({ summary: 'Buscar pedido por ID' })
  @ApiParam({ name: 'id', description: 'ID do pedido', example: 1 })
  @ApiResponse({ status: 200, description: 'Pedido encontrado' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async getOrderById(@Param('id') id: string): Promise<Order> {
    return await this.orderService.getOrderById(+id);
  }

  @Patch('/update-Order-By-Id/:id')
  @ApiOperation({ summary: 'Atualizar pedido por ID' })
  @ApiParam({ name: 'id', description: 'ID do pedido', example: 1 })
  @ApiResponse({ status: 200, description: 'Pedido atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async updateOrderById(@Param('id') id: string, @Body() dto: UpdateOrderDto): Promise<Order> {
    return this.orderService.updateOrderById(+id, dto);
  }

  @Delete('/soft-Deleted-Order/:id')
  @ApiOperation({ summary: 'Excluir pedido (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID do pedido', example: 1 })
  @ApiResponse({ status: 200, description: 'Pedido excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async softDeletedOrder(@Param('id') id: string): Promise<Order> {
    return await this.orderService.softDeletedOrder(+id);
  }
}
