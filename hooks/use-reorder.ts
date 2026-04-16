'use client'
import { useState, useTransition, useEffect } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'

export function useReorder<T extends { id: string; order_index: number }>(
  initialItems: T[],
  reorderAction: (updates: { id: string; order_index: number }[]) => Promise<void>
) {
  const [items, setItems] = useState(initialItems)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      order_index: idx + 1,
    }))

    setItems(reordered)

    startTransition(async () => {
      await reorderAction(
        reordered.map((i) => ({ id: i.id, order_index: i.order_index }))
      )
    })
  }

  return { items, setItems, handleDragEnd, isPending }
}
