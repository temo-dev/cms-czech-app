'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { courseSchema, type CourseSchema } from '@/lib/validations/course.schema'
import { createCourse, updateCourse } from '@/actions/courses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { FileUploadField } from '@/components/shared/file-upload-field'
import type { Tables } from '@/lib/types/database.types'

interface CourseFormProps {
  course?: Tables<'courses'>
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema) as never,
    defaultValues: course
      ? {
        slug: course.slug,
        title: course.title,
        description: course.description ?? '',
        skill: course.skill as CourseSchema['skill'],
        is_premium: course.is_premium,
        thumbnail_url: course.thumbnail_url ?? '',
        order_index: course.order_index,
        instructor_name: course.instructor_name ?? '',
        instructor_bio: course.instructor_bio ?? '',
        duration_days: course.duration_days,
      }
      : { skill: 'reading', is_premium: false, order_index: 0, duration_days: 30 },
  })

  function onSubmit(data: CourseSchema): void {
    startTransition(async () => {
      const result = course
        ? await updateCourse(course.id, data)
        : await createCourse(data)

      if (result && 'error' in result) {
        toast.error(typeof result.error === 'string' ? result.error : 'Lỗi validation')
      } else {
        toast.success(course ? 'Đã cập nhật khóa học' : 'Đã tạo khóa học')
        router.push('/courses')
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Tiêu đề *</Label>
          <Input {...form.register('title')} placeholder="Kỹ năng Đọc..." />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Slug *</Label>
          <Input {...form.register('slug')} placeholder="ky-nang-doc" />
          {form.formState.errors.slug && (
            <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Mô tả</Label>
        <Textarea {...form.register('description')} rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Kỹ năng</Label>
          <Select
            value={form.watch('skill')}
            onValueChange={(v) => form.setValue('skill', v as CourseSchema['skill'])}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="reading">Đọc</SelectItem>
              <SelectItem value="listening">Nghe</SelectItem>
              <SelectItem value="writing">Viết</SelectItem>
              <SelectItem value="speaking">Nói</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Thời gian (ngày)</Label>
          <Input type="number" {...form.register('duration_days', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Thumbnail</Label>
        <FileUploadField
          accept="image/*"
          storagePath={(file) => `thumbnails/${Date.now()}-${file.name}`}
          currentUrl={form.watch('thumbnail_url')}
          onUploadComplete={(url) => form.setValue('thumbnail_url', url)}
          label="Upload ảnh thumbnail"
        />
        <Input {...form.register('thumbnail_url')} placeholder="hoặc nhập URL..." className="mt-2" disabled />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Tên giáo viên</Label>
          <Input {...form.register('instructor_name')} />
        </div>
        <div className="space-y-1.5">
          <Label>Thứ tự</Label>
          <Input type="number" {...form.register('order_index', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Tiểu sử giáo viên</Label>
        <Textarea {...form.register('instructor_bio')} rows={2} />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={form.watch('is_premium')}
          onCheckedChange={(v) => form.setValue('is_premium', v)}
        />
        <Label>Khóa học Premium</Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Đang lưu...' : course ? 'Cập nhật' : 'Tạo khóa học'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Huỷ</Button>
      </div>
    </form>
  )
}
