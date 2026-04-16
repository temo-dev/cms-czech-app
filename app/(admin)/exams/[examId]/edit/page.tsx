import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ExamForm } from '@/components/exams/exam-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
  params: Promise<{ examId: string }>
}

export default async function EditExamPage({ params }: Props) {
  const { examId } = await params
  const supabase = await createClient()
  const { data: exam } = await supabase.from('exams').select('*').eq('id', examId).single()
  if (!exam) notFound()

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center gap-3">
        <Link href={`/exams/${examId}`} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Sửa đề thi</h1>
      </div>
      <ExamForm exam={exam} />
    </div>
  )
}
