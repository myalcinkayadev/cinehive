import { trace } from '@opentelemetry/api';

function isAsyncFunction(fn: Function): boolean {
  return fn.constructor.name === 'AsyncFunction';
}

// TODO: Refactor the function
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

    if (isAsyncFunction(originalMethod)) {
      descriptor.value = async function (...args: unknown[]) {
        return tracer.startActiveSpan(spanName, async (span) => {
          try {
            return await originalMethod.apply(this, args);
          } catch (err) {
            span.recordException(err as Error);
            throw err;
          } finally {
            span.end();
          }
        });
      };
    } else {
      descriptor.value = function (...args: unknown[]) {
        return tracer.startActiveSpan(spanName, (span) => {
          try {
            return originalMethod.apply(this, args);
          } catch (err) {
            span.recordException(err as Error);
            throw err;
          } finally {
            span.end();
          }
        });
      };
    }
  };
}
