import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // Fetch exam results for score distribution
  const { data: results } = await supabase
    .from('exam_results')
    .select('total_score, section_scores, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  // Fetch AI attempts counts
  const { count: speakingCount } = await supabase
    .from('ai_speaking_attempts')
    .select('*', { count: 'exact', head: true })

  const { count: writingCount } = await supabase
    .from('ai_writing_attempts')
    .select('*', { count: 'exact', head: true })

  // Score distribution buckets
  const buckets = { excellent: 0, good: 0, fair: 0, poor: 0 }
  let totalScore = 0
  results?.forEach((r) => {
    totalScore += r.total_score
    if (r.total_score >= 85) buckets.excellent++
    else if (r.total_score >= 70) buckets.good++
    else if (r.total_score >= 50) buckets.fair++
    else buckets.poor++
  })
  const avgScore = results && results.length > 0 ? Math.round(totalScore / results.length) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Thống kê</h1>
        <p className="text-sm text-muted-foreground">Phân tích kết quả học tập</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Tổng số bài thi</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{results?.length ?? 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Điểm trung bình</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{avgScore}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Bài nói AI</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{speakingCount ?? 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Bài viết AI</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{writingCount ?? 0}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Phân bổ điểm thi</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Xuất sắc (≥85)', count: buckets.excellent, color: 'bg-emerald-500' },
              { label: 'Tốt (70-84)', count: buckets.good, color: 'bg-blue-500' },
              { label: 'Trung bình (50-69)', count: buckets.fair, color: 'bg-yellow-500' },
              { label: 'Yếu (<50)', count: buckets.poor, color: 'bg-red-500' },
            ].map((bucket) => {
              const total = results?.length ?? 1
              const pct = Math.round((bucket.count / total) * 100)
              return (
                <div key={bucket.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{bucket.label}</span>
                    <span className="text-muted-foreground">{bucket.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${bucket.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {results && results.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Điểm gần nhất (20 bài)</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1">
              {results.slice(0, 20).map((r, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${r.total_score}%` }}
                    />
                  </div>
                  <span className="text-xs tabular-nums w-8 text-right">{r.total_score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
