'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/server'
import type { Json } from '@/lib/types/database.types'

export async function createExercise(data: {
  type: string
  skill?: string
  content_json: Json
  xp_reward?: number
  difficulty?: string
  points?: number
}) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data: exercise, error } = await supabase
    .from('exercises')
    .insert({
      type: data.type,
      skill: data.skill ?? null,
      content_json: data.content_json,
      xp_reward: data.xp_reward ?? 10,
      difficulty: data.difficulty ?? null,
      points: data.points ?? 1,
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/exercises')
  return { data: exercise }
}

export async function updateExercise(
  id: string,
  data: {
    type?: string
    skill?: string
    content_json?: Json
    xp_reward?: number
    difficulty?: string
    points?: number
  }
) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data: exercise, error } = await supabase
    .from('exercises')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/exercises')
  revalidatePath(`/exercises/${id}/edit`)
  return { data: exercise }
}

export async function deleteExercise(id: string) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('exercises').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/exercises')
  return { success: true }
}
