'use client'
import { useState, useTransition } from 'react'
import { useForm, FormProvider, useFieldArray } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createExercise, updateExercise } from '@/actions/exercises'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, CheckCircle2, Circle, GripVertical } from 'lucide-react'
import { FileUploadField } from '@/components/shared/file-upload-field'
import type { Tables } from '@/lib/types/database.types'
import type { Json } from '@/lib/types/database.types'

type ExerciseType = 'mcq' | 'fill_blank' | 'matching' | 'ordering' | 'speaking' | 'writing' | 'vocab' | 'grammar' | 'reading' | 'listening'

interface ExerciseFormValues {
  type: ExerciseType
  skill: string
  difficulty: string
  xp_reward: number
  points: number
  intro_text: string
  intro_image_url: string
  prompt: string
  image_url: string
  audio_url: string
  explanation: string
  // MCQ / vocab / grammar / reading / listening
  options: Array<{ id: string; text: string; isCorrect: boolean; imageUrl?: string }>
  // fill_blank
  correctAnswer: string
  // matching
  pairs: Array<{ leftId: string; leftText: string; rightId: string; rightText: string }>
  // ordering
  items: Array<{ id: string; text: string }>
}

interface ExerciseFormProps {
  exercise?: Tables<'exercises'>
  onSaved?: (exercise: Tables<'exercises'>) => void
}

const MCQ_TYPES: ExerciseType[] = ['mcq', 'vocab', 'grammar', 'reading', 'listening']

