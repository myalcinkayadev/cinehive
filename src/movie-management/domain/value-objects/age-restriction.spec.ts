import { AgeRestriction } from './age-restriction';

describe('AgeRestriction', () => {
  describe('constructor', () => {
    it('should allow zero as a valid AgeRestriction', () => {
      // Arrange & Act
      const restriction = new AgeRestriction(0);

      // Assert
      expect(restriction.toString()).toBe('0');
    });

    it('should create a valid AgeRestriction for non-negative numbers', () => {
      // Arrange & Act
      const restriction = new AgeRestriction(42);

      // Assert
      expect(restriction.toString()).toBe('42');
    });

    it('should throw an error for negative values', () => {
      // Arrange & Act & Assert
      expect(() => new AgeRestriction(-1)).toThrow(
        'Age restriction must be greater or equal to zero.',
      );
    });
  });

  describe('isAllowedForAge', () => {
    it('should return true if age is equal to the restriction', () => {
      // Arrange
      const restriction = new AgeRestriction(15);

      // Act
      const result = restriction.isAllowedForAge(15);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true if age is greater than the restriction', () => {
      // Arrange
      const restriction = new AgeRestriction(18);

      // Act
      const result = restriction.isAllowedForAge(24);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false if age is less than the restriction', () => {
      // Arrange
      const restriction = new AgeRestriction(18);

      // Act
      const result = restriction.isAllowedForAge(17);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for two AgeRestrictions with the same value', () => {
      // Arrange
      const restriction1 = new AgeRestriction(18);
      const restriction2 = new AgeRestriction(18);

      // Act
      const result = restriction1.equals(restriction2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for two AgeRestrictions with different values', () => {
      // Arrange
      const restriction1 = new AgeRestriction(18);
      const restriction2 = new AgeRestriction(21);

      // Act
      const result = restriction1.equals(restriction2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('valueOf', () => {
    it('should return the correct number representation of the restriction', () => {
      // Arrange
      const restriction = new AgeRestriction(20);

      // Act
      const result = restriction.valueOf();

      // Assert
      expect(result).toBe(20);
    });
  });

  describe('toString', () => {
    it('should return the correct string representation of the restriction', () => {
      // Arrange
      const restriction = new AgeRestriction(18);

      // Act
      const result = restriction.toString();

      // Assert
      expect(result).toBe('18');
    });
  });
});
