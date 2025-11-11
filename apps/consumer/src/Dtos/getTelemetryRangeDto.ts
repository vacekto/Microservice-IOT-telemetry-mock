import { Type } from 'class-transformer';
import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class GetTelemetryRamgeDto {
  @IsNotEmpty()
  @IsISO8601()
  from: string;

  @IsNotEmpty()
  @IsISO8601()
  to: string;

  @IsNotEmpty()
  @IsUUID()
  deviceId: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  count?: number;
}
