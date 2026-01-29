import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ example: 'Notebook Dell', description: 'Nome do produto' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Notebook Dell Inspiron 15', description: 'Descrição do produto' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 'Eletrônicos', description: 'Categoria do produto' })
    @IsString()
    @IsNotEmpty()
    category: string;

    @ApiProperty({ example: 3500.00, description: 'Preço do produto' })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: 10, description: 'Quantidade em estoque' })
    @IsNumber()
    @Min(0)
    quantity: number;
}