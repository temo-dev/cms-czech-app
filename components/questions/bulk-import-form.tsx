'use client'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { bulkImportQuestions } from '@/actions/questions'
import { bulkImportQuestionSchema } from '@/lib/validations/question.schema'
import { toast } from 'sonner'
import { CheckCircle2, XCircle } from 'lucide-react'

interface ParsedQuestion {
  valid: boolean
  data?: Parameters<typeof bulkImportQuestions>[0][number]
  error?: string
  raw: unknown
  index: number
}

export function BulkImportForm() {
  const [json, setJson] = useState('')
  const [parsed, setParsed] = useState<ParsedQuestion[]>([])
  const [isPending, startTransition] = useTransition()

  function handleParse() {
    try {
      const raw = JSON.parse(json) as unknown[]
      if (!Array.isArray(raw)) { toast.error('JSON phải là một mảng []'); return }

      const results: ParsedQuestion[] = raw.map((item, index) => {
        const result = bulkImportQuestionSchema.safeParse(item)
        if (!result.success) {
          return { valid: false, error: result.error.issues[0]?.message, raw: item, index }
        }
        return { valid: true, data: result.data as Parameters<typeof bulkImportQuestions>[0][number], raw: item, index }
      })
      setParsed(results)
    } catch {
      toast.error('JSON không hợp lệ')
    }
  }

  function handleImport() {
    const valid = parsed.filter((p) => p.valid && p.data).map((p) => p.data!)
    if (valid.length === 0) { toast.error('Không có câu hỏi hợp lệ'); return }

    startTransition(async () => {
      const result = await bulkImportQuestions(valid)
      toast.success(`Đã import ${result.success} câu hỏi`)
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} câu hỏi thất bại`)
      }
      setParsed([])
      setJson('')
    })
  }

  const validCount = parsed.filter((p) => p.valid).length
  const invalidCount = parsed.filter((p) => !p.valid).length

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <Label>JSON format mẫu:</Label>
        <pre className="text-xs bg-muted rounded-md p-3 overflow-x-auto">
{`[
  {
    "type": "mcq",
    "skill": "reading",
    "prompt": "Câu hỏi của bạn?",
    "options": [
      { "text": "Đáp án A", "isCorrect": true },
      { "text": "Đáp án B", "isCorrect": false },
      { "text": "Đáp án C", "isCorrect": false }
    ],
    "explanation": "Giải thích...",
    "points": 1
  }
]`}
        </pre>
      </div>

      <div className="space-y-2">
        <Label htmlFor="json-input">Dán JSON vào đây</Label>
        <Textarea
          id="json-input"
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={12}
          className="font-mono text-xs"
          placeholder='[{"type": "mcq", ...}]'
        />
      </div>

      <Button type="button" variant="outline" onClick={handleParse} disabled={!json.trim()}>
        Kiểm tra dữ liệu
      </Button>

      {parsed.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="h-3 w-3" /> {validCount} hợp lệ
            </Badge>
            {invalidCount > 0 && (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" /> {invalidCount} lỗi
              </Badge>
            )}
          </div>

          <div className="rounded-md border divide-y max-h-64 overflow-y-auto">
            {parsed.map((p) => (
              <div key={p.index} className="flex items-start gap-3 px-3 py-2 text-sm">
                {p.valid
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  : <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="truncate">
                    {(p.raw as Record<string, unknown>)?.prompt as string ?? `Mục ${p.index + 1}`}
                  </p>
                  {!p.valid && <p className="text-xs text-destructive">{p.error}</p>}
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleImport} disabled={isPending || validCount === 0}>
            {isPending ? 'Đang import...' : `Import ${validCount} câu hỏi hợp lệ`}
          </Button>
        </div>
      )}
    </div>
  )
}
