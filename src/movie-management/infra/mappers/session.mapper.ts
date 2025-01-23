import { TimeSlot } from '../../../movie-management/domain/value-objects/time-slot';
import { Session } from '../../../movie-management/domain/session.entity';
import { SessionPersistence } from '../persistences/session.persistence';
import { Room } from '../../../movie-management/domain/value-objects/room';
import { MoviePersistence } from '../persistences/movie.persistence';
import { SessionDto } from '../../application/dtos/movie.dto';

export class SessionMapper {
  static toDomain(persistence: SessionPersistence): Session {
    const session = new Session(
      persistence.id,
      persistence.movie.id,
      persistence.date,
      new TimeSlot(persistence.timeSlotStart, persistence.timeSlotEnd),
      new Room(persistence.roomName),
    );

    return session;
  }

  static toPersistence(domain: Session): SessionPersistence {
    const movie = new MoviePersistence();
    movie.id = domain.movieId;

    const sessionToPersist = new SessionPersistence();
    sessionToPersist.id = domain.id;
    sessionToPersist.date = domain.date;
    sessionToPersist.timeSlotStart = domain.timeSlot.startTime;
    sessionToPersist.timeSlotEnd = domain.timeSlot.endTime;
    sessionToPersist.roomName = domain.room.toString();
    sessionToPersist.movie = movie;
    return sessionToPersist;
  }

  static toDto(session: Session): SessionDto {
    return {
      id: session.id,
      date: session.date.toISOString(),
      timeSlotStart: session.timeSlot.startTime,
      timeSlotEnd: session.timeSlot.endTime,
      roomName: session.room.valueOf(),
    };
  }
}
