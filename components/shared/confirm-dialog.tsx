'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

interface ConfirmDialogProps {
  title?: string
  description?: string
  onConfirm: () => Promise<{ error?: string } | void>
  children?: React.ReactNode
}

export function ConfirmDialog({
  title = 'Xác nhận xoá?',
  description = 'Hành động này không thể hoàn tác.',
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={
          children
            ? undefined
            : 'inline-flex h-8 w-8 items-center justify-center rounded-md text-destructive hover:bg-accent transition-colors'
        }
      >
        {children ?? <Trash2 className="h-4 w-4" />}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
            onClick={() => {
              startTransition(async () => {
                const result = await onConfirm()
                if (result && 'error' in result && result.error) {
                  toast.error(result.error as string)
                } else {
                  toast.success('Đã xoá thành công')
                }
              })
            }}
          >
            {isPending ? 'Đang xoá...' : 'Xoá'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
