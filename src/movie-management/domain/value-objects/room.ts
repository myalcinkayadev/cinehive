import { ValueObject } from '../../../shared/domain/value-object';

export class Room implements ValueObject {
  private readonly name: string;

  constructor(name: string) {
    if (!name || name.trim() === '') {
      throw new Error('Room name cannot be empty.');
    }

    if (name.length > 500) {
      throw new Error('Room name must not exceed 500 characters.');
    }

    this.name = name.trim();
  }

  equals(other: Room): boolean {
    return this.name.toLowerCase() === other.name.toLowerCase();
  }

  valueOf(): string {
    return this.name;
  }

  toString(): string {
    return this.valueOf();
  }
}
