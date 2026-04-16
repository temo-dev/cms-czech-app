'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SkillBadge } from '@/components/shared/skill-badge'
import { ExerciseForm } from '@/components/exercises/exercise-form'
import { addExerciseToBlock, removeExerciseFromBlock, deleteLessonBlock } from '@/actions/courses'
import { toast } from 'sonner'
import { Plus, X, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import type { Tables } from '@/lib/types/database.types'
import type { LessonBlock } from './lesson-blocks-client'

interface LessonBlockEditorProps {
  block: LessonBlock
  dragHandle?: React.ReactNode
}

export function LessonBlockEditor({ block, dragHandle }: LessonBlockEditorProps) {
  const router = useRouter()
  const [exercises, setExercises] = useState<Tables<'exercises'>[]>(block.exercises)
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const [isPending, startTransition] = useTransition()

  function handleExerciseSaved(newExercise: Tables<'exercises'>) {
    startTransition(async () => {
      const result = await addExerciseToBlock(block.id, newExercise.id, exercises.length + 1)
      if (result && 'error' in result) {
        toast.error(result.error as string)
      } else {
        setExercises((prev) => [...prev, newExercise])
        setShowForm(false)
        toast.success('Đã thêm bài tập')
      }
    })
  }

  function handleRemoveExercise(exerciseId: string) {
    startTransition(async () => {
      const result = await removeExerciseFromBlock(block.id, exerciseId)
      if (result && 'error' in result) {
        toast.error(result.error as string)
      } else {
        setExercises((prev) => prev.filter((e) => e.id !== exerciseId))
        toast.success('Đã xoá bài tập')
      }
    })
  }

  function handleDeleteBlock() {
    if (!confirm('Xoá block này và tất cả bài tập bên trong?')) return
    startTransition(async () => {
      const result = await deleteLessonBlock(block.id)
      if (result && 'error' in result) {
        toast.error(result.error as string)
      } else {
        toast.success('Đã xoá block')
        router.refresh()
      }
    })
  }

  return (
    <Card className="border">
      <CardHeader className="py-2 px-3">
        <div className="flex items-center gap-2">
          {dragHandle}
          <span className="text-xs text-muted-foreground w-5 shrink-0">{block.order_index}</span>
          <SkillBadge value={block.type} />
          <Badge variant="outline" className="text-xs">
            {exercises.length} bài tập
          </Badge>
          <div className="ml-auto flex items-center gap-1">
            <Button
              type="button" size="sm" variant="outline"
              className="h-7 text-xs gap-1"
              disabled={isPending}
              onClick={() => setShowForm((v) => !v)}
            >
              <Plus className="h-3 w-3" />
              Thêm
            </Button>
            <Button
              type="button" size="icon" variant="ghost"
              className="h-7 w-7"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>
            <Button
              type="button" size="icon" variant="ghost"
              className="h-7 w-7 text-destructive hover:text-destructive"
              disabled={isPending}
              onClick={handleDeleteBlock}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="px-3 pb-3 space-y-2">
          {exercises.length === 0 && !showForm && (
            <p className="text-xs text-muted-foreground py-1">Chưa có bài tập nào.</p>
          )}

          {exercises.map((ex, idx) => {
            const content = ex.content_json as Record<string, unknown> | null
            const prompt = content?.prompt as string | undefined
            return (
              <div
                key={ex.id}
                className="flex items-start gap-2 rounded-md border px-3 py-2 bg-muted/30"
              >
                <span className="text-xs text-muted-foreground w-4 shrink-0 mt-0.5">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-2">{prompt ?? `[${ex.type}]`}</p>
                  <span className="text-xs text-muted-foreground">{ex.type}</span>
                </div>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-0.5"
                  disabled={isPending}
                  onClick={() => handleRemoveExercise(ex.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}

          {showForm && (
            <div className="pt-2 border-t">
              <ExerciseForm onSaved={handleExerciseSaved} />
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
