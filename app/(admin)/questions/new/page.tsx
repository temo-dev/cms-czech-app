import { QuestionForm } from '@/components/questions/question-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewQuestionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/questions" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Thêm câu hỏi mới</h1>
      </div>
      <QuestionForm />
    </div>
  )
}
