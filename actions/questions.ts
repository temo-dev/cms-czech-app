'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/server'
import { questionSchema, type QuestionSchema } from '@/lib/validations/question.schema'

export async function createQuestion(data: QuestionSchema) {
  await requireAdmin()
  const parsed = questionSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = createAdminClient()
  const { options, ...questionData } = parsed.data

  const { data: question, error } = await supabase
    .from('questions')
    .insert(questionData)
    .select()
    .single()

  if (error) return { error: error.message }

  if (options && options.length > 0) {
    const { error: optError } = await supabase.from('question_options').insert(
      options.map((opt, idx) => ({
        ...opt,
        question_id: question.id,
        order_index: idx,
      }))
    )
    if (optError) return { error: optError.message }
  }

  revalidatePath('/questions')
  return { data: question }
}

export async function updateQuestion(id: string, data: QuestionSchema) {
  await requireAdmin()
  const parsed = questionSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = createAdminClient()
  const { options, ...questionData } = parsed.data

  const { data: question, error } = await supabase
    .from('questions')
    .update(questionData)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  if (options !== undefined) {
    await supabase.from('question_options').delete().eq('question_id', id)
    if (options.length > 0) {
      await supabase.from('question_options').insert(
        options.map((opt, idx) => ({
          ...opt,
          question_id: id,
          order_index: idx,
        }))
      )
    }
  }

  revalidatePath('/questions')
  revalidatePath(`/questions/${id}/edit`)
  return { data: question }
}

export async function deleteQuestion(id: string) {
  await requireAdmin()
  const supabase = createAdminClient()
  await supabase.from('question_options').delete().eq('question_id', id)
  const { error } = await supabase.from('questions').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/questions')
  return { success: true }
}

export async function bulkImportQuestions(
  questions: Array<{
    type: string
    skill?: string
    prompt: string
    options?: Array<{ text: string; isCorrect: boolean }>
    correctAnswer?: string
    explanation?: string
    points?: number
    section_id?: string
  }>
) {
  await requireAdmin()
  const supabase = createAdminClient()

  const results = { success: 0, errors: [] as string[] }

  for (const q of questions) {
    const { data: question, error } = await supabase
      .from('questions')
      .insert({
        type: q.type,
        skill: q.skill ?? null,
        prompt: q.prompt,
        correct_answer: q.correctAnswer ?? null,
        explanation: q.explanation ?? null,
        points: q.points ?? 1,
        section_id: q.section_id ?? null,
        order_index: 0,
      })
      .select()
      .single()

    if (error) {
      results.errors.push(`"${q.prompt.slice(0, 30)}...": ${error.message}`)
      continue
    }

    if (q.options && q.options.length > 0) {
      await supabase.from('question_options').insert(
        q.options.map((opt, idx) => ({
          id: crypto.randomUUID(),
          question_id: question.id,
          text: opt.text,
          is_correct: opt.isCorrect,
          order_index: idx,
        }))
      )
    }

    results.success++
  }

  revalidatePath('/questions')
  return results
}

export async function assignQuestionToSection(questionId: string, sectionId: string, orderIndex: number) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('questions')
    .update({ section_id: sectionId, order_index: orderIndex })
    .eq('id', questionId)

  if (error) return { error: error.message }
  revalidatePath('/exams')
  return { success: true }
}

export async function removeQuestionFromSection(questionId: string) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('questions')
    .update({ section_id: null })
    .eq('id', questionId)

  if (error) return { error: error.message }
  revalidatePath('/exams')
  return { success: true }
}
