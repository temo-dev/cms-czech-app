import { BulkImportForm } from '@/components/questions/bulk-import-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function ImportQuestionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/questions" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Import câu hỏi hàng loạt</h1>
          <p className="text-sm text-muted-foreground">Upload file JSON với danh sách câu hỏi</p>
        </div>
      </div>
      <BulkImportForm />
    </div>
  )
}
