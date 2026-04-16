'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { examSchema, type ExamSchema } from '@/lib/validations/exam.schema'
import { createExam, updateExam } from '@/actions/exams'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { Tables } from '@/lib/types/database.types'

interface ExamFormProps {
  exam?: Tables<'exams'>
}

export function ExamForm({ exam }: ExamFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
    defaultValues: exam
      ? { title: exam.title, duration_minutes: exam.duration_minutes, is_active: exam.is_active }
      : { duration_minutes: 60, is_active: false },
  })

  function onSubmit(data: ExamSchema) {
    startTransition(async () => {
      const result = exam ? await updateExam(exam.id, data) : await createExam(data)
      if (result && 'error' in result) {
        toast.error(typeof result.error === 'string' ? result.error : 'Lỗi')
      } else {
        toast.success(exam ? 'Đã cập nhật' : 'Đã tạo đề thi')
        if (!exam && result.data) {
          router.push(`/exams/${result.data.id}`)
        } else {
          router.push('/exams')
        }
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label>Tên đề thi *</Label>
        <Input {...form.register('title')} placeholder="Mock Test 1..." />
      </div>
      <div className="space-y-1.5">
        <Label>Thời gian (phút)</Label>
        <Input type="number" {...form.register('duration_minutes', { valueAsNumber: true })} className="w-32" />
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={form.watch('is_active')}
          onCheckedChange={(v) => form.setValue('is_active', v)}
        />
        <Label>Kích hoạt (hiển thị cho học viên)</Label>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Đang lưu...' : exam ? 'Cập nhật' : 'Tạo đề thi'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Huỷ</Button>
      </div>
    </form>
  )
}
