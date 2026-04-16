import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SkillBadge } from '@/components/shared/skill-badge'
import { DeleteCourseButton } from '@/components/shared/delete-course-button'
import Link from 'next/link'
import { Plus, Pencil, Layers } from 'lucide-react'

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('id, slug, title, skill, is_premium, order_index, thumbnail_url')
    .order('order_index')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Khóa học</h1>
          <p className="text-sm text-muted-foreground">{courses?.length ?? 0} khóa học</p>
        </div>
        <Link href="/courses/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Thêm khóa học
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses?.map((course) => (
          <div key={course.id} className="rounded-lg border bg-card overflow-hidden">
            {course.thumbnail_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.thumbnail_url} alt={course.title} className="w-full h-32 object-cover" />
            )}
            {!course.thumbnail_url && (
              <div className="w-full h-32 bg-muted flex items-center justify-center">
                <Layers className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{course.slug}</p>
                </div>
                {course.is_premium && <Badge className="text-xs shrink-0">Premium</Badge>}
              </div>
              <div className="mt-2">
                <SkillBadge value={course.skill} />
              </div>
              <div className="flex items-center gap-1 mt-3">
                <Link href={`/courses/${course.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                    <Layers className="h-3.5 w-3.5" />
                    Quản lý modules
                  </Button>
                </Link>
                <Link href={`/courses/${course.id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <DeleteCourseButton courseId={course.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
