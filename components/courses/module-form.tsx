'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { moduleSchema, type ModuleSchema } from '@/lib/validations/course.schema'
import { createModule, updateModule } from '@/actions/courses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import type { Tables } from '@/lib/types/database.types'

interface ModuleFormProps {
  courseId: string
  module?: Tables<'modules'>
  onSaved?: () => void
}

export function ModuleForm({ courseId, module, onSaved }: ModuleFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<ModuleSchema>({
    resolver: zodResolver(moduleSchema),
    defaultValues: module
      ? { course_id: courseId, title: module.title, description: module.description ?? '', order_index: module.order_index, is_locked: module.is_locked }
      : { course_id: courseId, order_index: 0, is_locked: false },
  })

  function onSubmit(data: ModuleSchema) {
    startTransition(async () => {
      const result = module
        ? await updateModule(module.id, courseId, data)
        : await createModule(data)

      if (result && 'error' in result) {
        toast.error(typeof result.error === 'string' ? result.error : 'Lỗi')
      } else {
        toast.success(module ? 'Đã cập nhật' : 'Đã tạo module')
        onSaved?.()
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Tên module *</Label>
        <Input {...form.register('title')} placeholder="Module 1: Giới thiệu..." />
      </div>
      <div className="space-y-1.5">
        <Label>Mô tả</Label>
        <Textarea {...form.register('description')} rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Thứ tự</Label>
          <Input type="number" {...form.register('order_index', { valueAsNumber: true })} />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <Switch checked={form.watch('is_locked')} onCheckedChange={(v) => form.setValue('is_locked', v)} />
          <Label>Khoá (locked)</Label>
        </div>
      </div>
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? 'Đang lưu...' : module ? 'Cập nhật' : 'Tạo module'}
      </Button>
    </form>
  )
}
