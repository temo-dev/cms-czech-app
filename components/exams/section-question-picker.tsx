'use client'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { SkillBadge } from '@/components/shared/skill-badge'
import { assignQuestionToSection, removeQuestionFromSection } from '@/actions/questions'
import { toast } from 'sonner'
import { Plus, X, ChevronRight, ChevronLeft } from 'lucide-react'

interface Question {
  id: string
  prompt: string
  type: string
  skill: string | null
  points: number
  order_index?: number
}

interface SectionQuestionPickerProps {
  sectionId: string
  initialAssigned: Question[]
  bankQuestions: Question[]
}

export function SectionQuestionPicker({ sectionId, initialAssigned, bankQuestions }: SectionQuestionPickerProps) {
  const [assigned, setAssigned] = useState(initialAssigned)
  const [bank, setBank] = useState(bankQuestions)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleAssign() {
    const toAssign = bank.filter((q) => selected.has(q.id))
    if (toAssign.length === 0) return

    startTransition(async () => {
      for (const q of toAssign) {
        const result = await assignQuestionToSection(q.id, sectionId, assigned.length + 1)
        if (result && 'error' in result) {
          toast.error(result.error as string)
          return
        }
      }
      setAssigned((prev) => [...prev, ...toAssign.map((q, i) => ({ ...q, order_index: prev.length + i + 1 }))])
      setBank((prev) => prev.filter((q) => !selected.has(q.id)))
      setSelected(new Set())
      toast.success(`Đã gán ${toAssign.length} câu hỏi`)
    })
  }

  function handleRemove(questionId: string) {
    startTransition(async () => {
      const result = await removeQuestionFromSection(questionId)
      if (result && 'error' in result) {
        toast.error(result.error as string)
        return
      }
      const removed = assigned.find((q) => q.id === questionId)!
      setAssigned((prev) => prev.filter((q) => q.id !== questionId))
      setBank((prev) => [...prev, removed])
      toast.success('Đã xoá khỏi section')
    })
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left: Bank */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Ngân hàng câu hỏi ({bank.length})</h3>
          <Button
            size="sm"
            className="h-7 text-xs gap-1"
            disabled={selected.size === 0 || isPending}
            onClick={handleAssign}
          >
            <ChevronRight className="h-3.5 w-3.5" />
            Gán ({selected.size})
          </Button>
        </div>
        <div className="border rounded-md divide-y max-h-[500px] overflow-y-auto">
          {bank.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Hết câu hỏi trong ngân hàng</p>
          )}
          {bank.map((q) => (
            <button
              key={q.id}
              type="button"
              className={`w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors ${selected.has(q.id) ? 'bg-primary/10' : ''}`}
              onClick={() => toggleSelect(q.id)}
            >
              <p className="text-sm line-clamp-2">{q.prompt}</p>
              <div className="flex items-center gap-2 mt-1">
                {q.skill && <SkillBadge value={q.skill} />}
                <span className="text-xs text-muted-foreground">{q.type}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Assigned */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Đã gán vào section ({assigned.length})</h3>
        <div className="border rounded-md divide-y max-h-[500px] overflow-y-auto">
          {assigned.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Chưa có câu hỏi</p>
          )}
          {assigned.map((q, idx) => (
            <div key={q.id} className="flex items-start gap-2 px-3 py-2.5">
              <span className="text-xs text-muted-foreground w-5 mt-0.5 shrink-0">{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm line-clamp-2">{q.prompt}</p>
                <div className="flex items-center gap-2 mt-1">
                  {q.skill && <SkillBadge value={q.skill} />}
                  <span className="text-xs text-muted-foreground">{q.type}</span>
                </div>
              </div>
              <button
                type="button"
                className="text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-0.5"
                onClick={() => handleRemove(q.id)}
                disabled={isPending}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
