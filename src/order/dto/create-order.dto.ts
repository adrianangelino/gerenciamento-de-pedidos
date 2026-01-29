import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 1, description: 'ID do produto' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantidade do produto' })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ 
    type: [OrderItemDto], 
    description: 'Lista de itens do pedido',
    example: [{ productId: 1, quantity: 2 }, { productId: 2, quantity: 1 }]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'Pendente', description: 'Status do pedido', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}
