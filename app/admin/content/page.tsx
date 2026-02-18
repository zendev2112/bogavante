'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil, Trash2, Search } from 'lucide-react'
import type { ContentWithType, ContentType } from '@/lib/cms-queries'

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const NOTAS_CATEGORIES = [
  { value: 'productos', label: 'Productos' },
  { value: 'consejos', label: 'Consejos' },
  { value: 'origen', label: 'Origen' },
  { value: 'curiosidades', label: 'Curiosidades' },
]

const SALUD_CATEGORIES = [
  { value: 'beneficios', label: 'Beneficios' },
  { value: 'nutricion', label: 'Nutrición' },
  { value: 'dietas', label: 'Dietas' },
  { value: 'mitos', label: 'Mitos y verdades' },
]

export default function ContentCMSPage() {
  const [contents, setContents] = useState<ContentWithType[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentWithType | null>(
    null,
  )
  const [contentTypeFilter, setContentTypeFilter] = useState<
    ContentType | 'all'
  >('all')
  const [searchTerm, setSearchTerm] = useState('')

  const pageSize = 20

  // Fetch content
  const fetchContent = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        contentType: contentTypeFilter,
        searchTerm: searchTerm,
      })

      const response = await fetch(`/api/cms/content?${params}`)
      const data = await response.json()

      setContents(data.data || [])
      setTotalCount(data.totalCount || 0)
    } catch (error) {
      console.error('Error fetching content:', error)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [currentPage, contentTypeFilter, searchTerm])

  const handleEdit = (content: ContentWithType) => {
    setEditingContent(content)
    setIsEditDialogOpen(true)
  }

  const handleSave = async () => {
    if (!editingContent) return

    try {
      const response = await fetch('/api/cms/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingContent.id,
          contentType: editingContent.contentType,
          updates: {
            title: editingContent.title,
            slug: editingContent.slug,
            content: editingContent.content,
            resumen: editingContent.resumen,
            quality_score: editingContent.quality_score,
            featured_species: editingContent.featured_species,
            images: editingContent.images,
            image_url: editingContent.image_url,
            source_book: editingContent.source_book,
            source_authors: editingContent.source_authors,
            published: editingContent.published,
            category: (editingContent as any).category || null,
          },
        }),
      })

      if (response.ok) {
        setIsEditDialogOpen(false)
        fetchContent()
      }
    } catch (error) {
      console.error('Error saving content:', error)
    }
  }

  const handleDelete = async (id: string, contentType: ContentType) => {
    if (!confirm('¿Estás seguro de eliminar este contenido?')) return

    try {
      const response = await fetch('/api/cms/content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, contentType }),
      })

      if (response.ok) {
        fetchContent()
      }
    } catch (error) {
      console.error('Error deleting content:', error)
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  const getCategoryLabel = (contentType: string, category: string | null) => {
    if (!category) return '-'
    if (contentType === 'notas_de_mar') {
      return (
        NOTAS_CATEGORIES.find((c) => c.value === category)?.label || category
      )
    }
    if (contentType === 'salud') {
      return (
        SALUD_CATEGORIES.find((c) => c.value === category)?.label || category
      )
    }
    return '-'
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Contenido</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Label>Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título o contenido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-48">
          <Label>Tipo de Contenido</Label>
          <Select
            value={contentTypeFilter}
            onValueChange={(value) =>
              setContentTypeFilter(value as ContentType | 'all')
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="recetas">Recetas</SelectItem>
              <SelectItem value="notas_de_mar">Notas de Mar</SelectItem>
              <SelectItem value="salud">Salud</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 text-sm text-muted-foreground">
        Total de artículos: {totalCount}
      </div>

      {/* Content Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Calidad</TableHead>
              <TableHead>Publicado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.map((content) => (
              <TableRow key={content.id}>
                <TableCell className="font-medium">{content.title}</TableCell>
                <TableCell>
                  {content.contentType === 'recetas' && 'Receta'}
                  {content.contentType === 'notas_de_mar' && 'Nota de Mar'}
                  {content.contentType === 'salud' && 'Salud'}
                </TableCell>
                <TableCell>
                  {getCategoryLabel(
                    content.contentType,
                    (content as any).category,
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {content.slug}
                </TableCell>
                <TableCell>{content.quality_score}</TableCell>
                <TableCell>
                  {content.published ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✗</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(content)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDelete(content.id, content.contentType)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Contenido</DialogTitle>
          </DialogHeader>
          {editingContent && (
            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={editingContent.title}
                  onChange={(e) => {
                    const newTitle = e.target.value
                    setEditingContent({
                      ...editingContent,
                      title: newTitle,
                      slug: generateSlug(newTitle),
                    })
                  }}
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={editingContent.slug}
                  onChange={(e) =>
                    setEditingContent({
                      ...editingContent,
                      slug: e.target.value,
                    })
                  }
                />
              </div>

              {/* Category Dropdown - Only for Notas de Mar and Salud */}
              {editingContent.contentType === 'notas_de_mar' && (
                <div>
                  <Label>Categoría</Label>
                  <Select
                    value={(editingContent as any).category || ''}
                    onValueChange={(value) =>
                      setEditingContent({
                        ...editingContent,
                        category: value,
                      } as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTAS_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {editingContent.contentType === 'salud' && (
                <div>
                  <Label>Categoría</Label>
                  <Select
                    value={(editingContent as any).category || ''}
                    onValueChange={(value) =>
                      setEditingContent({
                        ...editingContent,
                        category: value,
                      } as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {SALUD_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label>Resumen</Label>
                <Input
                  value={editingContent.resumen || ''}
                  onChange={(e) =>
                    setEditingContent({
                      ...editingContent,
                      resumen: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Contenido</Label>
                <textarea
                  className="w-full min-h-[300px] p-3 border rounded-md"
                  value={editingContent.content}
                  onChange={(e) =>
                    setEditingContent({
                      ...editingContent,
                      content: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>URL de Imagen</Label>
                <Input
                  value={editingContent.image_url || ''}
                  onChange={(e) =>
                    setEditingContent({
                      ...editingContent,
                      image_url: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Libro Fuente</Label>
                <Input
                  value={editingContent.source_book || ''}
                  onChange={(e) =>
                    setEditingContent({
                      ...editingContent,
                      source_book: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Autores</Label>
                <Input
                  value={editingContent.source_authors || ''}
                  onChange={(e) =>
                    setEditingContent({
                      ...editingContent,
                      source_authors: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={editingContent.published}
                  onChange={(e) =>
                    setEditingContent({
                      ...editingContent,
                      published: e.target.checked,
                    })
                  }
                />
                <Label htmlFor="published">Publicado</Label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave}>Guardar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
