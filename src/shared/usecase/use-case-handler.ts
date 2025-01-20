import { UseCase } from './use-case';

export interface UseCaseHandler<C extends UseCase, R> {
  execute(useCase: C): Promise<R>;
}
