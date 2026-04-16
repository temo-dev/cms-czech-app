import { z } from 'zod'

export const courseSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug chỉ dùng chữ thường, số, gạch ngang'),
  title: z.string().min(1, 'Bắt buộc'),
  description: z.string().optional(),
  skill: z.enum(['reading', 'listening', 'writing', 'speaking']),
  is_premium: z.boolean().default(false),
  thumbnail_url: z.string().optional(),
  order_index: z.number().int().min(0).default(0),
  instructor_name: z.string().optional(),
  instructor_bio: z.string().optional(),
  duration_days: z.number().int().min(1).default(30),
})

export const moduleSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(1, 'Bắt buộc'),
  description: z.string().optional(),
  order_index: z.number().int().min(0).default(0),
  is_locked: z.boolean().default(false),
})

export const lessonSchema = z.object({
  module_id: z.string().uuid(),
  title: z.string().min(1, 'Bắt buộc'),
  description: z.string().optional(),
  duration_minutes: z.number().int().min(1).default(15),
  order_index: z.number().int().min(0).default(0),
  bonus_xp_cost: z.number().int().min(0).default(50),
})

export type CourseSchema = z.infer<typeof courseSchema>
export type ModuleSchema = z.infer<typeof moduleSchema>
export type LessonSchema = z.infer<typeof lessonSchema>
