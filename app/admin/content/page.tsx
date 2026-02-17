'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Search,
  Edit,
  Trash2,
  Save,
  X,
  Plus,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Quote,
  Code,
  Strikethrough,
  Minus,
  Eye,
  EyeOff,
} from 'lucide-react'
import { ContentWithType, ContentType } from '@/lib/cms-queries'

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
}

export default function ContentCMSPage() {
  const [contents, setContents] = useState<ContentWithType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all')
  const [editingContent, setEditingContent] = useState<ContentWithType | null>(
    null,
  )
  const [stats, setStats] = useState({ recetas: 0, salud: 0, notas_de_mar: 0 })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('Imagen')
  const pageSize = 20

  useEffect(() => {
    loadContent()
    loadStats()
  }, [page, selectedType, searchTerm])

  const loadContent = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/cms/content?page=${page}&pageSize=${pageSize}&contentType=${selectedType}&searchTerm=${searchTerm}`,
      )
      const result = await response.json()
      setContents(result.data || [])
      setTotal(result.totalCount || 0)
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/cms/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleEdit = (content: ContentWithType) => {
    setEditingContent(content)
  }

  const handleSave = async () => {
    if (!editingContent) return

    // Auto-generate slug from title if not manually set
    const slug = editingContent.slug || generateSlug(editingContent.title)

    try {
      const response = await fetch('/api/cms/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingContent.id,
          contentType: editingContent.contentType,
          updates: {
            title: editingContent.title,
            slug: slug,
            content: editingContent.content,
            resumen: editingContent.resumen,
            quality_score: editingContent.quality_score,
            image_url: editingContent.image_url,
            source_book: editingContent.source_book,
            source_authors: editingContent.source_authors,
            source_publisher: editingContent.source_publisher,
            source_year: editingContent.source_year,
            source_page: editingContent.source_page,
            published: editingContent.published,
          },
        }),
      })

      if (response.ok) {
        setEditingContent(null)
        loadContent()
        loadStats()
      } else {
        alert('Error saving content')
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('Error saving content')
    }
  }

  const handleDelete = async (id: string, contentType: ContentType) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este contenido?'))
      return

    try {
      const response = await fetch('/api/cms/content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, contentType }),
      })

      if (response.ok) {
        loadContent()
        loadStats()
      } else {
        alert('Error deleting content')
      }
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Error deleting content')
    }
  }

  // Editor helpers
  const insertText = (before: string, after: string = '') => {
    if (!editingContent) return
    const textarea = document.getElementById(
      'content-editor',
    ) as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = editingContent.content.substring(start, end)
    const newText =
      editingContent.content.substring(0, start) +
      before +
      selectedText +
      after +
      editingContent.content.substring(end)

    setEditingContent({ ...editingContent, content: newText })

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length,
      )
    }, 0)
  }

  const insertHeading = (level: number) => {
    const hashes = '#'.repeat(level)
    insertText(`${hashes} `, '\n')
  }

  const insertLink = () => {
    if (!editingContent) return
    const textarea = document.getElementById(
      'content-editor',
    ) as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText =
      editingContent.content.substring(start, end) || 'texto del enlace'

    const url = prompt('URL del enlace:')
    if (url) {
      const linkText = `[${selectedText}](${url})`
      const newText =
        editingContent.content.substring(0, start) +
        linkText +
        editingContent.content.substring(end)

      setEditingContent({ ...editingContent, content: newText })

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(
          start + linkText.length,
          start + linkText.length,
        )
      }, 0)
    }
  }

  const insertImage = () => {
    setImageDialogOpen(true)
  }

  const handleImageInsert = () => {
    if (imageUrl) {
      insertText(`\n![${imageAlt}](${imageUrl})\n`)
      setImageDialogOpen(false)
      setImageUrl('')
      setImageAlt('Imagen')
    }
  }

  const insertQuote = () => {
    insertText('> ', '\n')
  }

  const insertCodeBlock = () => {
    insertText('\n```\n', '\n```\n')
  }

  const insertHr = () => {
    insertText('\n---\n')
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Management System</h1>
          <p className="text-muted-foreground">
            Gestiona todo el contenido de Bogavante
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.recetas + stats.salud + stats.notas_de_mar}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Recetas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recetas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Salud</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.salud}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Notas de Mar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notas_de_mar}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título o contenido..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(1)
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedType}
              onValueChange={(value) => {
                setSelectedType(value as ContentType | 'all')
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo de contenido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="recetas">Recetas</SelectItem>
                <SelectItem value="salud">Salud</SelectItem>
                <SelectItem value="notas_de_mar">Notas de Mar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : contents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontró contenido
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Calidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Actualizado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contents.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell className="font-medium max-w-md truncate">
                        {content.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {content.contentType === 'recetas' && '🍽️ Receta'}
                          {content.contentType === 'salud' && '💚 Salud'}
                          {content.contentType === 'notas_de_mar' && '🌊 Nota'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            content.quality_score >= 80
                              ? 'default'
                              : content.quality_score >= 60
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {content.quality_score}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={content.published ? 'default' : 'secondary'}
                        >
                          {content.published ? '✓ Publicado' : '○ Borrador'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(content.updated_at).toLocaleDateString(
                          'es-ES',
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(content)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
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

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {(page - 1) * pageSize + 1} a{' '}
                  {Math.min(page * pageSize, total)} de {total} resultados
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog with Tabs */}
      <Dialog
        open={!!editingContent}
        onOpenChange={() => setEditingContent(null)}
      >
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Contenido</DialogTitle>
            <DialogDescription>
              Modifica el contenido y guarda para actualizar la base de datos.
            </DialogDescription>
          </DialogHeader>

          {editingContent && (
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Contenido</TabsTrigger>
                <TabsTrigger value="metadata">Metadatos</TabsTrigger>
                <TabsTrigger value="source">Fuente</TabsTrigger>
              </TabsList>

              {/* CONTENT TAB */}
              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
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
                  <Label htmlFor="slug">Slug (generado automáticamente)</Label>
                  <Input
                    id="slug"
                    value={editingContent.slug}
                    onChange={(e) =>
                      setEditingContent({
                        ...editingContent,
                        slug: e.target.value,
                      })
                    }
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="resumen">
                    Resumen (se muestra en la portada)
                  </Label>
                  <Textarea
                    id="resumen"
                    value={editingContent.resumen || ''}
                    onChange={(e) =>
                      setEditingContent({
                        ...editingContent,
                        resumen: e.target.value,
                      })
                    }
                    rows={3}
                    placeholder="Escribe un resumen breve para mostrar en la home..."
                  />
                </div>

                <div>
                  <div className="space-y-2 mb-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="content-editor">Contenido</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant={showPreview ? 'default' : 'outline'}
                        onClick={() => setShowPreview(!showPreview)}
                        title={
                          showPreview
                            ? 'Ocultar vista previa'
                            : 'Mostrar vista previa'
                        }
                      >
                        {showPreview ? (
                          <EyeOff className="h-3 w-3 mr-1" />
                        ) : (
                          <Eye className="h-3 w-3 mr-1" />
                        )}
                        {showPreview ? 'Ocultar' : 'Vista previa'}
                      </Button>
                    </div>

                    {/* Enhanced Toolbar */}
                    <div className="border rounded-md p-2 bg-muted/50 space-y-2">
                      {/* Row 1: Headings */}
                      <div className="flex gap-1 items-center">
                        <span className="text-xs text-muted-foreground mr-2">
                          Encabezados:
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => insertHeading(1)}
                          title="Título 1"
                          className="h-7"
                        >
                          <Heading1 className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => insertHeading(2)}
                          title="Título 2"
                          className="h-7"
                        >
                          <Heading2 className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => insertHeading(3)}
                          title="Título 3"
                          className="h-7"
                        >
                          <Heading3 className="h-3 w-3" />
                        </Button>
                      </div>

                      <Separator />

                      {/* Row 2: Text Formatting */}
                      <div className="flex gap-1 items-center">
                        <span className="text-xs text-muted-foreground mr-2">
                          Formato:
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => insertText('**', '**')}
                          title="Negrita"
                          className="h-7"
                        >
                          <Bold className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => insertText('*', '*')}
                          title="Cursiva"
                          className="h-7"
                        >
                          <Italic className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => insertText('~~', '~~')}
                          title="Tachado"
                          className="h-7"
                        >
                          <Strikethrough className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => insertText('`', '`')}
                          title="Código inline"
                          className="h-7"
                        >
                          <Code className="h-3 w-3" />
                        </Button>
                      </div>

                      <Separator />

                      {/* Row 3: Lists & Blocks */}
                      <div className="flex gap-1 items-center flex-wrap">
                        <span className="text-xs text-muted-foreground mr-2">
                          Bloques:
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => insertText('\n- ')}
                          title="Lista con viñetas"
                          className="h-7"
                        >
                          <List className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={insertQuote}
                          title="Cita"
                          className="h-7"
                        >
                          <Quote className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={insertCodeBlock}
                          title="Bloque de código"
                          className="h-7 text-xs px-2"
                        >
                          {'</>'}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={insertHr}
                          title="Línea horizontal"
                          className="h-7"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Separator />

                      {/* Row 4: Media & Links */}
                      <div className="flex gap-1 items-center">
                        <span className="text-xs text-muted-foreground mr-2">
                          Insertar:
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={insertLink}
                          title="Insertar enlace"
                          className="h-7"
                        >
                          <LinkIcon className="h-3 w-3 mr-1" />
                          Enlace
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={insertImage}
                          title="Insertar imagen"
                          className="h-7"
                        >
                          <ImageIcon className="h-3 w-3 mr-1" />
                          Imagen
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Editor and Preview */}
                  <div className={showPreview ? 'grid grid-cols-2 gap-4' : ''}>
                    <div>
                      <Textarea
                        id="content-editor"
                        value={editingContent.content}
                        onChange={(e) =>
                          setEditingContent({
                            ...editingContent,
                            content: e.target.value,
                          })
                        }
                        rows={20}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Usa **negrita**, *cursiva*, [enlace](url), ![alt](url)
                        para imágenes
                      </p>
                    </div>

                    {showPreview && (
                      <div className="border rounded-md p-4 bg-muted/10">
                        <div className="text-xs text-muted-foreground mb-2 font-semibold">
                          VISTA PREVIA
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-line">
                            {editingContent.content}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* METADATA TAB */}
              <TabsContent value="metadata" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quality">Calidad (0-100)</Label>
                    <Input
                      id="quality"
                      type="number"
                      min="0"
                      max="100"
                      value={editingContent.quality_score}
                      onChange={(e) =>
                        setEditingContent({
                          ...editingContent,
                          quality_score: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">URL de Imagen Principal</Label>
                    <Input
                      id="image"
                      value={editingContent.image_url || ''}
                      onChange={(e) =>
                        setEditingContent({
                          ...editingContent,
                          image_url: e.target.value,
                        })
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <Label>Estado de Publicación</Label>
                  <Select
                    value={editingContent.published ? 'published' : 'draft'}
                    onValueChange={(value) =>
                      setEditingContent({
                        ...editingContent,
                        published: value === 'published',
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">✓ Publicado</SelectItem>
                      <SelectItem value="draft">○ Borrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Especies Destacadas</Label>
                  <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-lg">
                    {editingContent.featured_species?.map((species, idx) => (
                      <Badge key={idx} variant="secondary">
                        {species.stockProduct} ({species.categoria})
                      </Badge>
                    ))}
                    {(!editingContent.featured_species ||
                      editingContent.featured_species.length === 0) && (
                      <p className="text-sm text-muted-foreground">
                        No hay especies asignadas
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* SOURCE TAB */}
              <TabsContent value="source" className="space-y-4">
                <div>
                  <Label htmlFor="source_book">Libro</Label>
                  <Input
                    id="source_book"
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
                  <Label htmlFor="source_authors">
                    Autores (separados por coma)
                  </Label>
                  <Input
                    id="source_authors"
                    value={editingContent.source_authors?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingContent({
                        ...editingContent,
                        source_authors: e.target.value
                          .split(',')
                          .map((a) => a.trim()),
                      })
                    }
                    placeholder="Autor 1, Autor 2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="source_publisher">Editorial</Label>
                    <Input
                      id="source_publisher"
                      value={editingContent.source_publisher || ''}
                      onChange={(e) =>
                        setEditingContent({
                          ...editingContent,
                          source_publisher: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="source_year">Año</Label>
                    <Input
                      id="source_year"
                      value={editingContent.source_year || ''}
                      onChange={(e) =>
                        setEditingContent({
                          ...editingContent,
                          source_year: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="source_page">Página</Label>
                  <Input
                    id="source_page"
                    type="number"
                    value={editingContent.source_page || ''}
                    onChange={(e) =>
                      setEditingContent({
                        ...editingContent,
                        source_page: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                  />
                </div>
              </TabsContent>

              {/* Save/Cancel Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setEditingContent(null)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Insert Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insertar Imagen</DialogTitle>
            <DialogDescription>
              Ingresa la URL de la imagen y un texto alternativo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-url">URL de la imagen</Label>
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="image-alt">Texto alternativo</Label>
              <Input
                id="image-alt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Descripción de la imagen"
                className="mt-1"
              />
            </div>
            {imageUrl && (
              <div className="border rounded-md p-2 bg-muted/10">
                <p className="text-xs text-muted-foreground mb-2">
                  Vista previa:
                </p>
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="max-h-48 mx-auto rounded"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setImageDialogOpen(false)
                setImageUrl('')
                setImageAlt('Imagen')
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleImageInsert} disabled={!imageUrl}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Insertar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
