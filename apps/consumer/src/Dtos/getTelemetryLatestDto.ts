import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class GetTelemetryLatestDto {
  @IsNotEmpty()
  @IsUUID()
  deviceId: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  count?: number;
}
