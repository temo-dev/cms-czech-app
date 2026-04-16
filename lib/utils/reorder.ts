import { createAdminClient } from '@/lib/supabase/admin'

export async function batchUpdateOrderIndex(
  table: string,
  updates: { id: string; order_index: number }[]
) {
  const supabase = createAdminClient()
  await Promise.all(
    updates.map(({ id, order_index }) =>
      supabase.from(table as never).update({ order_index } as never).eq('id', id)
    )
  )
}
