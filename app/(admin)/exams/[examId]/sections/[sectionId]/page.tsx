import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { SectionQuestionPicker } from '@/components/exams/section-question-picker'
import { SkillBadge } from '@/components/shared/skill-badge'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
  params: Promise<{ examId: string; sectionId: string }>
}

export default async function SectionQuestionsPage({ params }: Props) {
  const { examId, sectionId } = await params
  const supabase = await createClient()

  const { data: section } = await supabase
    .from('exam_sections')
    .select('*')
    .eq('id', sectionId)
    .single()

  if (!section) notFound()

  // Questions already assigned to this section
  const { data: assigned } = await supabase
    .from('questions')
    .select('id, prompt, type, skill, points, order_index')
    .eq('section_id', sectionId)
    .order('order_index')

  // Questions in the bank (not assigned to any section) matching this skill
  const { data: bank } = await supabase
    .from('questions')
    .select('id, prompt, type, skill, points')
    .is('section_id', null)
    .eq('skill', section.skill)
    .limit(100)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/exams/${examId}`} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{section.label}</h1>
            <SkillBadge value={section.skill} />
          </div>
          <p className="text-sm text-muted-foreground">
            Mục tiêu: {section.question_count} câu · Đã có: {assigned?.length ?? 0} câu
          </p>
        </div>
      </div>

      <SectionQuestionPicker
        sectionId={sectionId}
        initialAssigned={assigned ?? []}
        bankQuestions={bank ?? []}
      />
    </div>
  )
}
