import { Room } from './room';

describe('Room', () => {
  describe('constructor', () => {
    it('should create a valid Room when name is provided', () => {
      // Arrange & Act
      const room = new Room('Room A');

      // Assert
      expect(room.valueOf()).toBe('Room A');
    });

    it('should throw an error when the name is empty', () => {
      // Arrange & Act & Assert
      expect(() => new Room('')).toThrow('Room name cannot be empty.');
    });

    it('should throw an error when the name is too long', () => {
      // Arrange
      const longName = 'A'.repeat(501); // 501 characters

      // Act & Assert
      expect(() => new Room(longName)).toThrow(
        'Room name must not exceed 500 characters.',
      );
    });

    it('should trim whitespace from the room name', () => {
      // Arrange & Act
      const room = new Room('  Room B  ');

      // Assert
      expect(room.valueOf()).toBe('Room B');
    });
  });

  describe('equals', () => {
    it('should return true for rooms with the same name (case insensitive)', () => {
      // Arrange
      const room1 = new Room('Room I');
      const room2 = new Room('room i');

      // Act
      const result = room1.equals(room2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for rooms with different names', () => {
      // Arrange
      const room1 = new Room('Room A');
      const room2 = new Room('Room B');

      // Act
      const result = room1.equals(room2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the correct string representation of the room name', () => {
      // Arrange
      const room = new Room('   Room A   ');

      // Act
      const result = room.toString();

      // Assert
      expect(result).toBe('Room A');
    });
  });
});
