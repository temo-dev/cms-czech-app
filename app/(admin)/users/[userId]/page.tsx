import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserRoleForm } from '@/components/users/user-role-form'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
  params: Promise<{ userId: string }>
}

export default async function UserDetailPage({ params }: Props) {
  const { userId } = await params
  const supabase = await createClient()

  const { data: user } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (!user) notFound()

  const { data: attempts } = await supabase
    .from('exam_attempts')
    .select('id, status, started_at, submitted_at, exam_id')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(20)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/users" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{user.display_name ?? 'Chưa đặt tên'}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Thống kê</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total XP</span>
              <span className="font-medium tabular-nums">{user.total_xp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Streak</span>
              <span className="font-medium">{user.current_streak_days} ngày</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gói</span>
              <Badge variant={user.subscription_tier === 'premium' ? 'default' : 'outline'} className="text-xs">
                {user.subscription_tier}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tham gia</span>
              <span>{user.created_at ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true }) : '—'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Vai trò & Quyền</CardTitle></CardHeader>
          <CardContent>
            <UserRoleForm userId={userId} currentRole={user.role as 'learner' | 'teacher' | 'admin'} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Lịch sử thi ({attempts?.length ?? 0})</CardTitle></CardHeader>
        <CardContent>
          {attempts && attempts.length > 0 ? (
            <div className="space-y-2">
              {attempts.map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                  <span className="text-muted-foreground font-mono text-xs">{attempt.id.slice(0, 8)}...</span>
                  <Badge variant={attempt.status === 'submitted' ? 'default' : 'secondary'} className="text-xs">
                    {attempt.status}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {attempt.started_at ? formatDistanceToNow(new Date(attempt.started_at), { addSuffix: true }) : '—'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có lần thi nào</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
