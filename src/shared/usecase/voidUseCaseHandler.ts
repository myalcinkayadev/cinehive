import { UseCase } from './use-case';

export interface VoidUseCaseHandler<C extends UseCase> {
  execute(useCase: C): Promise<void>;
}
