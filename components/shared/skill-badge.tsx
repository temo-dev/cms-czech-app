import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const skillColors: Record<string, string> = {
  reading: 'bg-blue-100 text-blue-800 border-blue-200',
  listening: 'bg-purple-100 text-purple-800 border-purple-200',
  writing: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  speaking: 'bg-orange-100 text-orange-800 border-orange-200',
  vocabulary: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  grammar: 'bg-pink-100 text-pink-800 border-pink-200',
  vocab: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  mcq: 'bg-slate-100 text-slate-800 border-slate-200',
  fill_blank: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  matching: 'bg-violet-100 text-violet-800 border-violet-200',
  ordering: 'bg-amber-100 text-amber-800 border-amber-200',
}

const skillLabels: Record<string, string> = {
  reading: 'Đọc',
  listening: 'Nghe',
  writing: 'Viết',
  speaking: 'Nói',
  vocabulary: 'Từ vựng',
  grammar: 'Ngữ pháp',
  vocab: 'Từ vựng',
  mcq: 'Trắc nghiệm',
  fill_blank: 'Điền vào chỗ trống',
  matching: 'Nối cặp',
  ordering: 'Sắp xếp',
}

export function SkillBadge({ value, className }: { value: string; className?: string }) {
  const colorClass = skillColors[value] ?? 'bg-gray-100 text-gray-800 border-gray-200'
  const label = skillLabels[value] ?? value
  return (
    <Badge variant="outline" className={cn('font-normal text-xs', colorClass, className)}>
      {label}
    </Badge>
  )
}
