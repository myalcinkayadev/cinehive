import { TimeSlot } from '../../../movie-management/domain/value-objects/time-slot';
import { Session } from '../../../movie-management/domain/session.entity';
import { SessionPersistence } from '../persistences/session.persistence';
import { Room } from '../../../movie-management/domain/value-objects/room';
import { MoviePersistence } from '../persistences/movie.persistence';

export class SessionMapper {
  static toDomain(persistence: SessionPersistence): Session {
    return new Session(
      persistence.id,
      persistence.movie.id,
      persistence.date,
      new TimeSlot(persistence.timeSlotStart, persistence.timeSlotEnd),
      new Room(persistence.roomName),
    );
  }

  static toPersistence(domain: Session): SessionPersistence {
    const movie = new MoviePersistence();
    movie.id = domain.movieId;

    const sessionToPersist = new SessionPersistence();
    sessionToPersist.id = domain.id;
    sessionToPersist.date = domain.date;
    sessionToPersist.timeSlotStart = domain.timeSlot.getStartTime();
    sessionToPersist.timeSlotEnd = domain.timeSlot.getEndTime();
    sessionToPersist.roomName = domain.room.toString();
    sessionToPersist.movie = movie;
    return sessionToPersist;
  }
}
