'use client'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { deleteExercise } from '@/actions/exercises'

export function DeleteExerciseButton({ id }: { id: string }) {
  return <ConfirmDialog onConfirm={() => deleteExercise(id)} />
}
