import { ExerciseForm } from '@/components/exercises/exercise-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewExercisePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/exercises" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Thêm bài tập mới</h1>
      </div>
      <ExerciseForm />
    </div>
  )
}
