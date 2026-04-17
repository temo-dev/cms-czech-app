import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { reorderLessonBlocks } from '@/actions/courses'
import { LessonBlocksClient } from '@/components/courses/lesson-blocks-client'
import { AddLessonBlockForm } from '@/components/courses/add-lesson-block-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Tables } from '@/lib/types/database.types'

interface Props {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>
}

export default async function LessonDetailPage({ params }: Props) {
  const { courseId, moduleId, lessonId } = await params
  const supabase = await createClient()

  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single()

  if (!lesson) notFound()

  const { data: blocks } = await supabase
    .from('lesson_blocks')
    .select('id, lesson_id, type, order_index')
    .eq('lesson_id', lessonId)
    .order('order_index')

  // Fetch exercises for each block via junction table
  const blockIds = blocks?.map((b) => b.id) ?? []
  const { data: blockExercises } = blockIds.length
    ? await supabase
        .from('lesson_block_exercises')
        .select('block_id, order_index, exercise:exercises(*)')
        .in('block_id', blockIds)
        .order('order_index')
    : { data: [] }

  const blocksWithExercises = blocks?.map((b) => ({
    ...b,
    exercises: (blockExercises ?? [])
      .filter((be) => be.block_id === b.id)
      .map((be) => (be.exercise as unknown) as Tables<'exercises'>),
  })) ?? []

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href={`/courses/${courseId}/modules/${moduleId}`} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <p className="text-sm text-muted-foreground">{lesson.duration_minutes} phút · {blocks?.length ?? 0} blocks</p>
        </div>
      </div>

      <LessonBlocksClient
        initialBlocks={blocksWithExercises}
        reorderAction={reorderLessonBlocks}
      />

      <AddLessonBlockForm
        lessonId={lessonId}
        nextOrderIndex={(blocks?.length ?? 0) + 1}
      />
    </div>
  )
}
