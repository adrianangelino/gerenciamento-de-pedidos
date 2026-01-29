import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '@prisma/client';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create-Order')
  async createOrder(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(dto);
  }

  @Get('/get-All-Orders')
  async getAllOrders(): Promise<Order[]> {
    return await this.orderService.getAllOrders();
  }

  @Get('/get-Order-By-Id/:id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    return await this.orderService.getOrderById(+id);
  }

  @Patch('/update-Order-By-Id/:id')
  async updateOrderById(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.orderService.updateOrderById(+id, updateOrderDto);
  }

  @Delete('/soft-Deleted-Order/:id')
  async softDeletedOrder(@Param('id') id: string): Promise<Order> {
    return await this.orderService.softDeletedOrder(+id);
  }
}
