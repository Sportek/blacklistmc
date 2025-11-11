# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BlacklistMC is a Next.js 14 application that centralizes Minecraft server blacklists for simplified ban management. The platform allows moderators to review and manage player blacklists with a voting system, proof management, and Discord integration.

## Development Commands

```bash
# Development server
npm run dev

# Build production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Database operations (Prisma)
npx prisma generate          # Generate Prisma client
npx prisma db push           # Push schema changes to database
npx prisma studio            # Open Prisma Studio GUI
npx prisma migrate dev       # Create and apply migrations (development)
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth with Discord OAuth
- **File Storage**: Azure Blob Storage
- **API Documentation**: Swagger (available at `/api`)
- **UI**: Tailwind CSS + shadcn/ui components

### Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (pages)/                  # Public pages (landing, blacklists, users)
│   │   └── (auth)/              # Auth callback pages
│   ├── dashboard/                # Protected admin dashboard
│   │   ├── blacklists/          # Blacklist management
│   │   ├── users/               # User management
│   │   ├── reasons/             # Reason management
│   │   └── tokens/              # API token management
│   └── api/                      # API routes
│       ├── auth/                 # Authentication endpoints
│       ├── blacklists/           # Blacklist CRUD
│       ├── users/                # User operations
│       └── reasons/              # Reason management
├── components/                   # React components
├── contexts/                     # React contexts (auth)
├── hooks/                        # Custom React hooks
├── http/                         # External API clients (Discord)
├── lib/                          # Core utilities
│   ├── authorizer.ts            # JWT auth & role verification
│   ├── prisma.ts                # Prisma client singleton
│   └── swagger.ts               # Swagger documentation config
├── utils/                        # Utility functions
│   └── file-upload-manager.ts   # Azure storage integration
├── types/                        # TypeScript type definitions
└── middleware.ts                 # Route protection middleware
```

### Authentication & Authorization

**Authentication Flow**:
1. Discord OAuth callback creates/updates User record via `setUserInfo()` in `src/http/discord-requests.ts`
2. JWT token issued and stored in HTTP-only cookie
3. Middleware (`src/middleware.ts`) protects `/dashboard/*` routes
4. Session retrieved via `getSession()` from cookie or Authorization header

**Authorization System**:
- Role hierarchy (from `src/lib/authorizer.ts`): ADMIN (900) > SUPERVISOR (800) > SUPPORT (700) > USER (600) > UNKNOWN (500)
- Use `hasAtLeastRole(requiredRole, userRole)` for permission checks
- Use `verifyRoleRequired(role, request)` in API routes to enforce permissions
- Throws `AuthorizationError` with appropriate status codes (401/403)

### Database Schema (Prisma)

**Core Models**:
- `User`: Discord users (can have multiple blacklists)
- `Account`: Registered accounts linked to Users (1:1 relation)
- `Blacklist`: Blacklist entries with status workflow (PENDING → APPROVED/REJECTED)
- `ModeratorVote`: Voting system for blacklists
- `Proof`: Evidence attachments (VIDEO/IMAGE/FILE) stored in Azure
- `Reason`: Predefined blacklist reasons
- `UserHistory`: Tracks Discord profile changes (username, avatar, display name)

**Important Relations**:
- Blacklist has `userId` (blacklisted user) and `askedByUserId` (creator)
- Users can belong to `UserGroup` for grouping accounts
- Proofs link to Blacklists and store Azure Blob URLs

### Discord Integration

**User Synchronization** (`src/http/discord-requests.ts`):
- `getUserInfo(userId)`: Fetches Discord user data via bot token
- `updateOrCreateUserInfo(userId)`: Syncs Discord profile to database
- `setUserInfo()`: Creates/updates User record and tracks history when username/avatar/displayName changes
- User creation date extracted from Discord snowflake ID

**Profile History**:
When Discord profile changes detected (via `areUserInfoDifferent()`), old data saved to `UserHistory` before updating User record.

### File Storage (Azure Blob)

Files stored in Azure Blob Storage container specified by `AZURE_STORAGE_CONTAINER_NAME`. Upload managed via `uploadBufferToAzure()` in `src/utils/file-upload-manager.ts`.

**Proof Storage Pattern**:
- User avatars: `users/{userId}/avatars/{timestamp}.png`
- Blacklist proofs: Managed through `/api/blacklists/[blacklistId]/proofs` endpoints

### API Validation

- Use Zod schemas for request validation (see `blacklistSchema.ts`, `proofSchema.ts`, `userSchema.ts`)
- Search params validated via dedicated schemas (e.g., `blacklistSearchParamsValidator.ts`)
- Custom refinements for database existence checks (e.g., `reasonIdExists()`)

### Key Patterns

**API Route Structure**:
1. Parse/validate request params using Zod
2. Get session with `getSession(req)`
3. Verify permissions with `verifyRoleRequired()` or `hasAtLeastRole()`
4. Perform database operations via Prisma
5. Return `NextResponse.json()` with appropriate status codes

**Status Filtering**:
- Public endpoints only show `APPROVED` blacklists unless user has SUPPORT+ role
- Example: `/api/blacklists` checks role before allowing status filtering

**Swagger Documentation**:
- API documented with JSDoc @swagger comments
- Access docs at `/api` route
- Schema definitions in `src/lib/swagger.ts`

## Environment Variables

Required variables (see `.env.local` example):
- `JWT_SECRET`: JWT signing secret
- `POSTGRES_PRISMA_URL`: PostgreSQL connection string
- `AUTH_DISCORD_SECRET`: Discord OAuth client secret
- `DISCORD_TOKEN`: Discord bot token for user lookups
- `DISCORD_API_URL`: Discord API base URL
- `AZURE_STORAGE_*`: Azure Blob Storage credentials
- `NEXT_PUBLIC_*`: Client-side accessible variables

## Path Aliases

TypeScript paths configured in `tsconfig.json`:
- `@/*`: Maps to `./src/*`
- `@/public/*`: Maps to `./public/*`
