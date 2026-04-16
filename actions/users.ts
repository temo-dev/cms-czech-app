'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/server'

export async function updateUserRole(userId: string, role: 'learner' | 'teacher' | 'admin') {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) return { error: error.message }
  revalidatePath('/users')
  revalidatePath(`/users/${userId}`)
  return { success: true }
}

export async function updateUserSubscription(
  userId: string,
  tier: string,
  expiresAt: string | null
) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('profiles')
    .update({ subscription_tier: tier, subscription_expires_at: expiresAt })
    .eq('id', userId)

  if (error) return { error: error.message }
  revalidatePath(`/users/${userId}`)
  return { success: true }
}
