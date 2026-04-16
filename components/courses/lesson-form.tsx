'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { lessonSchema, type LessonSchema } from '@/lib/validations/course.schema'
import { createLesson, updateLesson } from '@/actions/courses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Tables } from '@/lib/types/database.types'

interface LessonFormProps {
  moduleId: string
  lesson?: Tables<'lessons'>
  onSaved?: () => void
}

export function LessonForm({ moduleId, lesson, onSaved }: LessonFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema) as never,
    defaultValues: lesson
      ? { module_id: moduleId, title: lesson.title, description: lesson.description ?? '', duration_minutes: lesson.duration_minutes, order_index: lesson.order_index, bonus_xp_cost: lesson.bonus_xp_cost }
      : { module_id: moduleId, duration_minutes: 15, order_index: 0, bonus_xp_cost: 50 },
  })

  function onSubmit(data: LessonSchema): void {
    startTransition(async () => {
      const result = lesson
        ? await updateLesson(lesson.id, data)
        : await createLesson(data)

      if (result && 'error' in result) {
        toast.error(typeof result.error === 'string' ? result.error : 'Lỗi')
      } else {
        toast.success(lesson ? 'Đã cập nhật' : 'Đã tạo bài học')
        onSaved?.()
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Tên bài học *</Label>
        <Input {...form.register('title')} placeholder="Bài 1: ..." />
      </div>
      <div className="space-y-1.5">
        <Label>Mô tả</Label>
        <Textarea {...form.register('description')} rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Thời gian (phút)</Label>
          <Input type="number" {...form.register('duration_minutes', { valueAsNumber: true })} />
        </div>
        <div className="space-y-1.5">
          <Label>Thứ tự</Label>
          <Input type="number" {...form.register('order_index', { valueAsNumber: true })} />
        </div>
      </div>
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? 'Đang lưu...' : lesson ? 'Cập nhật' : 'Tạo bài học'}
      </Button>
    </form>
  )
}
