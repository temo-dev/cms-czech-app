'use client'
import { useReorder } from '@/hooks/use-reorder'
import { SortableList, SortableItem } from '@/components/shared/sortable-list'
import { LessonBlockEditor } from './lesson-block-editor'
import type { Tables } from '@/lib/types/database.types'

export type LessonBlock = Tables<'lesson_blocks'> & {
  exercises: Tables<'exercises'>[]
}

interface LessonBlocksClientProps {
  initialBlocks: LessonBlock[]
  reorderAction: (updates: { id: string; order_index: number }[]) => Promise<void>
}

export function LessonBlocksClient({ initialBlocks, reorderAction }: LessonBlocksClientProps) {
  const { items: blocks, handleDragEnd } = useReorder(initialBlocks, reorderAction)

  if (blocks.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">Chưa có blocks. Thêm block bên dưới.</p>
      </div>
    )
  }

  return (
    <SortableList
      items={blocks}
      onDragEnd={handleDragEnd}
      renderItem={(id) => {
        const block = blocks.find((b) => b.id === id)
        if (!block) return null
        return (
          <SortableItem key={id} id={id}>
            <LessonBlockEditor block={block} />
          </SortableItem>
        )
      }}
    />
  )
}
