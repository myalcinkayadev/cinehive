import { Session } from './session.entity';
import { Room } from './value-objects/room';
import { TimeSlot } from './value-objects/time-slot';

describe('Session', () => {
  describe('conflictsWith', () => {
    it('should return true if sessions have the same date, time slot, and room', () => {
      // Arrange
      const session1 = new Session(
        '1',
        'movie',
        new Date('2025-01-18T14:00:00.000Z'),
        new TimeSlot('14:00', '16:00'),
        new Room('Room A'),
      );
      const session2 = new Session(
        '2',
        'movie',
        new Date('2025-01-18T14:00:00.000Z'),
        new TimeSlot('14:00', '16:00'),
        new Room('Room A'),
      );

      // Act
      const result = session1.conflictsWith(session2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false if sessions have different dates', () => {
      // Arrange
      const session1 = new Session(
        '1',
        'movie',
        new Date('2025-01-18T14:00:00.000Z'),
        new TimeSlot('14:00', '16:00'),
        new Room('Room A'),
      );
      const session2 = new Session(
        '2',
        'movie',
        new Date('2025-01-19T14:00:00.000Z'),
        new TimeSlot('14:00', '16:00'),
        new Room('Room A'),
      );

      // Act
      const result = session1.conflictsWith(session2);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false if sessions have different time slots', () => {
      // Arrange
      const session1 = new Session(
        '1',
        'movie',
        new Date('2025-01-18T14:00:00.000Z'),
        new TimeSlot('14:00', '16:00'),
        new Room('Room A'),
      );
      const session2 = new Session(
        '2',
        'movie',
        new Date('2025-01-18T14:00:00.000Z'),
        new TimeSlot('16:00', '18:00'),
        new Room('Room A'),
      );

      // Act
      const result = session1.conflictsWith(session2);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false if sessions have different rooms', () => {
      // Arrange
      const session1 = new Session(
        '1',
        'movie',
        new Date('2025-01-18T14:00:00.000Z'),
        new TimeSlot('14:00', '16:00'),
        new Room('Room A'),
      );
      const session2 = new Session(
        '2',
        'movie',
        new Date('2025-01-18T14:00:00.000Z'),
        new TimeSlot('14:00', '16:00'),
        new Room('Room B'),
      );

      // Act
      const result = session1.conflictsWith(session2);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false if sessions are completely different', () => {
      // Arrange
      const session1 = new Session(
        '1',
        'movie',
        new Date('2025-01-18T14:00:00.000Z'),
        new TimeSlot('14:00', '16:00'),
        new Room('Room A'),
      );
      const session2 = new Session(
        '2',
        'movie',
        new Date('2025-01-19T16:00:00.000Z'),
        new TimeSlot('16:00', '18:00'),
        new Room('Room B'),
      );

      // Act
      const result = session1.conflictsWith(session2);

      // Assert
      expect(result).toBe(false);
    });
  });
});
