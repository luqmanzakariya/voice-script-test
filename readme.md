# Voice Script Test

A court reporting workflow system with a NestJS backend and Next.js frontend.

---

## Server Setup (NestJS)

> Requires **Node 18.18.0**

```bash
cd server
```

1. **Start the database** using Docker (recommended):
   ```bash
   docker-compose up -d
   ```
   Or configure your own PostgreSQL database by editing the `.env` file:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=voice_script
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm run start
   ```

If port `3001` conflicts, change `PORT` in `.env`.

---

## Client Setup (Next.js)

> Requires **Node 21.7.1**

```bash
cd client
```

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

If port `3000` conflicts, run:
```bash
npm run dev -- -p <available-port>
```

---

## Client Routes

| Route | Auth | Description |
|---|---|---|
| `/` | Public | Login page |
| `/dashboard` | Protected | Job list & assignment dashboard |
| `/payment` | Protected | All payment records |
| `/payment/:userId` | Protected | Payment detail for a specific user |

---

## Server API Routes

All protected routes require the `Authorization: Bearer <token>` header.

### Auth

#### `POST /auth/register` — Public
```json
{
  "name": "reporter 3",
  "email": "reporter3@mail.com",
  "password": "password",
  "city": "jakarta",
  "role": "ADMIN | REPORTER | EDITOR",
  "ratePerMinute": 3000
}
```

#### `POST /auth/login` — Public
```json
{
  "email": "admin@mail.com",
  "password": "password"
}
```
**Response:**
```json
{ "access_token": "<jwt>" }
```

---

### Jobs

#### `POST /jobs` — Auth required (ADMIN)
```json
{
  "caseName": "jakarta remote job 4",
  "duration": 60,
  "city": "jakarta",
  "locationType": "PHYSICAL | REMOTE"
}
```

#### `GET /jobs` — Auth required
Returns job list filtered by the requester's role:
- **ADMIN** → all jobs
- **REPORTER** → jobs with status `ASSIGNED`
- **EDITOR** → jobs with status `TRANSCRIBED`

#### `POST /jobs/assign` — Auth required (ADMIN)
```json
{
  "jobId": 1,
  "reporterId": 2,
  "editorId": 3
}
```
`reporterId` and `editorId` are optional — provide at least one.

#### `PATCH /jobs/update` — Auth required
```json
{
  "jobId": 1,
  "status": "NEW | ASSIGNED | TRANSCRIBED | REVIEWED | COMPLETED"
}
```
Allowed transitions by role:
- **ADMIN** → any status
- **REPORTER** → `ASSIGNED` → `TRANSCRIBED`
- **EDITOR** → `REVIEWED` → `COMPLETED`

---

### Users

#### `GET /users/by-role?role=REPORTER|EDITOR` — Auth required (ADMIN)

Returns all available users with the given role.

---

### Payments

#### `GET /payments` — Auth required (ADMIN)

Returns all payment records.

#### `GET /payments/user/:userId` — Auth required (ADMIN)

Returns payment records for a specific user with total earnings.

---

## Database Schema

```
┌─────────────────────────────────────────┐
│                  users                  │
├──────────────┬──────────────────────────┤
│ id           │ PK, auto-increment       │
│ name         │ varchar                  │
│ email        │ varchar, unique          │
│ password     │ varchar                  │
│ city         │ varchar                  │
│ available    │ boolean, default true    │
│ role         │ enum(ADMIN,REPORTER,     │
│              │       EDITOR)            │
│ ratePerMinute│ int, nullable            │
│ flatFee      │ int, nullable            │
│ createdAt    │ timestamp                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│                  jobs                   │
├──────────────┬──────────────────────────┤
│ id           │ PK, auto-increment       │
│ caseName     │ varchar                  │
│ duration     │ int (minutes)            │
│ city         │ varchar                  │
│ locationType │ enum(PHYSICAL, REMOTE)   │
│ status       │ enum(NEW, ASSIGNED,      │
│              │  TRANSCRIBED, REVIEWED,  │
│              │  COMPLETED)              │
│ reporterId   │ FK → users.id, nullable  │
│ editorId     │ FK → users.id, nullable  │
│ createdAt    │ timestamp                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│               payments                  │
├──────────────┬──────────────────────────┤
│ id           │ PK, auto-increment       │
│ userId       │ FK → users.id            │
│ jobId        │ FK → jobs.id             │
│ caseName     │ varchar (snapshot)       │
│ duration     │ int (snapshot)           │
│ role         │ varchar (snapshot)       │
│ earnings     │ decimal(15,2)            │
│ rateApplied  │ decimal(15,2) (snapshot) │
│ rateType     │ varchar(PER_MINUTE,      │
│              │         FLAT_FEE)        │
│ calculatedAt │ timestamp                │
└─────────────────────────────────────────┘
```

### Relationships

```
users ──< jobs (as reporter)   [users.id = jobs.reporterId]
users ──< jobs (as editor)     [users.id = jobs.editorId]
users ──< payments             [users.id = payments.userId]
jobs  ──< payments             [jobs.id  = payments.jobId]
```
