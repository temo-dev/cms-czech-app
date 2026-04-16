'use client'
import { useReorder } from '@/hooks/use-reorder'
import { SortableList, SortableItem } from '@/components/shared/sortable-list'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Tables } from '@/lib/types/database.types'

interface LessonListClientProps {
  courseId: string
  moduleId: string
  initialLessons: Tables<'lessons'>[]
  reorderAction: (updates: { id: string; order_index: number }[]) => Promise<void>
  deleteAction: (id: string) => Promise<{ success?: boolean; error?: string }>
}

export function LessonListClient({ courseId, moduleId, initialLessons, reorderAction, deleteAction }: LessonListClientProps) {
  const { items: lessons, handleDragEnd } = useReorder(initialLessons, reorderAction)

  if (lessons.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">Chưa có bài học. Thêm bài học đầu tiên!</p>
      </div>
    )
  }

  return (
    <SortableList
      items={lessons}
      onDragEnd={handleDragEnd}
      renderItem={(id) => {
        const lesson = lessons.find((l) => l.id === id)
        if (!lesson) return null
        return (
          <SortableItem key={id} id={id}>
            <Card>
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <span className="font-medium truncate block">{lesson.title}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Clock className="h-3 w-3" />
                    <span>{lesson.duration_minutes} phút</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
                      6 blocks
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link href={`/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <ConfirmDialog onConfirm={() => deleteAction(lesson.id)} />
                </div>
              </CardContent>
            </Card>
          </SortableItem>
        )
      }}
    />
  )
}
