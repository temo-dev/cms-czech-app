import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { SkillBadge } from '@/components/shared/skill-badge'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ChevronRight } from 'lucide-react'

export default async function ReviewsPage() {
  const supabase = await createClient()
  const { data: reviews } = await supabase
    .from('teacher_reviews')
    .select('id, skill, status, preview_text, unread_count, created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(100)

  const statusColors: Record<string, 'default' | 'secondary' | 'outline'> = {
    pending: 'default',
    reviewed: 'secondary',
    closed: 'outline',
  }

  const statusLabel: Record<string, string> = {
    pending: 'Chờ phản hồi',
    reviewed: 'Đã phản hồi',
    closed: 'Đã đóng',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Phản hồi giáo viên</h1>
        <p className="text-sm text-muted-foreground">
          {reviews?.filter((r) => r.status === 'pending').length ?? 0} đang chờ phản hồi
        </p>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Nội dung</th>
              <th className="px-4 py-3 text-left font-medium w-24">Kỹ năng</th>
              <th className="px-4 py-3 text-left font-medium w-28">Trạng thái</th>
              <th className="px-4 py-3 text-left font-medium w-32">Ngày tạo</th>
              <th className="px-4 py-3 w-12" />
            </tr>
          </thead>
          <tbody>
            {reviews?.map((review) => (
              <tr key={review.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link href={`/reviews/${review.id}`} className="hover:underline">
                    <p className="line-clamp-2 text-sm">{review.preview_text ?? 'Không có nội dung preview'}</p>
                  </Link>
                  {review.unread_count > 0 && (
                    <span className="text-xs text-primary font-medium">{review.unread_count} tin nhắn mới</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <SkillBadge value={review.skill} />
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusColors[review.status] ?? 'outline'} className="text-xs">
                    {statusLabel[review.status] ?? review.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {review.created_at ? formatDistanceToNow(new Date(review.created_at), { addSuffix: true }) : '—'}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/reviews/${review.id}`} className="text-muted-foreground hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
