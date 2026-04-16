import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { QuestionForm } from '@/components/questions/question-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
  params: Promise<{ questionId: string }>
}

export default async function EditQuestionPage({ params }: Props) {
  const { questionId } = await params
  const supabase = await createClient()

  const { data: question } = await supabase
    .from('questions')
    .select('*')
    .eq('id', questionId)
    .single()

  if (!question) notFound()

  const { data: options } = await supabase
    .from('question_options')
    .select('*')
    .eq('question_id', questionId)
    .order('order_index')

  const questionWithOptions = { ...question, options: options ?? [] }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/questions" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Sửa câu hỏi</h1>
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <QuestionForm question={questionWithOptions as any} />
    </div>
  )
}
