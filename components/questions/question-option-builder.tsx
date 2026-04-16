'use client'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { FileUploadField } from '@/components/shared/file-upload-field'

export function QuestionOptionBuilder({ name = 'options' }: { name?: string }) {
  const { register, watch, setValue } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name })
  const options = watch(name) as Array<{ id: string; text: string; is_correct: boolean; image_url?: string }>

  return (
    <div className="space-y-3">
      {fields.map((field, idx) => (
        <div key={field.id} className="flex items-start gap-2">
          <button
            type="button"
            className="shrink-0 text-muted-foreground mt-2"
            onClick={() => {
              options.forEach((_, i) => setValue(`${name}.${i}.is_correct`, false))
              setValue(`${name}.${idx}.is_correct`, !options[idx]?.is_correct)
            }}
          >
            {options[idx]?.is_correct
              ? <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              : <Circle className="h-5 w-5" />}
          </button>
          <div className="flex-1 space-y-1.5">
            <Input
              {...register(`${name}.${idx}.text`)}
              placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
            />
            <FileUploadField
              accept="image/*"
              storagePath={(file) => `questions/options/${crypto.randomUUID()}-${file.name}`}
              currentUrl={options[idx]?.image_url}
              onUploadComplete={(url) => setValue(`${name}.${idx}.image_url`, url || undefined)}
              label="Thêm ảnh đáp án"
            />
          </div>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground mt-1" onClick={() => remove(idx)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => append({ id: crypto.randomUUID(), text: '', is_correct: false, order_index: fields.length, image_url: undefined })}
      >
        <Plus className="h-3.5 w-3.5" />
        Thêm đáp án
      </Button>
    </div>
  )
}
