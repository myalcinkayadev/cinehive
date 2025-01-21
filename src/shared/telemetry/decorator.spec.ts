import { Span, trace } from '@opentelemetry/api';
import { Traceable } from './decorator';

describe('Traceable Decorator', () => {
  let mockTracer: jest.Mocked<typeof trace>;
  let mockSpan: jest.Mocked<Span>;
  let startActiveSpanMock: jest.Mock;

  beforeEach(() => {
    mockSpan = {
      end: jest.fn(),
      recordException: jest.fn(),
    } as unknown as jest.Mocked<Span>;

    startActiveSpanMock = jest.fn((name, fn) => fn(mockSpan));

    mockTracer = {
      getTracer: jest.fn(() => ({
        startActiveSpan: startActiveSpanMock,
      })),
    } as unknown as jest.Mocked<typeof trace>;

    jest.spyOn(trace, 'getTracer').mockImplementation(mockTracer.getTracer);
  });

  it('should execute synchronous methods and end span', () => {
    class TestClass {
      @Traceable('syncSpan')
      syncMethod(arg: string): string {
        return `Hello, Sync ${arg}`;
      }
    }

    const instance = new TestClass();
    const result = instance.syncMethod('World');

    expect(result).toBe('Hello, Sync World');
    expect(startActiveSpanMock).toHaveBeenCalledWith(
      'syncSpan',
      expect.any(Function),
    );
    expect(mockSpan.end).toHaveBeenCalledTimes(1);
    expect(mockSpan.recordException).not.toHaveBeenCalled();
  });

  it('should execute asynchronous methods and end span', async () => {
    class TestClass {
      @Traceable('asyncSpan')
      async asyncMethod(arg: string): Promise<string> {
        return `Hello, Async ${arg}`;
      }
    }

    const instance = new TestClass();
    const result = await instance.asyncMethod('World');

    expect(result).toBe('Hello, Async World');
    expect(startActiveSpanMock).toHaveBeenCalledWith(
      'asyncSpan',
      expect.any(Function),
    );
    expect(mockSpan.end).toHaveBeenCalledTimes(1);
    expect(mockSpan.recordException).not.toHaveBeenCalled();
  });

  it('should handle errors in synchronous methods', () => {
    class TestClass {
      @Traceable('customSpan1')
      syncMethod(): never {
        throw new Error('Sync Error');
      }
    }

    const instance = new TestClass();

    expect(() => instance.syncMethod()).toThrow('Sync Error');
    expect(startActiveSpanMock).toHaveBeenCalledWith(
      'customSpan1',
      expect.any(Function),
    );
    expect(mockSpan.end).toHaveBeenCalledTimes(1);
    expect(mockSpan.recordException).toHaveBeenCalledWith(
      new Error('Sync Error'),
    );
  });

  it('should handle errors in asynchronous methods', async () => {
    class TestClass {
      @Traceable('customSpan2')
      async asyncMethod(): Promise<never> {
        throw new Error('Async Error');
      }
    }

    const instance = new TestClass();

    await expect(instance.asyncMethod()).rejects.toThrow('Async Error');
    expect(startActiveSpanMock).toHaveBeenCalledWith(
      'customSpan2',
      expect.any(Function),
    );
    expect(mockSpan.end).toHaveBeenCalledTimes(1);
    expect(mockSpan.recordException).toHaveBeenCalledWith(
      new Error('Async Error'),
    );
  });
});
