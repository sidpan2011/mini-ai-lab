# Frontend - AI Studio

This is the frontend application for the AI Studio full-stack project.

For complete documentation including setup instructions, API endpoints, and full project details, please see the main [README.md](../README.md) in the root directory.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

Configure `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

3. Run development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run E2E tests (headless)
- `npm run test:e2e:open` - Run E2E tests (interactive)
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Tech Stack

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Zod** - Validation
- **Jest** - Unit testing
- **Cypress** - E2E testing

## Documentation

- [Main README](../README.md) - Full project documentation
- [EVAL.md](../EVAL.md) - Requirements checklist
- [AI_USAGE.md](../AI_USAGE.md) - AI usage documentation
