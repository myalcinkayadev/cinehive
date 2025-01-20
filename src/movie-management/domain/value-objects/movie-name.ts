export class MovieName {
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

  valueOf(): string {
    return this.name;
  }
}
