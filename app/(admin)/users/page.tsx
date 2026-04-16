import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: users } = await supabase
    .from('profiles')
    .select('id, email, display_name, role, subscription_tier, total_xp, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  const roleColors: Record<string, string> = {
    admin: 'destructive',
    teacher: 'default',
    learner: 'secondary',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Người dùng</h1>
          <p className="text-sm text-muted-foreground">{users?.length ?? 0} tài khoản</p>
        </div>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Người dùng</th>
              <th className="px-4 py-3 text-left font-medium">Vai trò</th>
              <th className="px-4 py-3 text-left font-medium">Gói</th>
              <th className="px-4 py-3 text-left font-medium">XP</th>
              <th className="px-4 py-3 text-left font-medium">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link href={`/users/${user.id}`} className="hover:underline">
                    <div className="font-medium">{user.display_name ?? '—'}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={roleColors[user.role ?? 'learner'] as 'default' | 'secondary' | 'destructive'}>
                    {user.role ?? 'learner'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.subscription_tier === 'premium' ? 'default' : 'outline'} className="text-xs">
                    {user.subscription_tier ?? 'free'}
                  </Badge>
                </td>
                <td className="px-4 py-3 tabular-nums">{user.total_xp ?? 0}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {user.created_at ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true }) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
