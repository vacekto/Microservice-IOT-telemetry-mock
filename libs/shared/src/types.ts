export type TelemetryPayload = {
  //     deviceId (UUID),
  // timestamp (current time),
  // temperature (random number within a realistic range, e.g., 20-30°C),
  // humidity (random number within a realistic range, e.g., 30-60%)

  deviceId: string;
  timestamp: number;
  temperature: number;
  humidity: number;
};