export function ExerciseForm({ exercise, onSaved }: ExerciseFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const existingContent = exercise?.content_json as Record<string, unknown> | null

  const form = useForm<ExerciseFormValues>({
    defaultValues: exercise
      ? {
          type: exercise.type as ExerciseType,
          skill: exercise.skill ?? '',
          difficulty: exercise.difficulty ?? 'beginner',
          xp_reward: exercise.xp_reward,
          points: exercise.points,
          intro_text: (existingContent?.intro_text as string) ?? '',
          intro_image_url: (existingContent?.intro_image_url as string) ?? '',
          prompt: (existingContent?.prompt as string) ?? '',
          image_url: (existingContent?.image_url as string) ?? '',
          audio_url: (existingContent?.audio_url as string) ?? '',
          explanation: (existingContent?.explanation as string) ?? '',
          correctAnswer: (existingContent?.correctAnswer as string) ?? '',
          options: ((existingContent?.options as Array<Record<string, unknown>>) ?? []).map((o) => ({
            id: (o.id as string) ?? crypto.randomUUID(),
            text: (o.text as string) ?? '',
            isCorrect: (o.is_correct as boolean) ?? false,
            imageUrl: (o.image_url as string | undefined),
          })),
          pairs: (existingContent?.pairs as ExerciseFormValues['pairs']) ?? [],
          items: (existingContent?.items as ExerciseFormValues['items']) ?? [],
        }
      : {
          type: 'mcq',
          skill: '',
          difficulty: 'beginner',
          xp_reward: 10,
          points: 1,
          intro_text: '',
          intro_image_url: '',
          prompt: '',
          image_url: '',
          audio_url: '',
          explanation: '',
          correctAnswer: '',
          options: [
            { id: crypto.randomUUID(), text: '', isCorrect: true },
            { id: crypto.randomUUID(), text: '', isCorrect: false },
          ],
          pairs: [],
          items: [],
        },
  })

  const exerciseType = form.watch('type')
  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({ control: form.control, name: 'options' })
  const { fields: pairFields, append: appendPair, remove: removePair } = useFieldArray({ control: form.control, name: 'pairs' })
  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({ control: form.control, name: 'items' })
  const options = form.watch('options')

  function buildContentJson(data: ExerciseFormValues): Json {
    const base = {
      ...(data.intro_text ? { intro_text: data.intro_text } : {}),
      ...(data.intro_image_url ? { intro_image_url: data.intro_image_url } : {}),
      prompt: data.prompt,
      ...(data.image_url ? { image_url: data.image_url } : {}),
    }
    if (MCQ_TYPES.includes(data.type as ExerciseType)) {
      return {
        ...base,
        ...(data.audio_url ? { audio_url: data.audio_url } : {}),
        options: data.options.map((o) => ({
          id: o.id,
          text: o.text,
          is_correct: o.isCorrect,
          ...(o.imageUrl ? { image_url: o.imageUrl } : {}),
        })),
        explanation: data.explanation,
      }
    }
    if (data.type === 'fill_blank') {
      return { ...base, correctAnswer: data.correctAnswer, explanation: data.explanation }
    }
    if (data.type === 'matching') {
      return { ...base, pairs: data.pairs, explanation: data.explanation }
    }
    if (data.type === 'ordering') {
      return { ...base, items: data.items, explanation: data.explanation }
    }
    return base
  }

  function onSubmit(data: ExerciseFormValues) {
    startTransition(async () => {
      const payload = {
        type: data.type,
        skill: data.skill || undefined,
        difficulty: data.difficulty || undefined,
        xp_reward: data.xp_reward,
        points: data.points,
        content_json: buildContentJson(data),
      }

      const result = exercise
        ? await updateExercise(exercise.id, payload)
        : await createExercise(payload)

      if (result && 'error' in result) {
        toast.error(typeof result.error === 'string' ? result.error : 'Lỗi khi lưu')
      } else if (result?.data) {
        toast.success(exercise ? 'Đã cập nhật bài tập' : 'Đã tạo bài tập')
        if (onSaved) {
          onSaved(result.data as Tables<'exercises'>)
        } else {
          router.push('/exercises')
        }
      }
    })
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Loại bài tập</Label>
            <Select value={exerciseType} onValueChange={(v) => form.setValue('type', v as ExerciseType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mcq">Trắc nghiệm</SelectItem>
                <SelectItem value="fill_blank">Điền vào chỗ trống</SelectItem>
                <SelectItem value="matching">Nối cặp</SelectItem>
                <SelectItem value="ordering">Sắp xếp</SelectItem>
                <SelectItem value="speaking">Nói (AI)</SelectItem>
                <SelectItem value="writing">Viết (AI)</SelectItem>
                <SelectItem value="vocab">Từ vựng</SelectItem>
                <SelectItem value="grammar">Ngữ pháp</SelectItem>
                <SelectItem value="reading">Đọc hiểu</SelectItem>
                <SelectItem value="listening">Nghe hiểu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Độ khó</Label>
            <Select value={form.watch('difficulty')} onValueChange={(v) => form.setValue('difficulty', v ?? 'beginner')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Cơ bản</SelectItem>
                <SelectItem value="intermediate">Trung cấp</SelectItem>
                <SelectItem value="advanced">Nâng cao</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border border-dashed p-4 space-y-3 bg-muted/30">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phần Intro (tuỳ chọn — hiển thị trên câu hỏi)</p>
          <div className="space-y-1.5">
            <Label>Văn bản intro</Label>
            <Textarea
              {...form.register('intro_text')}
              rows={3}
              placeholder="Đoạn văn / ngữ cảnh cho người học đọc trước khi trả lời..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Ảnh intro</Label>
            <FileUploadField
              accept="image/*"
              storagePath={(file) => `exercises/intro/${crypto.randomUUID()}-${file.name}`}
              currentUrl={form.watch('intro_image_url')}
              onUploadComplete={(url) => form.setValue('intro_image_url', url || '')}
              label="Tải ảnh intro"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Prompt / Câu hỏi {exerciseType === 'fill_blank' && <span className="text-muted-foreground text-xs">(dùng {'{blank}'} cho chỗ trống)</span>}</Label>
          <Textarea {...form.register('prompt')} rows={3} placeholder="Nhập nội dung bài tập..." />
        </div>

        {exerciseType === 'listening' && (
          <div className="space-y-1.5">
            <Label>Audio</Label>
            <FileUploadField
              accept="audio/*"
              storagePath={(file) => `exercises/audio/${crypto.randomUUID()}-${file.name}`}
              currentUrl={form.watch('audio_url')}
              onUploadComplete={(url) => form.setValue('audio_url', url || '')}
              label="Tải audio lên"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label>Ảnh câu hỏi (tuỳ chọn)</Label>
          <FileUploadField
            accept="image/*"
            storagePath={(file) => `exercises/${crypto.randomUUID()}-${file.name}`}
            currentUrl={form.watch('image_url')}
            onUploadComplete={(url) => form.setValue('image_url', url || '')}
            label="Tải ảnh lên"
          />
        </div>

        {MCQ_TYPES.includes(exerciseType as ExerciseType) && (
          <div className="space-y-2">
            <Label>Đáp án (click để chọn đúng/sai)</Label>
            {optionFields.map((field, idx) => (
              <div key={field.id} className="flex items-start gap-2">
                <button type="button" className="shrink-0 mt-2" onClick={() => {
                  options.forEach((_, i) => form.setValue(`options.${i}.isCorrect`, false))
                  form.setValue(`options.${idx}.isCorrect`, !options[idx]?.isCorrect)
                }}>
                  {options[idx]?.isCorrect
                    ? <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    : <Circle className="h-5 w-5 text-muted-foreground" />}
                </button>
                <div className="flex-1 space-y-1.5">
                  <Input {...form.register(`options.${idx}.text`)} placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`} />
                  <FileUploadField
                    accept="image/*"
                    storagePath={(file) => `exercises/options/${crypto.randomUUID()}-${file.name}`}
                    currentUrl={options[idx]?.imageUrl}
                    onUploadComplete={(url) => form.setValue(`options.${idx}.imageUrl`, url || undefined)}
                    label="Thêm ảnh đáp án"
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 mt-1" onClick={() => removeOption(idx)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="gap-1.5"
              onClick={() => appendOption({ id: crypto.randomUUID(), text: '', isCorrect: false })}>
              <Plus className="h-3.5 w-3.5" />Thêm đáp án
            </Button>
          </div>
        )}

        {exerciseType === 'fill_blank' && (
          <div className="space-y-1.5">
            <Label>Đáp án đúng</Label>
            <Input {...form.register('correctAnswer')} placeholder="Câu trả lời chính xác..." />
          </div>
        )}

        {exerciseType === 'matching' && (
          <div className="space-y-2">
            <Label>Cặp nối</Label>
            {pairFields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-2 gap-2 items-center">
                <Input {...form.register(`pairs.${idx}.leftText`)} placeholder="Cột trái" />
                <div className="flex gap-2">
                  <Input {...form.register(`pairs.${idx}.rightText`)} placeholder="Cột phải" className="flex-1" />
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removePair(idx)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="gap-1.5"
              onClick={() => appendPair({ leftId: crypto.randomUUID(), leftText: '', rightId: crypto.randomUUID(), rightText: '' })}>
              <Plus className="h-3.5 w-3.5" />Thêm cặp
            </Button>
          </div>
        )}

        {exerciseType === 'ordering' && (
          <div className="space-y-2">
            <Label>Các mục cần sắp xếp (theo thứ tự đúng)</Label>
            {itemFields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs w-5 text-center text-muted-foreground">{idx + 1}</span>
                <Input {...form.register(`items.${idx}.text`)} placeholder={`Mục ${idx + 1}`} className="flex-1" />
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(idx)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="gap-1.5"
              onClick={() => appendItem({ id: crypto.randomUUID(), text: '' })}>
              <Plus className="h-3.5 w-3.5" />Thêm mục
            </Button>
          </div>
        )}

        {exerciseType !== 'speaking' && exerciseType !== 'writing' && (
          <div className="space-y-1.5">
            <Label>Giải thích</Label>
            <Textarea {...form.register('explanation')} rows={2} placeholder="Giải thích đáp án..." />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>XP thưởng</Label>
            <Input type="number" {...form.register('xp_reward', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Điểm</Label>
            <Input type="number" {...form.register('points', { valueAsNumber: true })} />
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Đang lưu...' : exercise ? 'Cập nhật' : 'Tạo bài tập'}
          </Button>
          {!onSaved && (
            <Button type="button" variant="outline" onClick={() => router.back()}>Huỷ</Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
