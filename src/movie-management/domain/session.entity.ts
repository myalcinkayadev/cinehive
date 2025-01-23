import { Entity } from '../../shared/domain/entitiy';
import { Room } from './value-objects/room';
import { TimeSlot } from './value-objects/time-slot';

export class Session extends Entity {
  constructor(
    id: string,
    public readonly movieId: string,
    public readonly date: Date,
    public readonly timeSlot: TimeSlot,
    public readonly room: Room,
  ) {
    super(id);
  }

  conflictsWith(other: Session): boolean {
    return (
      this.date.toISOString() === other.date.toISOString() &&
      this.timeSlot.conflictsWith(other.timeSlot) &&
      this.room.equals(other.room)
    );
  }
}
