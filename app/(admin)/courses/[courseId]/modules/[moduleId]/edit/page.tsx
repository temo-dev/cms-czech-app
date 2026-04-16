import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ModuleFormPage } from '@/components/courses/module-form-page'

interface Props {
  params: Promise<{ courseId: string; moduleId: string }>
}

export default async function EditModulePage({ params }: Props) {
  const { courseId, moduleId } = await params
  const supabase = await createClient()
  const { data: mod } = await supabase.from('modules').select('*').eq('id', moduleId).single()
  if (!mod) notFound()
  return <ModuleFormPage courseId={courseId} module={mod} />
}
