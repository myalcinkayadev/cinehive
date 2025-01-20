export class Room {
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

  toString(): string {
    return this.name;
  }
}
