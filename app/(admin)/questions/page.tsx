import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { SkillBadge } from '@/components/shared/skill-badge'
import { DeleteQuestionButton } from '@/components/shared/delete-question-button'
import Link from 'next/link'
import { Plus, Pencil, Upload } from 'lucide-react'

export default async function QuestionsPage() {
  const supabase = await createClient()
  const { data: questions } = await supabase
    .from('questions')
    .select('id, type, skill, prompt, points, section_id, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  const typeLabel: Record<string, string> = {
    mcq: 'Trắc nghiệm',
    fill_blank: 'Điền trống',
    matching: 'Nối cặp',
    ordering: 'Sắp xếp',
    speaking: 'Nói',
    writing: 'Viết',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ngân hàng câu hỏi</h1>
          <p className="text-sm text-muted-foreground">{questions?.length ?? 0} câu hỏi</p>
        </div>
        <div className="flex gap-2">
          <Link href="/questions/import">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Upload className="h-4 w-4" />
              Import JSON
            </Button>
          </Link>
          <Link href="/questions/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Thêm câu hỏi
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Câu hỏi</th>
              <th className="px-4 py-3 text-left font-medium w-32">Loại</th>
              <th className="px-4 py-3 text-left font-medium w-28">Kỹ năng</th>
              <th className="px-4 py-3 text-left font-medium w-16">Điểm</th>
              <th className="px-4 py-3 text-left font-medium w-20">Trạng thái</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody>
            {questions?.map((q) => (
              <tr key={q.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <p className="line-clamp-2 text-sm">{q.prompt}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-muted-foreground">{typeLabel[q.type] ?? q.type}</span>
                </td>
                <td className="px-4 py-3">
                  {q.skill && <SkillBadge value={q.skill} />}
                </td>
                <td className="px-4 py-3 tabular-nums">{q.points}</td>
                <td className="px-4 py-3">
                  {q.section_id
                    ? <span className="text-xs text-emerald-600 font-medium">Đã gán</span>
                    : <span className="text-xs text-muted-foreground">Ngân hàng</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link href={`/questions/${q.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <DeleteQuestionButton id={q.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
