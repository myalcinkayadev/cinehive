import { registerAs } from '@nestjs/config';

export interface TelemetryConfig {
  endpoint: string;
  serviceName: string;
}

export default registerAs(
  'telemetry',
  (): TelemetryConfig => ({
    endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    serviceName: process.env.OTEL_SERVICE_NAME,
  }),
);
