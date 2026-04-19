# CMS Architecture

Technical overview of the `cms/` admin app.

---

## Runtime Model

The CMS uses Next.js App Router with a split between:
- server-rendered pages for initial data fetch
- client components for interactivity
- server actions for writes

Typical request flow:

1. `proxy.ts` refreshes/checks session cookies and redirects unauthenticated users
2. protected pages under `app/(admin)` render through `app/(admin)/layout.tsx`
3. layout checks `profiles.role` and only allows `admin`
4. pages fetch initial data from Supabase
5. client forms/lists call server actions for mutations
6. server actions write via service-role and call `revalidatePath(...)`

---

## Routing

Key routes:
- `/` → redirects to `/dashboard`
- `/login` → admin login screen
- `/dashboard` → overview stats
- `/courses` → course/module/lesson management
- `/exercises` → exercise management
- `/questions` → question bank
- `/exams` → exam + section management
- `/users` → roles and subscriptions
- `/reviews` → teacher review threads
- `/analytics` → operational analytics

Protected route shell:
- [`app/(admin)/layout.tsx`](../app/(admin)/layout.tsx)

Route guard:
- [`proxy.ts`](../proxy.ts)

---

## Auth and Authorization

### SSR Auth

SSR auth client:
- [`lib/supabase/server.ts`](../lib/supabase/server.ts)

Used for:
- reading session cookies
- page-level user access checks
- server component data fetches that should behave as the signed-in admin

### Admin Authorization

`requireAdmin()`:
- loads the current user from Supabase auth
- queries `profiles.role`
- redirects to `/login?error=forbidden` if role is not `admin`

Use `requireAdmin()` in every privileged mutation.

### Service-Role Writes

Admin client:
- [`lib/supabase/admin.ts`](../lib/supabase/admin.ts)

Use this only on the server for:
- content CRUD
- user role/subscription updates
- review updates/comments
- storage deletion

Never import the admin client into a client component.

---

## Supabase Client Split

There are three clients in use:

### 1. SSR client

File:
- [`lib/supabase/server.ts`](../lib/supabase/server.ts)

Use for:
- server pages
- auth-aware reads
- role checks

### 2. Browser client

File:
- [`lib/supabase/client.ts`](../lib/supabase/client.ts)

Use for:
- browser-only interactions
- file uploads from client components

### 3. Service-role admin client

File:
- [`lib/supabase/admin.ts`](../lib/supabase/admin.ts)

Use for:
- privileged writes in server actions
- storage removal

Rule:
- page reads: SSR client
- uploads: browser client
- admin writes: service-role client

---

## Mutation Pattern

Mutations live in `actions/` and follow a consistent shape:

1. `'use server'`
2. `await requireAdmin()`
3. validate input with Zod when applicable
4. write using `createAdminClient()`
5. call `revalidatePath(...)`
6. return a small action result object

Representative files:
- [`actions/courses.ts`](../actions/courses.ts)
- [`actions/questions.ts`](../actions/questions.ts)
- [`actions/exams.ts`](../actions/exams.ts)
- [`actions/reviews.ts`](../actions/reviews.ts)
- [`actions/users.ts`](../actions/users.ts)

Common return shapes:
- `{ data: ... }`
- `{ success: true }`
- `{ error: ... }`

Keep new actions consistent with this contract so existing client-side toast handling continues to work.

---

## Form Pattern

Most forms are client components that:
- use React Hook Form
- often use Zod via `zodResolver`
- call a server action inside `startTransition(...)`
- show `sonner` toast feedback
- redirect or refresh on success

Representative forms:
- [`components/courses/course-form.tsx`](../components/courses/course-form.tsx)
- [`components/questions/question-form.tsx`](../components/questions/question-form.tsx)
- [`components/exercises/exercise-form.tsx`](../components/exercises/exercise-form.tsx)
- [`components/exams/exam-form.tsx`](../components/exams/exam-form.tsx)

---

## Reordering

Reordering uses optimistic client updates plus batched server persistence.

Files:
- [`hooks/use-reorder.ts`](../hooks/use-reorder.ts)
- [`lib/utils/reorder.ts`](../lib/utils/reorder.ts)

Current behavior:
- client reorders immediately
- `order_index` becomes 1-based in display order
- updates are persisted with multiple `update(...).eq('id', ...)` calls in parallel

If you change this, preserve:
- stable `id`
- 1-based ordering
- compatibility with current sortable UI components

---

## Storage

Uploads use Supabase Storage bucket:
- `cms-assets`

Files:
- [`hooks/use-upload.ts`](../hooks/use-upload.ts)
- [`lib/utils/storage.ts`](../lib/utils/storage.ts)
- [`components/shared/file-upload-field.tsx`](../components/shared/file-upload-field.tsx)

Current rules:
- uploads happen from the browser
- uploaded files are treated as public URLs
- path generation is caller-controlled
- deletion should happen server-side via admin client utilities

---

## Known Framework Conventions

This CMS is on Next.js 16 and already uses patterns that differ from older Next memory:

- async `params`
- async `searchParams`
- App Router everywhere
- server actions as the default mutation layer

Examples:
- `params: Promise<{ ... }>`
- `searchParams: Promise<{ ... }>`

Follow the local pattern unless you are intentionally refactoring an entire slice.

