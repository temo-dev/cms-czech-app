'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type UploadState = 'idle' | 'uploading' | 'done' | 'error'

const BUCKET = 'cms-assets'

export function useUpload() {
  const [state, setState] = useState<UploadState>('idle')
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function upload(file: File, path: string): Promise<string | null> {
    setState('uploading')
    setError(null)
    const supabase = createClient()

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setState('error')
      setError(uploadError.message)
      return null
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)
    setState('done')
    setUrl(publicUrl)
    return publicUrl
  }

  function reset() {
    setState('idle')
    setUrl(null)
    setError(null)
  }

  return { upload, state, url, error, reset }
}
