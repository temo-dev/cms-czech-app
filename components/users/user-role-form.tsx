'use client'
import { useState, useTransition } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { updateUserRole } from '@/actions/users'
import { toast } from 'sonner'

interface UserRoleFormProps {
  userId: string
  currentRole: 'learner' | 'teacher' | 'admin'
}

export function UserRoleForm({ userId, currentRole }: UserRoleFormProps) {
  const [role, setRole] = useState(currentRole)
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      const result = await updateUserRole(userId, role)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Đã cập nhật vai trò')
      }
    })
  }

  return (
    <div className="space-y-3">
      <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="learner">Learner</SelectItem>
          <SelectItem value="teacher">Teacher</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      <Button
        size="sm"
        onClick={handleSave}
        disabled={isPending || role === currentRole}
      >
        {isPending ? 'Đang lưu...' : 'Lưu vai trò'}
      </Button>
    </div>
  )
}
