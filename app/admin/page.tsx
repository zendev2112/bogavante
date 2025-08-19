"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import stockData from '../../bogavante-stock/stock.json'

interface StockItem {
  categoria: string
  subcategoria: string
  producto: string
  presentacion: string
  unidad: string
  ejemplos_notas: string
  precio?: string
  disponible?: boolean
  id?: string
}

const unidadLabels: { [key: string]: string } = {
  'kg': '/kg',
  'unidad': '/unidad',
  'docena': '/docena',
  'porción': '/porción',
  'bandeja': '/bandeja',
  'paquete': '/paquete',
  'litro': '/litro'
}

export default function AdminStockPage() {
  const [productos, setProductos] = useState<StockItem[]>([])
  const [filtroCategoria, setFiltroCategoria] = useState<string>('all')
  const [filtroUnidad, setFiltroUnidad] = useState<string>('all')
  const [busqueda, setBusqueda] = useState<string>('')
  
  // Initialize products from JSON
  useEffect(() => {
    const productosConEstado = stockData.map((item, index) => ({
      ...item,
      id: `${item.categoria}-${item.producto}-${item.presentacion}-${index}`,
      precio: '',
      disponible: false
    }))
    setProductos(productosConEstado)
  }, [])

  // Get unique categories and units
  const categorias = ['all', ...Array.from(new Set(stockData.map(item => item.categoria)))]
  const unidades = ['all', ...Array.from(new Set(stockData.map(item => item.unidad)))]

  // Filter products
  const productosFiltrados = productos.filter(producto => {
    const matchCategoria = filtroCategoria === 'all' || producto.categoria === filtroCategoria
    const matchUnidad = filtroUnidad === 'all' || producto.unidad === filtroUnidad
    const matchBusqueda = producto.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
                         producto.presentacion.toLowerCase().includes(busqueda.toLowerCase())
    return matchCategoria && matchUnidad && matchBusqueda
  })

  const actualizarPrecio = (id: string, precio: string) => {
    setProductos(productos.map(p => 
      p.id === id ? { ...p, precio } : p
    ))
  }

  const cambiarDisponibilidad = (id: string) => {
    setProductos(productos.map(p => 
      p.id === id ? { ...p, disponible: !p.disponible } : p
    ))
  }

  const guardarStock = () => {
    const productosDisponibles = productos.filter(p => p.disponible && p.precio)
    console.log('Stock guardado:', productosDisponibles)
    alert(`¡Stock guardado! ${productosDisponibles.length} productos disponibles`)
    
    // Save to localStorage (can be upgraded to database later)
    localStorage.setItem('bogavante-stock', JSON.stringify(productosDisponibles))
  }

  const getCategoriaColor = (categoria: string) => {
    const colores: { [key: string]: string } = {
      'Fresco - Marino': 'bg-blue-100 text-blue-800',
      'Fresco - Continental (río)': 'bg-green-100 text-green-800',
      'Fresco - Acuicultura': 'bg-teal-100 text-teal-800',
      'Elaborados - Pescado': 'bg-orange-100 text-orange-800',
      'Elaborados - Mariscos': 'bg-purple-100 text-purple-800',
      'Conservas/Latas/Frascos': 'bg-yellow-100 text-yellow-800',
      'Ahumados/Curados': 'bg-red-100 text-red-800',
      'Listos para comer': 'bg-pink-100 text-pink-800',
      'Pastas y panificados': 'bg-indigo-100 text-indigo-800',
      'Untables y salsas': 'bg-gray-100 text-gray-800',
      'Caldos y bases': 'bg-cyan-100 text-cyan-800',
      'Otros procesados': 'bg-lime-100 text-lime-800',
      'Complementos': 'bg-amber-100 text-amber-800'
    }
    return colores[categoria] || 'bg-gray-100 text-gray-800'
  }

  const getUnidadColor = (unidad: string) => {
    const colores: { [key: string]: string } = {
      'kg': 'bg-green-500 text-white',
      'unidad': 'bg-blue-500 text-white',
      'docena': 'bg-purple-500 text-white',
      'porción': 'bg-orange-500 text-white',
      'bandeja': 'bg-pink-500 text-white',
      'paquete': 'bg-indigo-500 text-white',
      'litro': 'bg-cyan-500 text-white'
    }
    return colores[unidad] || 'bg-gray-500 text-white'
  }

  const productosDisponibles = productos.filter(p => p.disponible).length

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            🏪 EL BOGAVANTE - GESTIÓN DE STOCK
          </h1>
          <div className="flex justify-center space-x-4 text-lg">
            <Badge variant="secondary" className="px-4 py-2">
              Total: {productos.length} productos
            </Badge>
            <Badge variant="default" className="px-4 py-2 bg-green-500">
              Disponibles: {productosDisponibles}
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <Input
              placeholder="🔍 Buscar producto o presentación..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            
            {/* Category Filter */}
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="all">📋 Todas las categorías</option>
              {categorias.slice(1).map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>

            {/* Unit Filter */}
            <select
              value={filtroUnidad}
              onChange={(e) => setFiltroUnidad(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="all">⚖️ Todas las unidades</option>
              {unidades.slice(1).map(unidad => (
                <option key={unidad} value={unidad}>{unidad}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-3 mb-8">
          {productosFiltrados.map((producto) => (
            <Card key={producto.id} className={`shadow-sm transition-all hover:shadow-md ${producto.disponible ? 'ring-2 ring-green-300 bg-green-50' : 'bg-white'}`}>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {producto.producto}
                      </h3>
                      <Badge className={getCategoriaColor(producto.categoria)} variant="secondary">
                        {producto.categoria}
                      </Badge>
                      <Badge className={getUnidadColor(producto.unidad)}>
                        {producto.unidad}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Subcategoría:</span> {producto.subcategoria}
                      </p>
                      <p>
                        <span className="font-medium">Presentación:</span> {producto.presentacion}
                      </p>
                    </div>
                    
                    {producto.ejemplos_notas && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        <span className="font-medium">Notas:</span> {producto.ejemplos_notas}
                      </p>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center space-x-3 lg:justify-end">
                    {/* Price Input */}
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">$</span>
                      <Input
                        type="number"
                        placeholder="0000"
                        value={producto.precio}
                        onChange={(e) => actualizarPrecio(producto.id!, e.target.value)}
                        className="w-20 text-center text-sm"
                        disabled={!producto.disponible}
                      />
                      <span className="text-xs text-gray-600 whitespace-nowrap">
                        {unidadLabels[producto.unidad] || `/${producto.unidad}`}
                      </span>
                    </div>
                    
                    {/* Availability Toggle */}
                    <Button
                      variant={producto.disponible ? "default" : "outline"}
                      onClick={() => cambiarDisponibilidad(producto.id!)}
                      size="sm"
                      className={`whitespace-nowrap ${
                        producto.disponible 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-gray-400 hover:bg-gray-500 text-white border-gray-400'
                      }`}
                    >
                      {producto.disponible ? '✅ DISPONIBLE' : '❌ NO DISP.'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results message */}
        {productosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron productos con los filtros seleccionados
            </p>
          </div>
        )}

        {/* Save Button - Fixed at bottom */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <Button 
            onClick={guardarStock}
            className="bg-green-600 hover:bg-green-700 text-white text-xl py-4 px-8 shadow-lg rounded-full"
          >
            💾 GUARDAR STOCK ({productosDisponibles})
          </Button>
        </div>

        {/* Spacer for fixed button */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}