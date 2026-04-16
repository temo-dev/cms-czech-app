'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createLessonBlock } from '@/actions/courses'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

const BLOCK_TYPES = [
  { value: 'vocab', label: 'Vocabulary' },
  { value: 'grammar', label: 'Grammar' },
  { value: 'reading', label: 'Reading' },
  { value: 'listening', label: 'Listening' },
  { value: 'speaking', label: 'Speaking' },
  { value: 'writing', label: 'Writing' },
]

interface AddLessonBlockFormProps {
  lessonId: string
  nextOrderIndex: number
}

export function AddLessonBlockForm({ lessonId, nextOrderIndex }: AddLessonBlockFormProps) {
  const [type, setType] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleAdd() {
    if (!type) return
    startTransition(async () => {
      const result = await createLessonBlock({
        lesson_id: lessonId,
        type,
        order_index: nextOrderIndex,
      })
      if (result && 'error' in result) {
        toast.error(result.error as string)
      } else {
        toast.success('Đã thêm block')
        setType('')
        router.refresh()
      }
    })
  }

  return (
    <div className="flex items-center gap-2 pt-4 border-t">
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-44 h-9">
          <SelectValue placeholder="Chọn loại block" />
        </SelectTrigger>
        <SelectContent>
          {BLOCK_TYPES.map((bt) => (
            <SelectItem key={bt.value} value={bt.value}>
              {bt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        className="gap-1.5"
        disabled={!type || isPending}
        onClick={handleAdd}
      >
        <Plus className="h-4 w-4" />
        {isPending ? 'Đang thêm...' : 'Thêm block'}
      </Button>
    </div>
  )
}
