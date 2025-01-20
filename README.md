# Movie Management System (Cinehive)

## How to Identify Aggregates
### Aggregates should:
1. Represent a transactional consistency boundary.
2. Encapsulate closely related entities and value objects.
3. Protect the integrity of domain rules by managing internal consistency.

## Additional Resources:
* [Effective Aggregate Design - Part 1](https://www.dddcommunity.org/wp-content/uploads/files/pdf_articles/Vernon_2011_1.pdf)
* [Effective Aggregate Design - Part 2](https://www.dddcommunity.org/wp-content/uploads/files/pdf_articles/Vernon_2011_2.pdf)
* [Effective Aggregate Design - Part 3](https://www.dddcommunity.org/wp-content/uploads/files/pdf_articles/Vernon_2011_3.pdf)

### **Making Aggregates Work Together Through Identity References**

In **Domain-Driven Design (DDD)**, aggregates interact with each other while maintaining their **independence** and enforcing their own invariants. The recommended approach for enabling this interaction is through **identity references** rather than direct object references. This ensures aggregates are loosely coupled, scalable, and easier to manage in distributed systems.

---

## Design Choices

### 1. True Invariants of Each Domain Concept
#### *Movie Aggregate*
- Aggregate Root: `Movie`
- Description: Represents a single movie entity and its associated sessions.
- Entities and Value Objects:
    - Movie: Contains information like `name`, `ageRestriction`, and a `collection of sessions`.
    - Session: Represents a specific screening of the movie with attributes like `date`, `timeSlot`, and `roomName`.
- Responsibilities:
    - Add sessions to a movie while ensuring no conflicting sessions exist.
    - Retrieve sessions for a movie.
    - Manage movie details (e.g., edit or delete).
- Business Rules:
    - Sessions cannot overlap in the same room at the same time.
    - Each session must have valid `startTime`, `endTime`, and `date`.
- Movies must have a name and an age restriction.


#### *User Aggregate*
- Aggregate Root: `User`
- Description: Represents a system user, either a manager or a customer.
- Entities and Value Objects:
    - User: Contains attributes like `username`, `password`, `age`, and `role` (`manager` or `customer`).
    - Roles: Value object representing the user's permissions.
- Responsibilities:
    - Authenticate and authorize users based on their role (manager or customer).
    - Register new users.
- Business Rules:
    - Customers can only buy tickets and view/watch movies.
    - Managers can add, edit, and delete movies and sessions.

#### *Ticket Aggregate*
- Aggregate Root: `Ticket`
- Description: Represents a ticket purchased by a customer for a specific movie session.
- Entities and Value Objects:
    - Ticket: Contains attributes like `ticketId`, `userId`, `movieId`, `sessionId`, and purchase details (`purchasedAt`).
- Responsibilities:
    - Validate ticket purchases (e.g., session availability).
    - Store ticket details for tracking and history.
    - Allow customers to retrieve their purchased tickets.
- Business Rules:
    - A customer can only buy tickets for sessions that are not booked.
    - A valid ticket is required to watch a movie.

#### *Watch History Aggregate*
- Aggregate Root: `WatchHistory`
- Description: Tracks the history of movies watched by a customer.
- Entities and Value Objects:
    - WatchHistory: Contains a list of movies the customer has watched.
    - WatchedMovie: Value object that includes movie details, session time, and date.
- Responsibilities:
    - Record watched movies when a customer views a movie with a valid ticket.
    - Retrieve the watch history for a customer.
- Business Rules:
    - Only movies watched with a valid ticket can be added to the history.

---

### 2. Tell, Don’t Ask and Law of Demeter

#### **Applied Principles**
- **Tell, Don’t Ask**: We avoided fetching raw data to make decisions outside the entity. Instead, decisions are encapsulated within domain models. For example:
  - The `Session` entity includes a `conflictsWith()` method to encapsulate overlap logic.
  - The `Ticket` entity enforces age restriction rules internally.

- **Law of Demeter**: Each entity interacts only with its immediate collaborators. For example:
  - The `Movie` aggregate schedules sessions through its own method, `scheduleSession()`, without directly manipulating the `Session` entity externally.

---

## Architectural Choices

### 1. DDD and Aggregates
- **Movie** is the root aggregate managing its sessions.
- **Ticket** is a standalone aggregate linked to `Session` by identity references.
- **User** is managed separately under the `user-management` bounded context to ensure modularity.


### 2. Event-Driven Communication

### 3. Validation and Persistence Separation
- **Validation**:
  - Performed at the DTO level using `class-validator`.
  - Each DTO is explicitly documented with `@nestjs/swagger`.
- **Persistence**:
  - Entities and persistence models are separated:
    - **Domain Entities**: Represent core business logic.
    - **Persistence Models**: Manage database interactions using MikroORM.

### 4. Authentication and Authorization
- **Auth Decorator Composition**:
  - Enforces centralized logic and enhances reusability by combining authentication and role-based authorization into a single, declarative implementation.
- **Custom Role Guards**:
  - Enforced via `@Auth(UserRole.CUSTOMER)` and `@Auth(UserRole.MANAGER)`.
- **JWT-Based Authentication**:
  - Tokens are issued for user login and validated for each request.

### 5. Domain Purity
- **Focus on Business Needs**
  - Ensures that the domain model reflects the problem space rather than technical concerns.
- **Mapper (Bridging Domain and Persistence)**
  - The mapping between the domain model and persistence model is handled by a mapper.

### 6. Benefits of the UseCaseHandler Interface
- **Consistent Structure Across Use Cases:**
   - Enforces a uniform structure for implementing use cases.
- **Decoupling of Application Logic:**
   - Decouples the input/output structure of a use case from its implementation, allowing flexibility in adapting use cases to different contexts (e.g., API, CLI, batch jobs).

```typescript 
export interface UseCaseHandler<Input, Output> {
    execute(input: Input): Promise<Output>;
}
```

## Additionals:
- Docker Compose
- Migration
- Telemetry
- Health
