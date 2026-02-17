import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FileText, Package, Users, Settings } from 'lucide-react'

export default function AdminPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Gestiona el contenido y el stock de Bogavante
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Content Management */}
        <Link href="/admin/content">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle>CMS de Contenido</CardTitle>
                  <CardDescription>Gestionar artículos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Edita, actualiza y publica artículos de recetas, salud y notas
                de mar
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Stock Management */}
        <Link href="/admin/stock">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <CardTitle>Gestión de Stock</CardTitle>
                  <CardDescription>Productos disponibles</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Administra el inventario de productos de marisco y pescado
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Blog View */}
        <Link href="/blog">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Ver Blog</CardTitle>
                  <CardDescription>Vista pública</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Visualiza el blog como lo verían los visitantes
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Importar Contenido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                Ejecuta el script de exportación desde la carpeta
                bogavante-content
              </p>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                cd ../bogavante-content && npm run export
              </code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Base de Datos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                Ver el esquema SQL en supabase-schema.sql
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://supabase.com/dashboard" target="_blank">
                  Abrir Supabase Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
