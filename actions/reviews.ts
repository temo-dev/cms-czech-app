'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/server'

export async function updateReviewStatus(id: string, status: 'pending' | 'reviewed' | 'closed') {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('teacher_reviews')
    .update({ status })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/reviews')
  revalidatePath(`/reviews/${id}`)
  return { success: true }
}

export async function addTeacherComment(reviewId: string, body: string, authorName: string) {
  await requireAdmin()
  const supabase = createAdminClient()

  const { data: comment, error } = await supabase
    .from('teacher_comments')
    .insert({
      review_id: reviewId,
      body,
      is_teacher: true,
      author_name: authorName,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  await supabase
    .from('teacher_reviews')
    .update({ status: 'reviewed', unread_count: 1 })
    .eq('id', reviewId)

  revalidatePath(`/reviews/${reviewId}`)
  return { data: comment }
}
