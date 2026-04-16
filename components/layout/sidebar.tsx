'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Users,
  Dumbbell,
  BarChart3,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/courses', label: 'Khóa học', icon: BookOpen },
  { href: '/exercises', label: 'Bài tập', icon: Dumbbell },
  { href: '/questions', label: 'Ngân hàng câu hỏi', icon: FileQuestion },
  { href: '/exams', label: 'Đề thi', icon: GraduationCap },
  { href: '/users', label: 'Người dùng', icon: Users },
  { href: '/reviews', label: 'Phản hồi GV', icon: MessageSquare },
  { href: '/analytics', label: 'Thống kê', icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 shrink-0 border-r bg-background flex flex-col h-screen">
      <div className="px-4 py-5 border-b">
        <h1 className="font-bold text-base">Trvalý Prep CMS</h1>
        <p className="text-xs text-muted-foreground">Admin Dashboard</p>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                active
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="h-3 w-3" />}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
