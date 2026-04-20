'use client'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { questionSchema, type QuestionSchema } from '@/lib/validations/question.schema'
import { createQuestion, updateQuestion } from '@/actions/questions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { QuestionOptionBuilder } from './question-option-builder'
import { FileUploadField } from '@/components/shared/file-upload-field'
import type { Tables } from '@/lib/types/database.types'

interface QuestionFormProps {
  question?: Tables<'questions'> & {
    options?: Tables<'question_options'>[]
    intro_text?: string | null
    intro_image_url?: string | null
    accepted_answers?: string[] | null
  }
}

export function QuestionForm({ question }: QuestionFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<QuestionSchema>({
    resolver: zodResolver(questionSchema),
    defaultValues: question
      ? {
          type: question.type as QuestionSchema['type'],
          skill: question.skill as QuestionSchema['skill'],
          intro_text: question.intro_text ?? undefined,
          intro_image_url: question.intro_image_url ?? undefined,
          prompt: question.prompt,
          audio_url: question.audio_url ?? undefined,
          image_url: question.image_url ?? undefined,
          passage_text: question.passage_text ?? undefined,
          correct_answer: question.correct_answer ?? undefined,
          accepted_answers: question.accepted_answers ?? undefined,
          explanation: question.explanation ?? undefined,
          points: question.points,
          order_index: question.order_index,
          options: question.options?.map((o) => ({
            id: o.id,
            text: o.text,
            is_correct: o.is_correct,
            image_url: o.image_url ?? undefined,
            order_index: o.order_index,
          })),
        }
      : {
          type: 'mcq',
          skill: undefined,
          prompt: '',
          points: 1,
          order_index: 0,
          options: [
            { id: crypto.randomUUID(), text: '', is_correct: true, order_index: 0 },
            { id: crypto.randomUUID(), text: '', is_correct: false, order_index: 1 },
          ],
        },
  })

  const questionType = form.watch('type')
  const skill = form.watch('skill')
  const showsAudioField =
    skill === 'listening' &&
    (questionType === 'mcq' ||
        questionType === 'fill_blank' ||
        questionType === 'speaking')
  const showsPassageField =
    skill === 'reading' &&
    (questionType === 'mcq' || questionType === 'fill_blank')

  function onSubmit(data: QuestionSchema) {
    startTransition(async () => {
      const result = question
        ? await updateQuestion(question.id, data)
        : await createQuestion(data)

      if (result && 'error' in result) {
        toast.error(typeof result.error === 'string' ? result.error : 'Lỗi validation')
      } else {
        toast.success(question ? 'Đã cập nhật câu hỏi' : 'Đã tạo câu hỏi')
        router.push('/questions')
      }
    })
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Loại câu hỏi</Label>
            <Select
              value={questionType}
              onValueChange={(v) => form.setValue('type', v as QuestionSchema['type'])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mcq">Trắc nghiệm (MCQ)</SelectItem>
                <SelectItem value="fill_blank">Điền vào chỗ trống</SelectItem>
                <SelectItem value="matching">Nối cặp</SelectItem>
                <SelectItem value="ordering">Sắp xếp</SelectItem>
                <SelectItem value="speaking">Nói (AI)</SelectItem>
                <SelectItem value="writing">Viết (AI)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Kỹ năng</Label>
            <Select
              value={form.watch('skill') ?? ''}
              onValueChange={(v) => form.setValue('skill', v as QuestionSchema['skill'])}
            >
              <SelectTrigger><SelectValue placeholder="Chọn kỹ năng" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="reading">Đọc</SelectItem>
                <SelectItem value="listening">Nghe</SelectItem>
                <SelectItem value="writing">Viết</SelectItem>
                <SelectItem value="speaking">Nói</SelectItem>
                <SelectItem value="vocabulary">Từ vựng</SelectItem>
                <SelectItem value="grammar">Ngữ pháp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border border-dashed p-4 space-y-3 bg-muted/30">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phần Intro (tuỳ chọn — hiển thị trên câu hỏi)</p>
          <div className="space-y-1.5">
            <Label>Văn bản intro</Label>
            <Textarea
              {...form.register('intro_text')}
              placeholder="Đoạn văn / ngữ cảnh cho người học đọc trước khi trả lời..."
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Ảnh intro</Label>
            <FileUploadField
              accept="image/*"
              storagePath={(file) => `questions/intro/${crypto.randomUUID()}-${file.name}`}
              currentUrl={form.watch('intro_image_url')}
              onUploadComplete={(url) => form.setValue('intro_image_url', url || undefined)}
              label="Tải ảnh intro"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Câu hỏi {questionType === 'fill_blank' && <span className="text-muted-foreground text-xs">(dùng {'{blank}'} cho chỗ trống)</span>}</Label>
          <Textarea
            {...form.register('prompt')}
            placeholder="Nhập câu hỏi..."
            rows={3}
          />
          {form.formState.errors.prompt && (
            <p className="text-xs text-destructive">{form.formState.errors.prompt.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Ảnh câu hỏi (tuỳ chọn)</Label>
          <FileUploadField
            accept="image/*"
            storagePath={(file) => `questions/${crypto.randomUUID()}-${file.name}`}
            currentUrl={form.watch('image_url')}
            onUploadComplete={(url) => form.setValue('image_url', url || undefined)}
            label="Tải ảnh lên"
          />
        </div>

        {showsAudioField && (
          <div className="space-y-1.5">
            <Label>Audio</Label>
            <FileUploadField
              accept="audio/*"
              storagePath={(file) => `questions/audio/${crypto.randomUUID()}-${file.name}`}
              currentUrl={form.watch('audio_url')}
              onUploadComplete={(url) => form.setValue('audio_url', url || undefined)}
              label="Tải audio lên"
            />
          </div>
        )}

        {showsPassageField && (
          <div className="space-y-1.5">
            <Label>Đoạn văn (Passage)</Label>
            <Textarea {...form.register('passage_text')} rows={5} placeholder="Nhập đoạn văn..." />
          </div>
        )}

        {questionType === 'mcq' && (
          <div className="space-y-1.5">
            <Label>Các đáp án (click vòng tròn để chọn đáp án đúng)</Label>
            <QuestionOptionBuilder />
          </div>
        )}

        {questionType === 'fill_blank' && (
          <>
            <div className="space-y-1.5">
              <Label>Đáp án đúng</Label>
              <Input {...form.register('correct_answer')} placeholder="Đáp án chính xác..." />
            </div>
            <div className="space-y-1.5">
              <Label>Đáp án chấp nhận thêm</Label>
              <Textarea
                value={(form.watch('accepted_answers') ?? []).join('\n')}
                onChange={(e) =>
                  form.setValue(
                    'accepted_answers',
                    e.target.value
                      .split('\n')
                      .map((value) => value.trim())
                      .filter(Boolean),
                  )}
                rows={4}
                placeholder={'Mỗi dòng là một biến thể hợp lệ\nVí dụ:\n28. dubna\n28. 4.\ndvacátého osmého dubna'}
              />
              <p className="text-xs text-muted-foreground">
                Dùng cho câu điền đáp án ngắn có nhiều cách viết đúng.
              </p>
            </div>
          </>
        )}

        {(questionType === 'speaking' || questionType === 'writing') && (
          <div className="space-y-1.5">
            <Label>Tiêu chí chấm điểm (rubric)</Label>
            <Textarea
              {...form.register('correct_answer')}
              rows={3}
              placeholder="Mô tả tiêu chí đánh giá cho AI..."
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label>Giải thích đáp án</Label>
          <Textarea
            {...form.register('explanation')}
            rows={3}
            placeholder="Giải thích tại sao đáp án đúng..."
          />
        </div>

        <div className="space-y-1.5">
          <Label>Điểm</Label>
          <Input
            type="number"
            {...form.register('points', { valueAsNumber: true })}
            className="w-24"
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Đang lưu...' : question ? 'Cập nhật' : 'Tạo câu hỏi'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Huỷ
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
