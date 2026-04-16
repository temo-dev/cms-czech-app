'use client'
import { ConfirmDialog } from './confirm-dialog'
import { deleteCourse } from '@/actions/courses'

export function DeleteCourseButton({ courseId }: { courseId: string }) {
  return <ConfirmDialog onConfirm={() => deleteCourse(courseId)} />
}
