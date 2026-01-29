import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [PrismaModule, ProductModule, OrderModule],
})
export class AppModule {}
