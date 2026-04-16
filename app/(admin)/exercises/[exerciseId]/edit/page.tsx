import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ExerciseForm } from '@/components/exercises/exercise-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
  params: Promise<{ exerciseId: string }>
}

export default async function EditExercisePage({ params }: Props) {
  const { exerciseId } = await params
  const supabase = await createClient()

  const { data: exercise } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', exerciseId)
    .single()

  if (!exercise) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/exercises" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Sửa bài tập</h1>
      </div>
      <ExerciseForm exercise={exercise} />
    </div>
  )
}
