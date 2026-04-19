<!-- BEGIN:nextjs-agent-rules -->
# CMS AGENTS.md

This file provides guidance for working inside `cms/`.

This is **not** a generic Next.js starter anymore. Treat the codebase as a real admin app with Supabase auth, server actions, and App Router conventions already in place.

Read [`../AGENTS.md`](../AGENTS.md) for repo-wide product rules first, then use this file for CMS-specific guidance.

Canonical CMS docs:
- [`README.md`](README.md)
- [`docs/architecture.md`](docs/architecture.md)
- [`docs/entity-map.md`](docs/entity-map.md)

---

## Project

`cms/` is the admin dashboard for Trvalý Prep.

Purpose:
- manage courses, modules, lessons, lesson blocks, and linked exercises
- manage standalone exercises and question bank content
- manage exams and exam sections
- manage users, subscriptions, and roles
- manage teacher reviews/comments
- view simple analytics and operational counts

The app is built with:
- Next.js `16.2.4`
- React `19`
- TypeScript `strict`
- App Router
- Supabase SSR + service-role admin client
- Tailwind CSS v4
- shadcn/ui style components in `components/ui/`
- React Hook Form + Zod for forms/validation
- server actions for mutations

Start with [`README.md`](README.md) for setup/context, then use [`docs/architecture.md`](docs/architecture.md) and [`docs/entity-map.md`](docs/entity-map.md) for implementation details.

---

## Commands

Run from `cms/`:

```bash
npm run dev
npm run build
npm run start
```

There is currently no dedicated lint/test script in `package.json`. If you add one, keep it aligned with the existing toolchain and document it here.

---

## Environment

