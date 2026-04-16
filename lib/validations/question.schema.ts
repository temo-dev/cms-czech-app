import { z } from 'zod'

export const questionOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Bắt buộc'),
  image_url: z.string().optional(),
  is_correct: z.boolean(),
  order_index: z.number().int().default(0),
})

export const questionSchema = z.object({
  section_id: z.string().uuid().optional().nullable(),
  type: z.enum(['mcq', 'fill_blank', 'matching', 'ordering', 'speaking', 'writing']),
  skill: z.enum(['reading', 'listening', 'writing', 'speaking', 'vocabulary', 'grammar']).optional().nullable(),
  intro_text: z.string().optional().nullable(),
  intro_image_url: z.string().optional().nullable(),
  prompt: z.string().min(1, 'Bắt buộc'),
  audio_url: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  passage_text: z.string().optional().nullable(),
  correct_answer: z.string().optional().nullable(),
  explanation: z.string().optional().nullable(),
  points: z.number().int().min(0).default(1),
  order_index: z.number().int().min(0).default(0),
  options: z.array(questionOptionSchema).optional(),
})

export type QuestionSchema = z.infer<typeof questionSchema>
export type QuestionOptionSchema = z.infer<typeof questionOptionSchema>

export const bulkImportQuestionSchema = z.object({
  type: z.string(),
  skill: z.string().optional(),
  difficulty: z.string().optional(),
  prompt: z.string(),
  options: z
    .array(
      z.object({ text: z.string(), isCorrect: z.boolean() })
    )
    .optional(),
  correctAnswer: z.string().optional(),
  explanation: z.string().optional(),
  points: z.number().optional(),
})

export type BulkImportQuestion = z.infer<typeof bulkImportQuestionSchema>
