import { ExamForm } from '@/components/exams/exam-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewExamPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center gap-3">
        <Link href="/exams" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Tạo đề thi mới</h1>
      </div>
      <ExamForm />
    </div>
  )
}
