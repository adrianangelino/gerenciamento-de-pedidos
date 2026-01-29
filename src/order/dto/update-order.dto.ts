import { IsOptional, IsEnum } from 'class-validator';

export enum OrderStatus {
  PENDENTE = 'Pendente',
  CONCLUIDO = 'Concluído',
  CANCELADO = 'Cancelado',
}

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: 'Status deve ser: Pendente, Concluído ou Cancelado',
  })
  status?: OrderStatus;
}
