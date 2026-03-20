# NewSpace

A modern reimagining of MySpace. Customize your profile with raw HTML & CSS, post status updates, follow friends.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **PostgreSQL** via Railway
- **Prisma** ORM
- **NextAuth v5** (JWT credentials)
- **Tailwind CSS** (app shell)
- **CodeMirror 6** (profile editor)
- **DOMPurify + jsdom** (server-side HTML sanitization)
- **Vercel** (deploy)

## Local Setup

### 1. Clone & install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Fill in:
- `DATABASE_URL` — PostgreSQL connection string (Railway free tier works great)
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev

### 3. Database

```bash
npm run db:push       # push schema to DB (dev)
# or
npm run db:migrate    # create migration files (production)
```

### 4. Run

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deploy

### Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables
4. Build command: `npx prisma generate && next build`

### Railway (Postgres)

1. Create a new Railway project
2. Add a PostgreSQL service
3. Copy the `DATABASE_URL` to Vercel env vars

## Profile Customization

Users can write arbitrary HTML + CSS for their profile. The system:

1. Sanitizes HTML server-side with DOMPurify (strips `<script>`, all event handlers)
2. Strips dangerous CSS (expressions, `@import`, `javascript:`)
3. Renders inside a sandboxed `<iframe sandbox="allow-same-origin allow-popups">` — **zero JS execution**

This is the same model MySpace used, but safer.

## Features

- ✅ Sign up / Sign in
- ✅ Public profiles with custom HTML/CSS (sandboxed)
- ✅ CodeMirror editor with live preview
- ✅ Status posts with likes & comments
- ✅ Follow / Unfollow
- ✅ Infinite scroll feed (following + own posts)
- ✅ Responsive design
