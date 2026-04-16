import { createAdminClient } from '@/lib/supabase/admin'

export const STORAGE_BUCKET = 'cms-assets'

export async function deleteStorageFile(path: string) {
  const supabase = createAdminClient()
  await supabase.storage.from(STORAGE_BUCKET).remove([path])
}

export function getPublicUrl(path: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${url}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`
}

export function extractStoragePath(publicUrl: string): string | null {
  const marker = `/${STORAGE_BUCKET}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return null
  return publicUrl.slice(idx + marker.length)
}
