import { CourseForm } from '@/components/courses/course-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewCoursePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/courses" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Tạo khóa học mới</h1>
      </div>
      <CourseForm />
    </div>
  )
}
