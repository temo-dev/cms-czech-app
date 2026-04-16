'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/server'
import { examSchema, examSectionSchema } from '@/lib/validations/exam.schema'
import { batchUpdateOrderIndex } from '@/lib/utils/reorder'

export async function createExam(data: unknown) {
  await requireAdmin()
  const parsed = examSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = createAdminClient()
  const { data: exam, error } = await supabase
    .from('exams').insert(parsed.data).select().single()

  if (error) return { error: error.message }
  revalidatePath('/exams')
  return { data: exam }
}

export async function updateExam(id: string, data: unknown) {
  await requireAdmin()
  const parsed = examSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = createAdminClient()
  const { data: exam, error } = await supabase
    .from('exams').update(parsed.data).eq('id', id).select().single()

  if (error) return { error: error.message }
  revalidatePath('/exams')
  revalidatePath(`/exams/${id}`)
  return { data: exam }
}

export async function deleteExam(id: string) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('exams').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/exams')
  return { success: true }
}

export async function createExamSection(data: unknown) {
  await requireAdmin()
  const parsed = examSectionSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = createAdminClient()
  const { data: section, error } = await supabase
    .from('exam_sections').insert(parsed.data).select().single()

  if (error) return { error: error.message }
  revalidatePath(`/exams/${parsed.data.exam_id}`)
  return { data: section }
}

export async function reorderSectionQuestions(updates: { id: string; order_index: number }[]) {
  await requireAdmin()
  await batchUpdateOrderIndex('questions', updates)
}
