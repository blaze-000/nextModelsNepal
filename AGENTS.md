# Repository Guidelines

## Project Structure & Module Organization
- `frontend/`: Next.js 15 App Router code, components, and Tailwind styles. Route groups live under `src/app/(public)` and `src/app/admin`.
- `backend/`: Express 5 server (`src/server.ts`) with ORPC procedures in `src/api/`, REST controllers in `src/routes/`, Mongoose models under `src/models/`, and uploads stored in `uploads/`.
- `packages/shared-types/`: Shared Zod schemas and constants consumed by both apps. Keep types generic—business logic stays in the owning service.
- Generated artifacts land in `frontend/.next/` and `backend/dist/`; purge them via the provided clean scripts rather than manual deletion.

## Build, Test, and Development Commands
- `pnpm install`: Run at the repo root to hydrate all workspaces.
- `pnpm dev`: Launches backend and frontend concurrently (port 8000 for API, 3000 for web).
- `pnpm build` / `pnpm start`: Build both apps, then boot the production bundles.
- `pnpm --filter ./backend run dev` and `pnpm --filter ./frontend run dev`: Focused hot-reload loops.
- `pnpm --filter ./backend run seed`: Seeds admin accounts; capture the generated passwords immediately.

## Coding Style & Naming Conventions
- TypeScript everywhere with ES modules; prefer async/await and early returns.
- React components, hooks, and context providers follow PascalCase; utility modules use kebab-case filenames.
- Run `pnpm --filter ./frontend run lint` before pushing UI changes; address warnings instead of suppressing them.
- Keep ORPC procedure schemas close to their handler files and document non-obvious transformations with short comments.

## Testing Guidelines
- Automated tests are not yet enforced—add targeted unit or integration tests when touching critical flows (auth, payments, voting). Vite Test or Vitest integrates cleanly with both apps if you introduce suites.
- For backend changes, exercise ORPC and REST endpoints via Thunder Client or `pnpm dev` + curl before opening a PR. Capture fixtures in `backend/scripts/` when useful.
- Record manual verification steps in PR descriptions until a formal test harness lands.

## Commit & Pull Request Guidelines
- Follow the existing present-tense, imperative style (`add contest service`, `fix admin login redirect`). Keep subjects under ~60 characters.
- Commits should stay scoped to one concern; split mechanical chores (lint fixes, lockfile bumps) from feature work.
- PRs needs a concise summary, linked issue or ticket, test notes, and screenshots/GIFs for UI updates. Flag breaking config changes and reference related env keys (`FONEPAY_*`, `MONGO_URI`).
- Request review from domain owners (frontend vs backend) and wait for CI or manual checks before merging.