CMS relies on these env vars:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Usage split:
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` are used by SSR auth and browser uploads
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and used by the admin client for privileged CRUD

Never expose `SUPABASE_SERVICE_ROLE_KEY` to client components.

---

## Architecture

### Routing

App Router structure:
- `app/page.tsx` redirects to `/dashboard`
- `app/login/page.tsx` is the public login screen
- `app/(admin)/**` contains the protected admin surface

The protected shell is defined in [`app/(admin)/layout.tsx`](app/(admin)/layout.tsx) and renders:
- [`components/layout/sidebar.tsx`](components/layout/sidebar.tsx)
- [`components/layout/header.tsx`](components/layout/header.tsx)
- [`components/ui/sonner.tsx`](components/ui/sonner.tsx)

### Auth + Access Control

Auth flow uses Supabase SSR:
- [`proxy.ts`](proxy.ts) refreshes/checks auth and redirects unauthenticated users away from protected routes
- [`lib/supabase/server.ts`](lib/supabase/server.ts) creates the SSR client
- `requireAdmin()` checks both session and `profiles.role === 'admin'`
- admin layout repeats the admin-role guard server-side before rendering protected content

Do not assume `proxy.ts` alone is sufficient authorization. Keep server-side authorization checks for mutations and sensitive page loads.

### Supabase Clients

There are three Supabase entry points:

1. [`lib/supabase/server.ts`](lib/supabase/server.ts)
   Use in server components and auth-aware server code.

2. [`lib/supabase/client.ts`](lib/supabase/client.ts)
   Use in client components only when browser interaction is required, especially uploads.

3. [`lib/supabase/admin.ts`](lib/supabase/admin.ts)
   Service-role client. Server-side only. Use for admin CRUD and storage deletion.

Rule of thumb:
- server page reads: use `createClient()`
- browser uploads: use browser `createClient()`
- server actions / privileged writes: use `createAdminClient()` plus `requireAdmin()`

### Mutation Pattern

Mutations are implemented as server actions in `actions/`:
- [`actions/auth.ts`](actions/auth.ts)
- [`actions/courses.ts`](actions/courses.ts)
- [`actions/exercises.ts`](actions/exercises.ts)
- [`actions/questions.ts`](actions/questions.ts)
- [`actions/exams.ts`](actions/exams.ts)
- [`actions/reviews.ts`](actions/reviews.ts)
- [`actions/users.ts`](actions/users.ts)

Standard pattern:
- `'use server'`
- call `await requireAdmin()`
- validate with Zod where applicable
- perform DB write via `createAdminClient()`
- `revalidatePath(...)`
- return `{ data }`, `{ success: true }`, or `{ error }`

Keep new mutations consistent with this shape.

### Component Pattern

Common split:
- pages are mostly async server components that fetch initial data
- interactive forms/lists are client components
- forms call server actions inside `startTransition(...)`
- success/error feedback uses `sonner` toasts
- navigation after save uses `router.push(...)` or `router.refresh()`

Examples:
- [`components/courses/course-form.tsx`](components/courses/course-form.tsx)
- [`components/questions/question-form.tsx`](components/questions/question-form.tsx)
- [`components/exercises/exercise-form.tsx`](components/exercises/exercise-form.tsx)
- [`components/courses/lesson-block-editor.tsx`](components/courses/lesson-block-editor.tsx)

### Path Aliases

TypeScript path alias is enabled:
- `@/*` → `cms/*`

Prefer `@/` imports over long relative paths.

---

## Data Model Conventions

### Courses / Modules / Lessons

Core hierarchy:
- `courses`
- `modules`
- `lessons`
- `lesson_blocks`
- `lesson_block_exercises`

Important:
- lesson blocks no longer own a direct `exercise_id`
- linking is done through `lesson_block_exercises`

When editing lesson flows, make sure you work with the junction table instead of assuming one exercise per block.

Representative files:
- [`actions/courses.ts`](actions/courses.ts)
- [`components/courses/lesson-block-editor.tsx`](components/courses/lesson-block-editor.tsx)
- [`app/(admin)/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/page.tsx`](app/(admin)/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/page.tsx)

### Questions

Question bank content lives in `questions` + `question_options`.

Validation:
- [`lib/validations/question.schema.ts`](lib/validations/question.schema.ts)

Notable behavior:
- `createQuestion` inserts the question first, then inserts options
- `updateQuestion` currently replaces options by deleting and reinserting them
- bulk import is supported in [`actions/questions.ts`](actions/questions.ts)

If you change question types or fields, update both the Zod schema and the form/UI logic.

### Exercises

Exercises are stored in `exercises`, with type-specific payloads in `content_json`.

Files:
- [`components/exercises/exercise-form.tsx`](components/exercises/exercise-form.tsx)
- [`actions/exercises.ts`](actions/exercises.ts)
- [`lib/validations/exercise.schema.ts`](lib/validations/exercise.schema.ts)

Important nuance:
- `exercise.schema.ts` defines content schemas and base schema helpers
- the current form/action flow does not fully pipe everything through a single end-to-end Zod parse the way course/question forms do
- if you tighten exercise validation, update both the schema helpers and the form submit/build logic

### Exams

Exam management uses:
- `exams`
- `exam_sections`
- `questions.section_id` / `order_index` for section assignment

Files:
- [`actions/exams.ts`](actions/exams.ts)
- [`components/exams/exam-form.tsx`](components/exams/exam-form.tsx)
- [`components/exams/section-question-picker.tsx`](components/exams/section-question-picker.tsx)
- [`lib/validations/exam.schema.ts`](lib/validations/exam.schema.ts)

### Reviews / Users / Analytics

Files:
- teacher reviews: [`actions/reviews.ts`](actions/reviews.ts)
- user roles/subscriptions: [`actions/users.ts`](actions/users.ts)
- analytics dashboard: [`app/(admin)/analytics/page.tsx`](app/(admin)/analytics/page.tsx)

Analytics is currently simple server-rendered aggregation, not a heavy charting data pipeline.

---

## Reordering

Drag-and-drop reorder behavior uses:
- [`hooks/use-reorder.ts`](hooks/use-reorder.ts)
- [`lib/utils/reorder.ts`](lib/utils/reorder.ts)

Current behavior:
- reorder is optimistic in the client
- persistence is done by batch-updating `order_index`
- `batchUpdateOrderIndex()` updates rows one-by-one with `Promise.all`

If you change reorder behavior, preserve:
- stable `id`
- 1-based `order_index`
- server action compatibility

---

## Storage / Uploads

CMS uploads use Supabase Storage bucket:
- `cms-assets`

Key files:
- [`hooks/use-upload.ts`](hooks/use-upload.ts)
- [`lib/utils/storage.ts`](lib/utils/storage.ts)
- [`components/shared/file-upload-field.tsx`](components/shared/file-upload-field.tsx)

Rules:
- browser uploads use the client Supabase SDK
- uploaded files are public URLs
- storage paths are caller-defined and usually include UUIDs/timestamps
- server-side deletions should go through `deleteStorageFile()`

If you change bucket name or storage path conventions, update both upload and URL/path extraction helpers.

---

## UI Conventions

Use existing UI primitives from `components/ui/` and shared admin widgets before introducing new patterns.

Prefer:
- `Card`, `Button`, `Input`, `Textarea`, `Select`, `Switch`
- `ConfirmDialog` for destructive actions
- `DataTable` for tabular listings
- `SkillBadge` for skill/type badges
- `toast.success(...)` / `toast.error(...)` for user feedback

Keep the admin UI practical and consistent. Do not introduce flashy product-site styling into CMS pages.

---

## Next.js Specific Warnings

This CMS runs on **Next.js 16**, and the repo already warns that this is not “the Next.js you know”.

Before changing framework-level behavior:
- read the relevant Next docs in [`node_modules/next/dist/docs/`](node_modules/next/dist/docs/)
- do not assume older App Router behavior from memory
- be careful with async `params` / async `searchParams`, which are used in this codebase

Examples in current code:
- `params: Promise<{ ... }>`
- `searchParams: Promise<{ ... }>`

Follow the existing project pattern unless you are intentionally modernizing the whole slice.

---

## Working Rules

Before making a non-trivial plan or changing code in a CMS feature/flow:
- read the relevant files in `cms/app/`, `cms/actions/`, `cms/components/`, and `cms/lib/`
- check the related product docs in [`../docs/product/`](../docs/product/)
- prefer matching existing patterns over inventing new abstractions

When adding or changing behavior:
- keep auth/admin checks server-side
- update the related server action, page, form, and validation together
- update docs if the CMS now depends on a changed product/data flow

When touching file uploads, question/exercise schemas, or lesson block linking, be extra careful: those are the easiest places to break compatibility with the learner app.

<!-- END:nextjs-agent-rules -->
