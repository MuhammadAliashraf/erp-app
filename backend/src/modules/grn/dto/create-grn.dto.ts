import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGrnItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  receivedQuantity: number;

  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}

export class CreateGrnDto {
  @IsNotEmpty()
  @IsNumber()
  purchaseOrderId: number;

  @IsNotEmpty()
  @IsNumber()
  supplierId: number;

  @IsNotEmpty()
  @IsDateString()
  receivedDate: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGrnItemDto)
  items: CreateGrnItemDto[];
}
