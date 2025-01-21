import { ValueObject } from '../../../shared/domain/value-object';

export class MovieName implements ValueObject {
  private readonly name: string;

  constructor(name: string) {
    if (!name || name.trim() === '') {
      throw new Error('Movie name cannot be empty.');
    }

    if (name.length > 500) {
      throw new Error('Movie name must not exceed 500 characters.');
    }

    this.name = name.trim();
  }

  equals(other: MovieName): boolean {
    return this.name === other.name;
  }

  valueOf(): string {
    return this.name;
  }
}
