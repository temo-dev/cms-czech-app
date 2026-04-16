import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DeleteExamButton } from '@/components/shared/delete-exam-button'
import Link from 'next/link'
import { Plus, Pencil, ChevronRight } from 'lucide-react'

export default async function ExamsPage() {
  const supabase = await createClient()
  const { data: exams } = await supabase
    .from('exams')
    .select('id, title, duration_minutes, is_active, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Đề thi</h1>
          <p className="text-sm text-muted-foreground">{exams?.length ?? 0} đề thi</p>
        </div>
        <Link href="/exams/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Tạo đề thi
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Tên đề thi</th>
              <th className="px-4 py-3 text-left font-medium w-32">Thời gian</th>
              <th className="px-4 py-3 text-left font-medium w-24">Trạng thái</th>
              <th className="px-4 py-3 w-32" />
            </tr>
          </thead>
          <tbody>
            {exams?.map((exam) => (
              <tr key={exam.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{exam.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{exam.duration_minutes} phút</td>
                <td className="px-4 py-3">
                  <Badge variant={exam.is_active ? 'default' : 'secondary'}>
                    {exam.is_active ? 'Hoạt động' : 'Ẩn'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link href={`/exams/${exam.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                        Sections <ChevronRight className="h-3 w-3" />
                      </Button>
                    </Link>
                    <Link href={`/exams/${exam.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <DeleteExamButton id={exam.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
