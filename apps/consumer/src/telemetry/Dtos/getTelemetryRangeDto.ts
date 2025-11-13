import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Start timestamp for telemetry range (ISO 8601 format)',
    example: '2025-11-01T00:00:00Z',
  })
  @IsNotEmpty()
  @IsISO8601()
  from: string;

  @ApiProperty({
    description: 'End timestamp for telemetry range (ISO 8601 format)',
    example: '2025-11-01T23:59:59Z',
  })
  @IsNotEmpty()
  @IsISO8601()
  to: string;

  @ApiProperty({
    description: 'Device ID to fetch telemetry for',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  deviceId: string;

  @ApiProperty({
    description: 'Maximum number of telemetry entries to return (optional)',
    required: false,
    default: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  count?: number;
}
