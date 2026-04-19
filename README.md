# Trvalý Prep CMS

Admin dashboard for managing Trvalý Prep content and operations.

This CMS is built with Next.js App Router, Supabase SSR auth, and server actions. It is not a generic create-next-app starter anymore.

---

## Docs

- [`AGENTS.md`](AGENTS.md) — CMS-specific working rules for coding agents
- [`CLAUDE.md`](CLAUDE.md) — lightweight pointer back to AGENTS
- [`docs/architecture.md`](docs/architecture.md) — runtime architecture, auth, data access, storage, mutation patterns
- [`docs/entity-map.md`](docs/entity-map.md) — entity ownership, key files, and workflow gotchas
- [`../docs/product/`](../docs/product/) — learner-app/product docs that the CMS ultimately supports

---

## What This App Manages

- Courses, modules, lessons, lesson blocks, and block-linked exercises
- Standalone exercises and question bank content
- Exams, exam sections, and section question assignment
- User roles and subscription fields
- Teacher review threads and teacher comments
- Basic analytics / operational stats

---

## Stack

- Next.js `16.2.4`
- React `19`
- TypeScript `strict`
- App Router
- Supabase SSR + service-role admin client
- Tailwind CSS v4
- shadcn/ui-style component library under `components/ui/`
- React Hook Form + Zod
- Server Actions for writes

---

## Commands

Run from `cms/`:

```bash
npm run dev
npm run build
npm run start
```

There is currently no dedicated lint/test script in `package.json`.

---

## Environment

Required env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Usage split:
- SSR auth and browser uploads use the public URL + anon key
- privileged admin CRUD uses the service-role key on the server only

Never expose `SUPABASE_SERVICE_ROLE_KEY` in client components.

---

## Auth Model

- `/login` is public
- `/dashboard` and all `app/(admin)/**` routes are protected
- `proxy.ts` redirects unauthenticated users to `/login`
- `app/(admin)/layout.tsx` re-checks the session and requires `profiles.role === 'admin'`
- server actions also call `requireAdmin()` before writes

This means middleware/proxy is helpful, but server-side admin checks remain mandatory.

---

## Project Structure

```text
cms/
  app/                  App Router pages/layouts
  actions/              Server Actions for mutations
  components/           Feature and shared UI components
  hooks/                Client hooks (upload, reorder)
  lib/
    supabase/           SSR/browser/admin clients
    validations/        Zod schemas
    utils/              Storage/reorder/helpers
    types/              Generated DB types
  docs/                 CMS documentation
```

---

## Important Data Notes

- Lesson blocks do **not** own a direct `exercise_id`; linking goes through `lesson_block_exercises`
- Question bank content is `questions` + `question_options`
- Exercises store type-specific payloads in `exercises.content_json`
- Exams use `exam_sections`, while question assignment is expressed through `questions.section_id` and `questions.order_index`
- CMS uploads use Supabase Storage bucket `cms-assets`

---

## Working Rules

- Read [`docs/architecture.md`](docs/architecture.md) before changing auth, routing, server actions, uploads, or Supabase client usage
- Read [`docs/entity-map.md`](docs/entity-map.md) before changing course/question/exercise/exam/review flows
- Keep auth/admin checks server-side
- Match existing patterns before introducing new abstractions
- If a CMS change depends on learner-app data flow or schema assumptions, check [`../docs/product/`](../docs/product/)

