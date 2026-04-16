import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { reorderLessons, deleteLesson } from '@/actions/courses'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { LessonListClient } from '@/components/courses/lesson-list-client'
import Link from 'next/link'
import { ChevronLeft, Pencil, Plus } from 'lucide-react'

interface Props {
  params: Promise<{ courseId: string; moduleId: string }>
}

export default async function ModuleDetailPage({ params }: Props) {
  const { courseId, moduleId } = await params
  const supabase = await createClient()

  const { data: mod } = await supabase.from('modules').select('*').eq('id', moduleId).single()
  if (!mod) notFound()

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', moduleId)
    .order('order_index')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/courses/${courseId}`} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{mod.title}</h1>
          {mod.description && <p className="text-sm text-muted-foreground">{mod.description}</p>}
        </div>
        <Link href={`/courses/${courseId}/modules/${moduleId}/edit`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            Sửa module
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Bài học ({lessons?.length ?? 0})</h2>
        <Link href={`/courses/${courseId}/modules/${moduleId}/lessons/new`}>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Thêm bài học
          </Button>
        </Link>
      </div>

      <LessonListClient
        courseId={courseId}
        moduleId={moduleId}
        initialLessons={lessons ?? []}
        reorderAction={reorderLessons}
        deleteAction={deleteLesson}
      />
    </div>
  )
}
