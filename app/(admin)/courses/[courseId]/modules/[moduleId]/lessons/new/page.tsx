'use client'
import { useRouter } from 'next/navigation'
import { LessonForm } from '@/components/courses/lesson-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { use } from 'react'

interface Props {
  params: Promise<{ courseId: string; moduleId: string }>
}

export default function NewLessonPage({ params }: Props) {
  const { courseId, moduleId } = use(params)
  const router = useRouter()

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href={`/courses/${courseId}/modules/${moduleId}`} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Thêm bài học mới</h1>
      </div>
      <LessonForm
        moduleId={moduleId}
        onSaved={() => router.push(`/courses/${courseId}/modules/${moduleId}`)}
      />
    </div>
  )
}
