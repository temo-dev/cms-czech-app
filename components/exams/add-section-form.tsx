'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { examSectionSchema, type ExamSectionSchema } from '@/lib/validations/exam.schema'
import { createExamSection } from '@/actions/exams'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X } from 'lucide-react'

const SKILL_OPTIONS = [
  { value: 'reading',   label: 'Đọc hiểu (Čtení)' },
  { value: 'listening', label: 'Nghe hiểu (Poslech)' },
  { value: 'writing',   label: 'Viết (Psaní)' },
  { value: 'speaking',  label: 'Nói (Mluvení)' },
] as const

interface AddSectionFormProps {
  examId: string
  nextOrderIndex: number
}

export function AddSectionForm({ examId, nextOrderIndex }: AddSectionFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<ExamSectionSchema>({
    resolver: zodResolver(examSectionSchema),
    defaultValues: {
      exam_id: examId,
      skill: 'reading',
      label: '',
      question_count: 10,
      section_duration_minutes: null,
      order_index: nextOrderIndex,
    },
  })

  function onSubmit(data: ExamSectionSchema) {
    startTransition(async () => {
      const result = await createExamSection(data)
      if (result && 'error' in result) {
        toast.error(typeof result.error === 'string' ? result.error : 'Lỗi')
      } else {
        toast.success('Đã thêm section')
        form.reset({ exam_id: examId, skill: 'reading', label: '', question_count: 10, section_duration_minutes: null, order_index: nextOrderIndex + 1 })
        setOpen(false)
        router.refresh()
      }
    })
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Thêm section
      </Button>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="border rounded-lg p-4 space-y-4 bg-muted/30">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Section mới</p>
        <button type="button" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Kỹ năng</Label>
          <select
            {...form.register('skill')}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            onChange={(e) => {
              const skill = e.target.value as ExamSectionSchema['skill']
              form.setValue('skill', skill)
              const preset = SKILL_OPTIONS.find(o => o.value === skill)
              if (preset) form.setValue('label', preset.label)
            }}
          >
            {SKILL_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.value}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label>Số câu hỏi</Label>
          <Input
            type="number"
            {...form.register('question_count', { valueAsNumber: true })}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Tên section (hiển thị)</Label>
        <Input {...form.register('label')} placeholder="Đọc hiểu (Čtení)..." />
      </div>

      <div className="space-y-1.5">
        <Label>Thời gian riêng (phút) — để trống nếu dùng chung</Label>
        <Input
          type="number"
          {...form.register('section_duration_minutes', {
            setValueAs: v => v === '' ? null : Number(v),
          })}
          placeholder="—"
          className="w-32"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Đang lưu...' : 'Thêm'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>Huỷ</Button>
      </div>
    </form>
  )
}
