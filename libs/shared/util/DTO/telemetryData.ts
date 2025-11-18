import { ApiProperty } from '@nestjs/swagger';

export class TelemetryDataDTO {
  @ApiProperty({ description: 'Device ID' })
  deviceId: string;

  @ApiProperty({ description: 'Timestamp of measurement' })
  timestamp: number;

  @ApiProperty({ description: 'Temperature in °C' })
  temperature: number;

  @ApiProperty({ description: 'Humidity in %' })
  humidity: number;
}
