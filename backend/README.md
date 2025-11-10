# Backend - AI Studio

This is the backend API for the AI Studio full-stack project.

For complete documentation including setup instructions, API endpoints, and full project details, please see the main [README.md](../README.md) in the root directory.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Configure `.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
PORT=4000
```

3. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Run development server:
```bash
npm run dev
```

The API will run on [http://localhost:4000](http://localhost:4000).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **SQLite** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Image Generation
- `POST /api/generations` - Create new generation
- `GET /api/generations` - Get generation history

## Documentation

- [Main README](../README.md) - Full project documentation
- [EVAL.md](../EVAL.md) - Requirements checklist
- [AI_USAGE.md](../AI_USAGE.md) - AI usage documentation
