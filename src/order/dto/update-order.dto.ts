import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  PENDENTE = 'Pendente',
  CONCLUIDO = 'Concluído',
  CANCELADO = 'Cancelado',
}

export class UpdateOrderDto {
  @ApiProperty({ 
    enum: OrderStatus, 
    description: 'Status do pedido', 
    example: OrderStatus.PENDENTE,
    required: false 
  })
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: 'Status deve ser: Pendente, Concluído ou Cancelado',
  })
  status?: OrderStatus;
}
