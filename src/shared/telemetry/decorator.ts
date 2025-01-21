import { Span, trace, Tracer } from '@opentelemetry/api';

function isAsyncFunction(fn: (...args: any[]) => any): boolean {
  return fn.constructor.name === 'AsyncFunction';
}

type DescriptorExecutionContext = {
  tracer: Tracer;
  spanName: string;
  originalMethod: (...args: unknown[]) => unknown;
  descriptorContext: any;
  descriptorArgs: unknown[];
};

export function Traceable(customSpanName?: string) {
  return function (
    target: Object,
    methodName: string,
    descriptor: PropertyDescriptor,
  ): void {
    const className = target.constructor.name;
    const originalMethod = descriptor.value!;
    const spanName = customSpanName ?? `${className}.${methodName}`;
    const tracer = trace.getTracer('cinehive');

    descriptor.value = function (...args: unknown[]) {
      const context: DescriptorExecutionContext = {
        tracer,
        spanName,
        originalMethod,
        descriptorContext: this,
        descriptorArgs: args,
      };

      return isAsyncFunction(originalMethod)
        ? asyncExecute(context)
        : syncExecute(context);
    };
  };
}

function asyncExecute({
  tracer,
  spanName,
  originalMethod,
  descriptorContext,
  descriptorArgs,
}: DescriptorExecutionContext): Promise<unknown> {
  return tracer.startActiveSpan(spanName, async (span: Span) => {
    try {
      return await originalMethod.apply(descriptorContext, descriptorArgs);
    } catch (err) {
      handleSpanError(span, err);
      throw err;
    } finally {
      span.end();
    }
  });
}

function syncExecute({
  tracer,
  spanName,
  originalMethod,
  descriptorContext,
  descriptorArgs,
}: DescriptorExecutionContext): unknown {
  return tracer.startActiveSpan(spanName, (span: Span) => {
    try {
      return originalMethod.apply(descriptorContext, descriptorArgs);
    } catch (err) {
      handleSpanError(span, err);
      throw err;
    } finally {
      span.end();
    }
  });
}

function handleSpanError(span: Span, err: unknown): void {
  if (err instanceof Error) {
    span.recordException(err);
  } else {
    span.recordException(new Error(String(err)));
  }
}
