import { Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import telemetryConfig, { TelemetryConfig } from '../config/telemetry.config';

@Module({})
export class TelemetryModule implements OnModuleInit {
  private sdk: NodeSDK;

  private readonly logger = new Logger(TelemetryModule.name, {
    timestamp: true,
  });

  constructor(
    @Inject(telemetryConfig.KEY)
    private config: TelemetryConfig,
  ) {}

  async onModuleInit() {
    const traceExporter = new OTLPTraceExporter({ url: this.config.endpoint });
    const metricExporter = new OTLPMetricExporter({
      url: this.config.endpoint,
    });

    this.sdk = new NodeSDK({
      serviceName: this.config.serviceName,
      traceExporter,
      metricReader: new PeriodicExportingMetricReader({
        exporter: metricExporter,
      }),
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-express': { enabled: true },
          '@opentelemetry/instrumentation-http': { enabled: true },
          '@opentelemetry/instrumentation-net': { enabled: false },
          '@opentelemetry/instrumentation-dns': { enabled: false },
        }),
      ],
    });

    this.sdk.start();
    this.logger.log('OpenTelemetry initialized');
  }

  async onModuleDestroy() {
    await this.sdk.shutdown();
  }
}
