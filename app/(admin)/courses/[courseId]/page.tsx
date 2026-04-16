import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { reorderModules, deleteModule } from '@/actions/courses'
import { SkillBadge } from '@/components/shared/skill-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { ModuleListClient } from '@/components/courses/module-list-client'
import Link from 'next/link'
import { ChevronLeft, Pencil, Plus } from 'lucide-react'

interface Props {
  params: Promise<{ courseId: string }>
}

export default async function CourseDetailPage({ params }: Props) {
  const { courseId } = await params
  const supabase = await createClient()

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single()

  if (!course) notFound()

  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/courses" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <SkillBadge value={course.skill} />
            {course.is_premium && <Badge>Premium</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{course.slug}</p>
        </div>
        <Link href={`/courses/${courseId}/edit`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            Sửa
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Modules ({modules?.length ?? 0})</h2>
        <Link href={`/courses/${courseId}/modules/new`}>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Thêm module
          </Button>
        </Link>
      </div>

      <ModuleListClient
        courseId={courseId}
        initialModules={modules ?? []}
        reorderAction={reorderModules}
        deleteAction={deleteModule}
      />
    </div>
  )
}
