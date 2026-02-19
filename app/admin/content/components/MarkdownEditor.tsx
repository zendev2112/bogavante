'use client'

import { Button } from '@/components/ui/button'
import { Bold, Italic, List, ListOrdered, Heading2, Link2 } from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById(
      'markdown-editor',
    ) as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end) || 'texto'
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end)

    onChange(newText)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length,
      )
    }, 0)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 p-2 border rounded-t-md bg-gray-50">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown('**', '**')}
          title="Negrita"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown('_', '_')}
          title="Cursiva"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown('## ', '\n')}
          title="Encabezado"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="w-px bg-gray-300 mx-1" />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown('- ')}
          title="Lista"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown('1. ')}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px bg-gray-300 mx-1" />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown('[', '](url)')}
          title="Enlace"
        >
          <Link2 className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown('> ')}
          title="Cita"
        >
          "
        </Button>
      </div>
      <textarea
        id="markdown-editor"
        className="w-full min-h-[400px] p-3 border rounded-b-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div className="text-xs text-gray-500 mt-2">
        Soporta <strong>Markdown</strong>: **negrita**, _cursiva_, ##
        encabezados, - listas, [enlaces](url)
      </div>
    </div>
  )
}
