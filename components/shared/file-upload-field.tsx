'use client'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useUpload } from '@/hooks/use-upload'
import { Upload, X, Image as ImageIcon, Music } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadFieldProps {
  accept?: string
  bucket?: 'cms-assets'
  storagePath: (file: File) => string
  currentUrl?: string | null
  onUploadComplete: (url: string) => void
  label?: string
}

export function FileUploadField({
  accept = 'image/*',
  storagePath,
  currentUrl,
  onUploadComplete,
  label = 'Upload file',
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { upload, state } = useUpload()
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const isImage = accept.includes('image')

  async function handleFile(file: File) {
    const path = storagePath(file)
    if (isImage) setPreview(URL.createObjectURL(file))
    const url = await upload(file, path)
    if (url) onUploadComplete(url)
  }

  return (
    <div className="space-y-2">
      {preview && isImage && (
        <div className="relative w-32 h-20 rounded-md overflow-hidden border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white"
            onClick={() => { setPreview(null); onUploadComplete('') }}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      {preview && !isImage && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Music className="h-4 w-4" />
          <span className="truncate max-w-48">{preview}</span>
          <button type="button" onClick={() => { setPreview(null); onUploadComplete('') }}>
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn('gap-2', state === 'uploading' && 'opacity-50 pointer-events-none')}
          onClick={() => inputRef.current?.click()}
        >
          {isImage ? <ImageIcon className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
          {state === 'uploading' ? 'Đang tải...' : label}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
      </div>
      {state === 'uploading' && <Progress value={null} className="h-1 w-32" />}
      {state === 'error' && <p className="text-xs text-destructive">Tải lên thất bại</p>}
    </div>
  )
}
