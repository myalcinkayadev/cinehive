import { ValueObject } from '../../../shared/domain/value-object';

export class AgeRestriction implements ValueObject {
  constructor(private readonly restriction: number) {
    if (restriction < 0)
      throw new Error('Age restriction must be greater or equal to zero.');
  }

  isAllowedForAge(age: number): boolean {
    return age >= this.restriction;
  }

  equals(other: AgeRestriction): boolean {
    return this.restriction === other.restriction;
  }

  valueOf(): number {
    return this.restriction;
  }

  toString(): string {
    return this.restriction.toString();
  }
}
