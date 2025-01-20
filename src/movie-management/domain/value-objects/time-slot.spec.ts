import { TimeSlot } from './time-slot';

describe('TimeSlot', () => {
  describe('constructor', () => {
    it('should create a valid TimeSlot when startTime is before endTime', () => {
      // Arrange & Act
      const timeSlot = new TimeSlot('14:00', '16:00');

      // Assert
      expect(timeSlot.toString()).toBe('14:00-16:00');
    });

    it('should throw an error when startTime is after endTime', () => {
      // Arrange & Act & Assert
      expect(() => new TimeSlot('16:00', '14:00')).toThrow(
        'Start time must be earlier than end time.',
      );
    });

    it('should throw an error when startTime and endTime are equal', () => {
      // Arrange & Act & Assert
      expect(() => new TimeSlot('14:00', '14:00')).toThrow(
        'Start time must be earlier than end time.',
      );
    });

    it('should throw an error when startTime is not in valid format', () => {
      // Arrange & Act & Assert
      expect(() => new TimeSlot('invalid', '16:00')).toThrow(
        'Invalid start time format. Use HH:mm.',
      );
    });

    it('should throw an error when endTime is not in valid format', () => {
      // Arrange & Act & Assert
      expect(() => new TimeSlot('14:00', 'invalid')).toThrow(
        'Invalid end time format. Use HH:mm.',
      );
    });
  });

  describe('conflictsWith', () => {
    it('should return true when two time slots are identical', () => {
      // Arrange
      const timeSlot1 = new TimeSlot('14:00', '16:00');
      const timeSlot2 = new TimeSlot('14:00', '16:00');

      // Act
      const result = timeSlot1.conflictsWith(timeSlot2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when two time slots partially overlap', () => {
      // Arrange
      const timeSlot1 = new TimeSlot('14:00', '16:00');
      const timeSlot2 = new TimeSlot('15:00', '17:00');

      // Act
      const result = timeSlot1.conflictsWith(timeSlot2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when one time slot is completely within another', () => {
      // Arrange
      const timeSlot1 = new TimeSlot('14:00', '18:00');
      const timeSlot2 = new TimeSlot('15:00', '16:00');

      // Act
      const result = timeSlot1.conflictsWith(timeSlot2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when two time slots do not overlap', () => {
      // Arrange
      const timeSlot1 = new TimeSlot('14:00', '16:00');
      const timeSlot2 = new TimeSlot('16:01', '18:00');

      // Act
      const result = timeSlot1.conflictsWith(timeSlot2);

      // Assert
      expect(result).toBe(false); // No overlap
    });

    it('should return false when one time slot ends exactly when the other starts', () => {
      // Arrange
      const timeSlot1 = new TimeSlot('14:00', '16:00');
      const timeSlot2 = new TimeSlot('16:00', '18:00');

      // Act
      const result = timeSlot1.conflictsWith(timeSlot2);

      // Assert
      expect(result).toBe(false); // No overlap
    });

    it('should return false when one time slot starts after the other ends', () => {
      // Arrange
      const timeSlot1 = new TimeSlot('14:00', '16:00');
      const timeSlot2 = new TimeSlot('17:00', '18:00');

      // Act
      const result = timeSlot1.conflictsWith(timeSlot2);

      // Assert
      expect(result).toBe(false); // No overlap
    });
  });

  describe('toString', () => {
    it('should return the correct string representation of the TimeSlot', () => {
      // Arrange
      const timeSlot = new TimeSlot('14:00', '16:00');

      // Act
      const result = timeSlot.toString();

      // Assert
      expect(result).toBe('14:00-16:00');
    });
  });
});
