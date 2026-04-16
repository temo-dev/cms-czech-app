import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CourseForm } from '@/components/courses/course-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
  params: Promise<{ courseId: string }>
}

export default async function EditCoursePage({ params }: Props) {
  const { courseId } = await params
  const supabase = await createClient()
  const { data: course } = await supabase.from('courses').select('*').eq('id', courseId).single()
  if (!course) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/courses/${courseId}`} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Sửa khóa học</h1>
      </div>
      <CourseForm course={course} />
    </div>
  )
}
