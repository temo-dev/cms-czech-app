import { z } from 'zod'

export const examSchema = z.object({
  title: z.string().min(1, 'Bắt buộc'),
  duration_minutes: z.number().int().min(1).default(60),
  is_active: z.boolean().default(false),
})

export const examSectionSchema = z.object({
  exam_id: z.string().uuid(),
  skill: z.enum(['reading', 'listening', 'writing', 'speaking']),
  label: z.string().min(1),
  question_count: z.number().int().min(1).default(10),
  section_duration_minutes: z.number().int().optional().nullable(),
  order_index: z.number().int().min(0).default(0),
})

export type ExamSchema = z.infer<typeof examSchema>
export type ExamSectionSchema = z.infer<typeof examSectionSchema>
