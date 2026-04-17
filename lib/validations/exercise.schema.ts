import { z } from 'zod'

const mcqContentSchema = z.object({
  intro_text: z.string().optional(),
  intro_image_url: z.string().optional(),
  prompt: z.string().min(1, 'Bắt buộc'),
  image_url: z.string().optional(),
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(1, 'Bắt buộc'),
        isCorrect: z.boolean(),
        imageUrl: z.string().optional(),
      })
    )
    .min(2, 'Cần ít nhất 2 đáp án')
    .refine((opts) => opts.some((o) => o.isCorrect), 'Phải có ít nhất 1 đáp án đúng'),
  explanation: z.string().optional(),
})

const fillBlankContentSchema = z.object({
  intro_text: z.string().optional(),
  intro_image_url: z.string().optional(),
  prompt: z
    .string()
    .min(1, 'Bắt buộc')
    .includes('{blank}', { message: 'Câu hỏi phải chứa {blank}' }),
  correctAnswer: z.string().min(1, 'Bắt buộc'),
  explanation: z.string().optional(),
})

const matchingContentSchema = z.object({
  intro_text: z.string().optional(),
  intro_image_url: z.string().optional(),
  prompt: z.string().optional(),
  pairs: z
    .array(
      z.object({
        leftId: z.string(),
        leftText: z.string().min(1),
        rightId: z.string(),
        rightText: z.string().min(1),
      })
    )
    .min(2, 'Cần ít nhất 2 cặp'),
  explanation: z.string().optional(),
})

const orderingContentSchema = z.object({
  intro_text: z.string().optional(),
  intro_image_url: z.string().optional(),
  prompt: z.string().min(1, 'Bắt buộc'),
  items: z
    .array(z.object({ id: z.string(), text: z.string().min(1) }))
    .min(2, 'Cần ít nhất 2 mục'),
  explanation: z.string().optional(),
})

const speakingWritingContentSchema = z.object({
  intro_text: z.string().optional(),
  intro_image_url: z.string().optional(),
  prompt: z.string().min(1, 'Bắt buộc'),
})

export const exerciseContentSchemas = {
  mcq: mcqContentSchema,
  fill_blank: fillBlankContentSchema,
  matching: matchingContentSchema,
  ordering: orderingContentSchema,
  speaking: speakingWritingContentSchema,
  writing: speakingWritingContentSchema,
  vocab: mcqContentSchema,
  grammar: mcqContentSchema,
  reading: mcqContentSchema,
  listening: mcqContentSchema,
}

export type ExerciseType = keyof typeof exerciseContentSchemas

export const exerciseBaseSchema = z.object({
  type: z.string().min(1),
  skill: z.string().optional(),
  xp_reward: z.number().int().min(0),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  points: z.number().int().min(0),
})

export type ExerciseBaseSchema = z.infer<typeof exerciseBaseSchema>
