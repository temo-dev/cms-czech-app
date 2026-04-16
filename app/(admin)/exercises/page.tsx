import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { SkillBadge } from '@/components/shared/skill-badge'
import { DeleteExerciseButton } from '@/components/shared/delete-exercise-button'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function ExercisesPage() {
  const supabase = await createClient()
  const { data: exercises } = await supabase
    .from('exercises')
    .select('id, type, skill, difficulty, xp_reward, points, created_at, content_json')
    .order('created_at', { ascending: false })
    .limit(200)

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-emerald-100 text-emerald-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ngân hàng bài tập</h1>
          <p className="text-sm text-muted-foreground">{exercises?.length ?? 0} bài tập</p>
        </div>
        <Link href="/exercises/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Thêm bài tập
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Prompt</th>
              <th className="px-4 py-3 text-left font-medium w-28">Loại</th>
              <th className="px-4 py-3 text-left font-medium w-28">Kỹ năng</th>
              <th className="px-4 py-3 text-left font-medium w-28">Độ khó</th>
              <th className="px-4 py-3 text-left font-medium w-16">XP</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody>
            {exercises?.map((ex) => {
              const content = ex.content_json as Record<string, unknown>
              const prompt = content?.prompt as string | undefined
              return (
                <tr key={ex.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="line-clamp-2 text-sm">{prompt ?? '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <SkillBadge value={ex.type} />
                  </td>
                  <td className="px-4 py-3">
                    {ex.skill && <SkillBadge value={ex.skill} />}
                  </td>
                  <td className="px-4 py-3">
                    {ex.difficulty && (
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${difficultyColors[ex.difficulty] ?? ''}`}>
                        {ex.difficulty}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{ex.xp_reward}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/exercises/${ex.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <DeleteExerciseButton id={ex.id} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
