import { ModuleFormPage } from '@/components/courses/module-form-page'

interface Props {
  params: Promise<{ courseId: string }>
}

export default async function NewModulePage({ params }: Props) {
  const { courseId } = await params
  return <ModuleFormPage courseId={courseId} />
}
