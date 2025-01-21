import { ValueObject } from '../../../shared/domain/value-object';

export class TimeSlot implements ValueObject {
  constructor(
    public readonly startTime: string,
    public readonly endTime: string,
  ) {
    if (!this.isValidTimeFormat(startTime))
      throw new Error('Invalid start time format. Use HH:mm.');

    if (!this.isValidTimeFormat(endTime))
      throw new Error('Invalid end time format. Use HH:mm.');

    if (startTime >= endTime)
      throw new Error('Start time must be earlier than end time.');
  }

  conflictsWith(other: TimeSlot): boolean {
    return this.startTime < other.endTime && this.endTime > other.startTime;
  }

  equals(other: TimeSlot): boolean {
    return this.startTime === other.startTime && this.endTime === other.endTime;
  }

  toString(): string {
    return `${this.startTime}-${this.endTime}`;
  }

  private isValidTimeFormat(time: string): boolean {
    return /^\d{2}:\d{2}$/.test(time);
  }
}
