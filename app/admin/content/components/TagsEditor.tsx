'use client'

import { useState } from 'react'
import { X, Plus, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { generateTagsFromText } from '@/lib/tag-generator'
import type { ContentType } from '@/lib/cms-queries'

interface TagsEditorProps {
  tags: string[]
  onChange: (tags: string[]) => void
  contentType: ContentType
  category?: string | null
  contentText?: string
  featuredSpecies?: string[]
}

export function TagsEditor({
  tags,
  onChange,
  contentType,
  category,
  contentText,
  featuredSpecies,
}: TagsEditorProps) {
  const [inputValue, setInputValue] = useState('')

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInputValue('')
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(inputValue)
    }
  }

  const handleAutoGenerate = () => {
    if (!contentText) return
    const generated = generateTagsFromText(
      contentText,
      contentType,
      category,
      featuredSpecies,
    )
    // Merge with existing, deduplicate
    const merged = Array.from(new Set([...tags, ...generated]))
    onChange(merged.slice(0, 20))
  }

  return (
    <div className="space-y-3">
      {/* Tag pills */}
      <div className="flex flex-wrap gap-2 min-h-[36px]">
        {tags.length === 0 && (
          <span className="text-sm text-muted-foreground italic">
            Sin etiquetas
          </span>
        )}
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-[#2B2E78]/10 text-[#2B2E78] text-xs font-semibold px-3 py-1 rounded-full border border-[#2B2E78]/20"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red-500 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Add tag input */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribir etiqueta y Enter..."
          className="text-black dark:text-white text-sm"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addTag(inputValue)}
          disabled={!inputValue.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAutoGenerate}
          disabled={!contentText}
          title="Generar etiquetas automáticamente desde el contenido"
          className="gap-1 text-xs"
        >
          <Wand2 className="w-4 h-4" />
          Auto
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Presioná Enter o coma para agregar. El botón <strong>Auto</strong>{' '}
        genera etiquetas según el contenido y subcategoría.
      </p>
    </div>
  )
}
