# CMS Entity Map

This document maps each major admin entity to its tables, actions, forms, and page entry points.

---

## Courses / Modules / Lessons

Tables:
- `courses`
- `modules`
- `lessons`

Validation:
- [`lib/validations/course.schema.ts`](../lib/validations/course.schema.ts)

Server actions:
- [`actions/courses.ts`](../actions/courses.ts)

Main forms/components:
- [`components/courses/course-form.tsx`](../components/courses/course-form.tsx)
- [`components/courses/module-form.tsx`](../components/courses/module-form.tsx)
- [`components/courses/lesson-form.tsx`](../components/courses/lesson-form.tsx)

Representative pages:
- [`app/(admin)/courses/page.tsx`](../app/(admin)/courses/page.tsx)
- [`app/(admin)/courses/[courseId]/page.tsx`](../app/(admin)/courses/[courseId]/page.tsx)
- [`app/(admin)/courses/[courseId]/modules/[moduleId]/page.tsx`](../app/(admin)/courses/[courseId]/modules/[moduleId]/page.tsx)

Notes:
- module and lesson ordering is persisted via `order_index`
- list UIs use client reorder helpers plus reorder server actions

---

## Lesson Blocks

Tables:
- `lesson_blocks`
- `lesson_block_exercises`

Key actions:
- `createLessonBlock`
- `updateLessonBlock`
- `deleteLessonBlock`
- `reorderLessonBlocks`
- `addExerciseToBlock`
- `removeExerciseFromBlock`

Key components:
- [`components/courses/lesson-block-editor.tsx`](../components/courses/lesson-block-editor.tsx)
- [`components/courses/lesson-blocks-client.tsx`](../components/courses/lesson-blocks-client.tsx)
- [`components/courses/add-lesson-block-form.tsx`](../components/courses/add-lesson-block-form.tsx)

Representative page:
- [`app/(admin)/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/page.tsx`](../app/(admin)/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/page.tsx)

Critical gotcha:
- there is no direct `lesson_blocks.exercise_id`
- block ↔ exercise linking goes through `lesson_block_exercises`

If you forget this, you will likely break lesson editing or incorrectly model one-to-many relationships.

---

## Exercises

Table:
- `exercises`

Storage model:
- `type`, `skill`, `difficulty`, `xp_reward`, `points`
- type-specific payload lives in `content_json`

Files:
- [`actions/exercises.ts`](../actions/exercises.ts)
- [`components/exercises/exercise-form.tsx`](../components/exercises/exercise-form.tsx)
- [`lib/validations/exercise.schema.ts`](../lib/validations/exercise.schema.ts)

Representative pages:
- [`app/(admin)/exercises/page.tsx`](../app/(admin)/exercises/page.tsx)
- [`app/(admin)/exercises/new/page.tsx`](../app/(admin)/exercises/new/page.tsx)
- [`app/(admin)/exercises/[exerciseId]/edit/page.tsx`](../app/(admin)/exercises/[exerciseId]/edit/page.tsx)

Important nuance:
- `exercise.schema.ts` defines content schemas, but current create/update actions accept built `content_json` directly
- exercise form logic is responsible for assembling the final payload

Be careful when changing exercise types or content shape: update both the form builder logic and any validation helpers.

---

## Questions

Tables:
- `questions`
- `question_options`

Validation:
- [`lib/validations/question.schema.ts`](../lib/validations/question.schema.ts)

Actions:
- [`actions/questions.ts`](../actions/questions.ts)

Key components:
- [`components/questions/question-form.tsx`](../components/questions/question-form.tsx)
- [`components/questions/question-option-builder.tsx`](../components/questions/question-option-builder.tsx)
- [`components/questions/bulk-import-form.tsx`](../components/questions/bulk-import-form.tsx)

Representative pages:
- [`app/(admin)/questions/page.tsx`](../app/(admin)/questions/page.tsx)
- [`app/(admin)/questions/new/page.tsx`](../app/(admin)/questions/new/page.tsx)
- [`app/(admin)/questions/[questionId]/edit/page.tsx`](../app/(admin)/questions/[questionId]/edit/page.tsx)
- [`app/(admin)/questions/import/page.tsx`](../app/(admin)/questions/import/page.tsx)

Notable behaviors:
- question creation inserts the parent row first
- options are stored separately in `question_options`
- updates currently replace options by delete + reinsert
- bulk import is supported for question bank workflows

---

## Exams

Tables:
- `exams`
- `exam_sections`
- `questions.section_id`

Validation:
- [`lib/validations/exam.schema.ts`](../lib/validations/exam.schema.ts)

Actions:
- [`actions/exams.ts`](../actions/exams.ts)
- question assignment helpers in [`actions/questions.ts`](../actions/questions.ts)

Key components:
- [`components/exams/exam-form.tsx`](../components/exams/exam-form.tsx)
- [`components/exams/add-section-form.tsx`](../components/exams/add-section-form.tsx)
- [`components/exams/section-question-picker.tsx`](../components/exams/section-question-picker.tsx)

Representative pages:
- [`app/(admin)/exams/page.tsx`](../app/(admin)/exams/page.tsx)
- [`app/(admin)/exams/new/page.tsx`](../app/(admin)/exams/new/page.tsx)
- [`app/(admin)/exams/[examId]/page.tsx`](../app/(admin)/exams/[examId]/page.tsx)
- [`app/(admin)/exams/[examId]/sections/[sectionId]/page.tsx`](../app/(admin)/exams/[examId]/sections/[sectionId]/page.tsx)

Important:
- section ordering and question ordering are separate concerns
- section question membership is modeled by setting `questions.section_id`

---

## Reviews

Tables:
- `teacher_reviews`
- `teacher_comments`

Actions:
- [`actions/reviews.ts`](../actions/reviews.ts)

Key components:
- [`components/reviews/review-detail-client.tsx`](../components/reviews/review-detail-client.tsx)

Pages:
- [`app/(admin)/reviews/page.tsx`](../app/(admin)/reviews/page.tsx)
- [`app/(admin)/reviews/[reviewId]/page.tsx`](../app/(admin)/reviews/[reviewId]/page.tsx)

Capabilities:
- change review status
- add teacher comments
- mark thread reviewed

---

## Users

Table:
- `profiles`

Actions:
- [`actions/users.ts`](../actions/users.ts)

Key components:
- [`components/users/user-role-form.tsx`](../components/users/user-role-form.tsx)

Pages:
- [`app/(admin)/users/page.tsx`](../app/(admin)/users/page.tsx)
- [`app/(admin)/users/[userId]/page.tsx`](../app/(admin)/users/[userId]/page.tsx)

Supported updates:
- `role`
- `subscription_tier`
- `subscription_expires_at`

---

## Analytics

Read-only operational view over:
- `exam_results`
- `ai_speaking_attempts`
- `ai_writing_attempts`

Page:
- [`app/(admin)/analytics/page.tsx`](../app/(admin)/analytics/page.tsx)

Current analytics is intentionally simple: server-rendered counts, averages, and score buckets.

---

## Uploads / Media

Storage bucket:
- `cms-assets`

Used by:
- question images/audio
- exercise intro/media assets
- course thumbnails

Files:
- [`components/shared/file-upload-field.tsx`](../components/shared/file-upload-field.tsx)
- [`hooks/use-upload.ts`](../hooks/use-upload.ts)
- [`lib/utils/storage.ts`](../lib/utils/storage.ts)

When changing media behavior, update:
- upload hook
- field component behavior
- storage helpers
- any content JSON field names that embed the public URLs
