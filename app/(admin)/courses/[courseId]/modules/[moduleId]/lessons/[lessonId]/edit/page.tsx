import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { LessonFormPage } from '@/components/courses/lesson-form-page'

interface Props {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>
}

export default async function EditLessonPage({ params }: Props) {
  const { courseId, moduleId, lessonId } = await params
  const supabase = await createClient()
  const { data: lesson } = await supabase.from('lessons').select('*').eq('id', lessonId).single()
  if (!lesson) notFound()

  return <LessonFormPage courseId={courseId} moduleId={moduleId} lesson={lesson} />
}
