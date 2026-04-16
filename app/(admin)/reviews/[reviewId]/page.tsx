import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { SkillBadge } from '@/components/shared/skill-badge'
import { ReviewDetailClient } from '@/components/reviews/review-detail-client'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  params: Promise<{ reviewId: string }>
}

export default async function ReviewDetailPage({ params }: Props) {
  const { reviewId } = await params
  const supabase = await createClient()

  const { data: review } = await supabase
    .from('teacher_reviews')
    .select('*')
    .eq('id', reviewId)
    .single()

  if (!review) notFound()

  const { data: comments } = await supabase
    .from('teacher_comments')
    .select('*')
    .eq('review_id', reviewId)
    .order('created_at')

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('display_name').eq('id', user.id).single()
    : { data: null }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/reviews" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <SkillBadge value={review.skill} />
            <Badge variant={review.status === 'pending' ? 'default' : 'secondary'} className="text-xs">
              {review.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {review.created_at ? formatDistanceToNow(new Date(review.created_at), { addSuffix: true }) : '—'}
          </p>
        </div>
      </div>

      {review.preview_text && (
        <div className="rounded-md bg-muted p-4 text-sm">
          <p className="font-medium text-xs text-muted-foreground mb-1">Bài làm của học viên:</p>
          <p>{review.preview_text}</p>
        </div>
      )}

      <ReviewDetailClient
        reviewId={reviewId}
        initialComments={comments ?? []}
        adminName={profile?.display_name ?? user?.email ?? 'Admin'}
        currentStatus={review.status as 'pending' | 'reviewed' | 'closed'}
      />
    </div>
  )
}
