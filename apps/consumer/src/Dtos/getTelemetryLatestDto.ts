import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class GetTelemetryLatestDto {
  @ApiProperty({
    description: 'Device ID to fetch telemetry for',
    example: 'bd5b41ef-fa8f-47b8-b62e-326dcaba7a44',
  })
  @IsNotEmpty()
  @IsUUID()
  deviceId: string;

  @ApiProperty({
    description: 'Number of latest telemetry entries to return',
    required: false,
    default: 30,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  count?: number;
}
