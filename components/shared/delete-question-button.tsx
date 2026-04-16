'use client'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { deleteQuestion } from '@/actions/questions'

export function DeleteQuestionButton({ id }: { id: string }) {
  return <ConfirmDialog onConfirm={() => deleteQuestion(id)} />
}
