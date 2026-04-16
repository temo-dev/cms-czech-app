'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/server'
import { courseSchema, moduleSchema, lessonSchema } from '@/lib/validations/course.schema'
import { batchUpdateOrderIndex } from '@/lib/utils/reorder'

// ── Courses ──────────────────────────────────────────────

export async function createCourse(data: unknown) {
  await requireAdmin()
  const parsed = courseSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = createAdminClient()
  const { data: course, error } = await supabase
    .from('courses').insert(parsed.data).select().single()

  if (error) return { error: error.message }
  revalidatePath('/courses')
  return { data: course }
}

export async function updateCourse(id: string, data: unknown) {
  await requireAdmin()
  const parsed = courseSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = createAdminClient()
  const { data: course, error } = await supabase
    .from('courses').update(parsed.data).eq('id', id).select().single()

  if (error) return { error: error.message }
  revalidatePath('/courses')
  revalidatePath(`/courses/${id}`)
  return { data: course }
}

export async function deleteCourse(id: string) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/courses')
  return { success: true }
}

// ── Modules ──────────────────────────────────────────────

export async function createModule(data: unknown) {
  await requireAdmin()
  const parsed = moduleSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = createAdminClient()
  const { data: mod, error } = await supabase
    .from('modules').insert(parsed.data).select().single()

  if (error) return { error: error.message }
  revalidatePath(`/courses/${parsed.data.course_id}`)
  return { data: mod }
}

export async function updateModule(id: string, courseId: string, data: unknown) {
  await requireAdmin()
  const parsed = moduleSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = createAdminClient()
  const { data: mod, error } = await supabase
    .from('modules').update(parsed.data).eq('id', id).select().single()

  if (error) return { error: error.message }
  revalidatePath(`/courses/${courseId}`)
  return { data: mod }
}

export async function deleteModule(id: string, courseId: string) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('modules').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/courses/${courseId}`)
  return { success: true }
}

export async function reorderModules(updates: { id: string; order_index: number }[]) {
  await requireAdmin()
  await batchUpdateOrderIndex('modules', updates)
}

// ── Lessons ──────────────────────────────────────────────

export async function createLesson(data: unknown) {
  await requireAdmin()
  const parsed = lessonSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = createAdminClient()
  const { data: lesson, error } = await supabase
    .from('lessons').insert(parsed.data).select().single()

  if (error) return { error: error.message }
  return { data: lesson }
}

export async function updateLesson(id: string, data: unknown) {
  await requireAdmin()
  const parsed = lessonSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = createAdminClient()
  const { data: lesson, error } = await supabase
    .from('lessons').update(parsed.data).eq('id', id).select().single()

  if (error) return { error: error.message }
  revalidatePath(`/courses`)
  return { data: lesson }
}

export async function deleteLesson(id: string) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('lessons').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}

export async function reorderLessons(updates: { id: string; order_index: number }[]) {
  await requireAdmin()
  await batchUpdateOrderIndex('lessons', updates)
}

// ── Lesson Blocks ─────────────────────────────────────────

export async function updateLessonBlock(id: string, data: { order_index?: number; type?: string }) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data: block, error } = await supabase
    .from('lesson_blocks').update(data).eq('id', id).select().single()

  if (error) return { error: error.message }
  return { data: block }
}

export async function reorderLessonBlocks(updates: { id: string; order_index: number }[]) {
  await requireAdmin()
  await batchUpdateOrderIndex('lesson_blocks', updates)
}

export async function createLessonBlock(data: { lesson_id: string; type: string; order_index: number }) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data: block, error } = await supabase
    .from('lesson_blocks').insert(data).select().single()

  if (error) return { error: error.message }
  return { data: block }
}

export async function addExerciseToBlock(blockId: string, exerciseId: string, orderIndex: number) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('lesson_block_exercises')
    .insert({ block_id: blockId, exercise_id: exerciseId, order_index: orderIndex })

  if (error) return { error: error.message }
  return { success: true }
}

export async function removeExerciseFromBlock(blockId: string, exerciseId: string) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('lesson_block_exercises')
    .delete()
    .eq('block_id', blockId)
    .eq('exercise_id', exerciseId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteLessonBlock(id: string) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('lesson_blocks').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}
