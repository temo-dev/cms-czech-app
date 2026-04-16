'use client'
import { useRouter } from 'next/navigation'
import { LessonForm } from './lesson-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Tables } from '@/lib/types/database.types'

interface LessonFormPageProps {
  courseId: string
  moduleId: string
  lesson: Tables<'lessons'>
}

export function LessonFormPage({ courseId, moduleId, lesson }: LessonFormPageProps) {
  const router = useRouter()
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href={`/courses/${courseId}/modules/${moduleId}`} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Sửa bài học</h1>
      </div>
      <LessonForm
        moduleId={moduleId}
        lesson={lesson}
        onSaved={() => router.push(`/courses/${courseId}/modules/${moduleId}`)}
      />
    </div>
  )
}
