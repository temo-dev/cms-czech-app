'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  simple?: boolean
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  className,
  simple = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(simple ? { heading: false, bulletList: false, orderedList: false } : {}),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[80px] px-3 py-2',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value ?? '')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className={cn('border rounded-md', className)}>
      {!simple && (
        <div className="flex gap-1 border-b px-2 py-1">
          <button
            type="button"
            className={cn('px-2 py-0.5 text-xs rounded hover:bg-muted', editor?.isActive('bold') && 'bg-muted font-bold')}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >B</button>
          <button
            type="button"
            className={cn('px-2 py-0.5 text-xs rounded hover:bg-muted italic', editor?.isActive('italic') && 'bg-muted')}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >I</button>
          <button
            type="button"
            className={cn('px-2 py-0.5 text-xs rounded hover:bg-muted', editor?.isActive('bulletList') && 'bg-muted')}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >• List</button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}
