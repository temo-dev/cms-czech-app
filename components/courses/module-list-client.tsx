'use client'
import { useReorder } from '@/hooks/use-reorder'
import { SortableList, SortableItem } from '@/components/shared/sortable-list'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, ChevronRight, Lock } from 'lucide-react'
import Link from 'next/link'
import type { Tables } from '@/lib/types/database.types'

interface ModuleListClientProps {
  courseId: string
  initialModules: Tables<'modules'>[]
  reorderAction: (updates: { id: string; order_index: number }[]) => Promise<void>
  deleteAction: (id: string, courseId: string) => Promise<{ success?: boolean; error?: string }>
}

export function ModuleListClient({ courseId, initialModules, reorderAction, deleteAction }: ModuleListClientProps) {
  const { items: modules, handleDragEnd } = useReorder(initialModules, reorderAction)

  if (modules.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">Chưa có module nào. Thêm module đầu tiên!</p>
      </div>
    )
  }

  return (
    <SortableList
      items={modules}
      onDragEnd={handleDragEnd}
      renderItem={(id) => {
        const mod = modules.find((m) => m.id === id)
        if (!mod) return null
        return (
          <SortableItem key={id} id={id}>
            <Card>
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{mod.title}</span>
                    {mod.is_locked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                  </div>
                  {mod.description && (
                    <p className="text-xs text-muted-foreground truncate">{mod.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/courses/${courseId}/modules/${mod.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
                      Bài học
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link href={`/courses/${courseId}/modules/${mod.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <ConfirmDialog onConfirm={() => deleteAction(mod.id, courseId)} />
                </div>
              </CardContent>
            </Card>
          </SortableItem>
        )
      }}
    />
  )
}
