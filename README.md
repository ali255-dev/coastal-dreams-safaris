# Coastlink Safaris

Tours along the Kenyan coast — browse, search, book, pay and get notified.

## Run locally (VS Code)

Requirements: **Node.js 20+** (or Bun).

```bash
# 1. install dependencies
npm install

# 2. environment variables
#    .env is committed in this repo. If it is missing, copy the template:
cp .env.example .env

# 3. start the dev server
npm run dev
```

Then open the URL printed in the terminal (http://localhost:8080).

Common issues:

| Error | Fix |
| --- | --- |
| `sh: 1: vite: not found` | you skipped `npm install` |
| `Missing Supabase environment variable(s)` | `.env` is missing — copy `.env.example` to `.env` |
| blank page / 500 on start | delete `node_modules` and `.tanstack`, then `npm install` again |

## Backend

The backend is hosted (managed Postgres + auth). No local database is needed —
the app talks to it using the keys in `.env`.

Tables:

- `profiles` — created automatically on signup
- `tours` — public catalogue (seeded with 7 coastal tours)
- `bookings` — private per user; creating one auto-generates a notification
- `notifications` — private per user, with unread badge in the header

All tables have row-level security, so a signed-in user can only read and
write their own bookings, notifications and profile. Tours are public read-only.

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build
```
