'use client'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { deleteExam } from '@/actions/exams'

export function DeleteExamButton({ id }: { id: string }) {
  return <ConfirmDialog onConfirm={() => deleteExam(id)} />
}
