# Pachhapur Ka Samrat

A responsive community platform for Pachhapur Ka Samrat Ganesh Utsav. The React client is configured for GitHub Pages; the secure Express API and PostgreSQL database are deployed separately.

## Features

- Public home, about, events, gallery lightbox, announcements, and contact pages
- Registration and JWT authentication with `USER`, `COMMITTEE`, and `ADMIN` roles
- Private member dashboard and donation history
- Manual donation reference submission with pending, verified, and rejected states
- Committee donation search, filtering, verification, and verified-total reporting
- Admin user role and festival content management
- Zod validation, bcrypt password hashing, rate limiting, Helmet, CORS, and server-side authorization

## Architecture

```text
GitHub Pages (React + Vite)
	| HTTPS REST requests
Render / Railway (Express API)
	| Prisma
Neon / Supabase (PostgreSQL)
```

GitHub Pages hosts static files only. Database credentials and `JWT_SECRET` must exist only on the API host, never in GitHub variables prefixed with `VITE_`.

## Local setup

Requirements: Node.js 20+, npm, and PostgreSQL.

1. Run `npm install`.
2. Copy `server/.env.example` to `server/.env` and set `DATABASE_URL`, a random 32+ character `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
3. Copy `client/.env.example` to `client/.env`. Keep `VITE_API_URL=http://localhost:4000/api` locally.
4. Initialize and seed PostgreSQL with `npm run prisma:push -w server` and `npm run db:seed`.
5. Start both applications with `npm run dev`.

The client opens at `http://localhost:5173`; the API health endpoint is `http://localhost:4000/api/health`.

## Deploy the database and API

1. Create a PostgreSQL project on Neon and copy its pooled connection string.
2. Create a Render Web Service for this repository.
3. Use build command `npm install && npm run db:generate && npm run build -w server`.
4. Use start command `npm run start -w server`.
5. Add `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CLIENT_ORIGIN`. Set `CLIENT_ORIGIN` to `https://mpshetti14.github.io`.
6. From a trusted local shell with the production `DATABASE_URL`, run `npm run prisma:push -w server` and `npm run db:seed` once.

After launch, create and commit Prisma migrations with `npm run prisma:migrate -w server`, then run `npm run prisma:deploy -w server` during API deployment.

## Deploy the client to GitHub Pages

1. Deploy the API first and note its public URL, such as `https://your-api.onrender.com/api`.
2. In GitHub, open **Settings → Secrets and variables → Actions → Variables** and create `VITE_API_URL` with that URL. This API location is public, not a secret.
3. Open **Settings → Pages** and choose **GitHub Actions** as the source.
4. Push to `main`. The included workflow builds and publishes `client/dist`.

The site URL will be `https://mpshetti14.github.io/pachhapur_ka_samrat_utsav/`. Hash routing keeps direct routes compatible with GitHub Pages.

## Security notes

- Users can query only donations tied to their authenticated user ID.
- Committee and admin permissions are checked by API middleware.
- Donor contact data has no public endpoint.
- Change seeded credentials immediately and use a unique production `JWT_SECRET`.
- Donation details are references for manual verification; no payment gateway is integrated.

## Image credits

Demo festival photography is sourced from Wikimedia Commons search results for Ganesh Chaturthi and stored locally for reliable rendering. Replace these files with official Pachhapur Ka Samrat photographs before launch and retain attribution appropriate to each source license.