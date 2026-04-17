import { z } from 'zod'

export const courseSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug chỉ dùng chữ thường, số, gạch ngang'),
  title: z.string().min(1, 'Bắt buộc'),
  description: z.string().optional(),
  skill: z.enum(['reading', 'listening', 'writing', 'speaking']),
  is_premium: z.boolean(),
  thumbnail_url: z.string().optional(),
  order_index: z.number().int().min(0),
  instructor_name: z.string().optional(),
  instructor_bio: z.string().optional(),
  duration_days: z.number().int().min(1),
})

export const moduleSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(1, 'Bắt buộc'),
  description: z.string().optional(),
  order_index: z.number().int().min(0),
  is_locked: z.boolean(),
})

export const lessonSchema = z.object({
  module_id: z.string().uuid(),
  title: z.string().min(1, 'Bắt buộc'),
  description: z.string().optional(),
  duration_minutes: z.number().int().min(1),
  order_index: z.number().int().min(0),
  bonus_xp_cost: z.number().int().min(0),
})

export type CourseSchema = z.infer<typeof courseSchema>
export type ModuleSchema = z.infer<typeof moduleSchema>
export type LessonSchema = z.infer<typeof lessonSchema>
