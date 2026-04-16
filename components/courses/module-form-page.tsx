'use client'
import { useRouter } from 'next/navigation'
import { ModuleForm } from './module-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Tables } from '@/lib/types/database.types'

interface ModuleFormPageProps {
  courseId: string
  module?: Tables<'modules'>
}

export function ModuleFormPage({ courseId, module }: ModuleFormPageProps) {
  const router = useRouter()
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href={`/courses/${courseId}`} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">{module ? 'Sửa module' : 'Thêm module'}</h1>
      </div>
      <ModuleForm
        courseId={courseId}
        module={module}
        onSaved={() => router.push(`/courses/${courseId}`)}
      />
    </div>
  )
}
