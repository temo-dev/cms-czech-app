import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SkillBadge } from '@/components/shared/skill-badge'
import { AddSectionForm } from '@/components/exams/add-section-form'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react'

interface Props {
  params: Promise<{ examId: string }>
}

export default async function ExamDetailPage({ params }: Props) {
  const { examId } = await params
  const supabase = await createClient()

  const { data: exam } = await supabase.from('exams').select('*').eq('id', examId).single()
  if (!exam) notFound()

  const { data: sections } = await supabase
    .from('exam_sections')
    .select('*, questions:questions(count)')
    .eq('exam_id', examId)
    .order('order_index')

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/exams" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <Badge variant={exam.is_active ? 'default' : 'secondary'}>
              {exam.is_active ? 'Hoạt động' : 'Ẩn'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{exam.duration_minutes} phút</p>
        </div>
        <Link href={`/exams/${examId}/edit`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            Sửa
          </Button>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sections ({sections?.length ?? 0})</h2>
          <AddSectionForm examId={examId} nextOrderIndex={sections?.length ?? 0} />
        </div>
        <div className="space-y-3">
          {sections?.map((section) => {
            const qCount = (section.questions as unknown as { count: number }[])?.[0]?.count ?? 0
            return (
              <div key={section.id} className="flex items-center gap-3 p-4 border rounded-lg">
                <SkillBadge value={section.skill} />
                <div className="flex-1">
                  <p className="font-medium">{section.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {qCount} / {section.question_count} câu hỏi
                  </p>
                </div>
                <Link href={`/exams/${examId}/sections/${section.id}`}>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    Quản lý câu hỏi
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
