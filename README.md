# AI Studio - Full-Stack Application

AI-powered image generation app with Next.js frontend and Express.js backend. Upload images, apply AI transformations with custom prompts and styles, and manage generation history.

## Project Structure

```
ai-lab-modeila-full-stack/
├── frontend/        # Next.js 16 + React 19 + TypeScript
├── backend/         # Express.js + Prisma + SQLite
├── OPENAPI.yaml     # Backend API specification (OpenAPI 3.0)
├── README.md        # This file
├── EVAL.md          # Requirements checklist
└── AI_USAGE.md      # AI usage documentation
```

## Key Features

**Authentication**
- Email/password signup & login
- JWT authentication with auto-expiry
- Persistent sessions

**Image Generation**
- Drag-and-drop image upload
- Custom prompts with 6 artistic styles
- Auto-retry on failures (max 3 attempts)
- Generation history (last 5)
- Cancel ongoing generations

**Code Quality**
- 91%+ test coverage
- ESLint + Prettier
- GitHub Actions CI/CD
- TypeScript strict mode

## Tech Stack

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Zod, Jest, Cypress
**Backend:** Express.js, Prisma, SQLite, JWT, Bcrypt

## Setup

**Prerequisites:** Node.js 18+ (SQLite included, no separate database installation needed)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL (SQLite), JWT_SECRET, PORT=4000 in .env
npx prisma migrate dev
npx prisma generate
npm run dev
```

Backend runs on `http://localhost:4000`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000 in .env.local
npm run dev
```

Frontend runs on `http://localhost:3000`

## API Documentation

Complete API specification in **`OPENAPI.yaml`** (OpenAPI 3.0)

**Endpoints:**
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/generations` - Create generation (requires auth)
- `GET /api/generations?limit=5` - Get history (requires auth)


## Development

```bash
# Run tests
npm test                 # Run unit tests
npm run test:coverage    # With coverage
npm run test:e2e         # Run E2E tests (requires servers running)

# Code quality
npm run lint            # ESLint
npm run format          # Prettier

# Build
npm run build          # Production build
```

## Testing

**Unit Tests:** 51 tests with 91%+ coverage (components, hooks, API clients, validation)
**E2E Tests:** Cypress (authentication flows, image generation, responsive design)
**CI/CD:** GitHub Actions (Node.js 18.x & 20.x)

## How It Works

**Authentication:** JWT tokens (7-day expiry) stored in localStorage, auto-logout on expiry

**Image Generation:** Upload → Process with prompt & style → Auto-retry on 503 errors (max 3x) → Display result + history

**Error Handling:** Auto-retry, user-friendly messages, inline validation, cancellation support

## Security

- Password hashing (bcrypt, 10 rounds)
- JWT authentication
- Input validation (Zod)
- XSS/CSRF protection
- SQL injection prevention (Prisma ORM)

## Database Schema

```prisma
model User {
  id          String       @id @default(uuid())
  email       String       @unique
  password    String
  generations Generation[]
}

model Generation {
  id        Int      @id @default(autoincrement())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  imageUrl  String
  prompt    String
  style     String
  status    String   @default("completed")
  createdAt DateTime @default(now())
}
```

## Environment Variables

**Frontend** (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Backend** (`.env`)
```
DATABASE_URL=file:./dev.db
JWT_SECRET=your-secret-key-here
PORT=4000
```

