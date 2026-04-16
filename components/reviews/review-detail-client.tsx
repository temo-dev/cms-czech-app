'use client'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { addTeacherComment, updateReviewStatus } from '@/actions/reviews'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import type { Tables } from '@/lib/types/database.types'

interface ReviewDetailClientProps {
  reviewId: string
  initialComments: Tables<'teacher_comments'>[]
  adminName: string
  currentStatus: 'pending' | 'reviewed' | 'closed'
}

export function ReviewDetailClient({ reviewId, initialComments, adminName, currentStatus }: ReviewDetailClientProps) {
  const [comments, setComments] = useState(initialComments)
  const [body, setBody] = useState('')
  const [status, setStatus] = useState(currentStatus)
  const [isPending, startTransition] = useTransition()

  function handleSendComment() {
    if (!body.trim()) return
    startTransition(async () => {
      const result = await addTeacherComment(reviewId, body.trim(), adminName)
      if (result && 'error' in result) {
        toast.error(result.error as string)
      } else if (result?.data) {
        setComments((prev) => [...prev, result.data as Tables<'teacher_comments'>])
        setBody('')
        setStatus('reviewed')
        toast.success('Đã gửi phản hồi')
      }
    })
  }

  function handleStatusChange(newStatus: 'closed') {
    startTransition(async () => {
      const result = await updateReviewStatus(reviewId, newStatus)
      if (result && 'error' in result) {
        toast.error(result.error as string)
      } else {
        setStatus(newStatus)
        toast.success('Đã cập nhật trạng thái')
      }
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Luồng bình luận ({comments.length})</h3>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`rounded-md p-3 text-sm ${comment.is_teacher ? 'bg-primary/10 ml-4' : 'bg-muted mr-4'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-xs">{comment.author_name ?? (comment.is_teacher ? 'Giáo viên' : 'Học viên')}</span>
              {comment.is_teacher && <Badge className="text-xs h-4 px-1.5">GV</Badge>}
              <span className="text-xs text-muted-foreground ml-auto">
                {comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) : ''}
              </span>
            </div>
            <p>{comment.body}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">Chưa có bình luận</p>
        )}
      </div>

      {status !== 'closed' && (
        <div className="space-y-2">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Nhập phản hồi của giáo viên..."
            rows={3}
          />
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSendComment} disabled={isPending || !body.trim()}>
              {isPending ? 'Đang gửi...' : 'Gửi phản hồi'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange('closed')}
              disabled={isPending}
            >
              Đóng review
            </Button>
          </div>
        </div>
      )}

      {status === 'closed' && (
        <div className="text-sm text-muted-foreground text-center py-2 border rounded-md">
          Review đã được đóng
        </div>
      )}
    </div>
  )
}
