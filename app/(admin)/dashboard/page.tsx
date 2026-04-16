import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, FileQuestion, GraduationCap, Users, MessageSquare, Dumbbell, Mic, PenLine } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: totalQuestions },
    { count: totalExercises },
    { count: totalCourses },
    { count: totalLessons },
    { count: totalUsers },
    { count: pendingReviews },
    { count: pendingSpeaking },
    { count: pendingWriting },
  ] = await Promise.all([
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase.from('exercises').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('lessons').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('teacher_reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('ai_speaking_attempts').select('*', { count: 'exact', head: true }).eq('status', 'processing'),
    supabase.from('ai_writing_attempts').select('*', { count: 'exact', head: true }).eq('status', 'processing'),
  ])

  const stats = [
    { label: 'Câu hỏi', value: totalQuestions ?? 0, icon: FileQuestion, href: '/questions', color: 'text-blue-600' },
    { label: 'Bài tập', value: totalExercises ?? 0, icon: Dumbbell, href: '/exercises', color: 'text-purple-600' },
    { label: 'Khóa học', value: totalCourses ?? 0, icon: BookOpen, href: '/courses', color: 'text-emerald-600' },
    { label: 'Bài học', value: totalLessons ?? 0, icon: GraduationCap, href: '/courses', color: 'text-orange-600' },
    { label: 'Người dùng', value: totalUsers ?? 0, icon: Users, href: '/users', color: 'text-slate-600' },
    { label: 'Reviews chờ', value: pendingReviews ?? 0, icon: MessageSquare, href: '/reviews', color: (pendingReviews ?? 0) > 0 ? 'text-red-600' : 'text-slate-600' },
    { label: 'Nói AI đang xử lý', value: pendingSpeaking ?? 0, icon: Mic, href: '/analytics', color: (pendingSpeaking ?? 0) > 0 ? 'text-yellow-600' : 'text-slate-600' },
    { label: 'Viết AI đang xử lý', value: pendingWriting ?? 0, icon: PenLine, href: '/analytics', color: (pendingWriting ?? 0) > 0 ? 'text-yellow-600' : 'text-slate-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Tổng quan hệ thống Trvalý Prep CMS</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Điều hướng nhanh</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {[
              { label: '+ Câu hỏi mới', href: '/questions/new' },
              { label: '+ Bài tập mới', href: '/exercises/new' },
              { label: '+ Khóa học mới', href: '/courses/new' },
              { label: '+ Đề thi mới', href: '/exams/new' },
              { label: 'Import câu hỏi', href: '/questions/import' },
              { label: 'Phân tích', href: '/analytics' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-primary hover:underline py-1"
              >
                {link.label}
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Hướng dẫn áp dụng migration</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Để kích hoạt đầy đủ CMS, cần apply migration:</p>
            <p className="font-mono text-xs bg-muted rounded px-2 py-1">
              supabase/migrations/20260417000000_cms_admin_role.sql
            </p>
            <p>vào Supabase Dashboard → SQL Editor, sau đó gán <code className="text-xs">role = 'admin'</code> cho tài khoản của bạn.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
