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
  presentacion_formato: string
  ejemplos_notas: string
  precio?: string
  disponible?: boolean
  id?: string
}

export default function AdminStockPage() {
  const [productos, setProductos] = useState<StockItem[]>([])
  const [filtroCategoria, setFiltroCategoria] = useState<string>('all')
  const [busqueda, setBusqueda] = useState<string>('')
  
  // Initialize products from JSON
  useEffect(() => {
    const productosConEstado = stockData.map((item, index) => ({
      ...item,
      id: `${item.categoria}-${item.producto}-${index}`,
      precio: '',
      disponible: false
    }))
    setProductos(productosConEstado)
  }, [])

  // Get unique categories
  const categorias = ['all', ...Array.from(new Set(stockData.map(item => item.categoria)))]

  // Filter products
  const productosFiltrados = productos.filter(producto => {
    const matchCategoria = filtroCategoria === 'all' || producto.categoria === filtroCategoria
    const matchBusqueda = producto.producto.toLowerCase().includes(busqueda.toLowerCase())
    return matchCategoria && matchBusqueda
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
    
    // Aquí guardarías en tu base de datos o localStorage
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

  const productosDisponibles = productos.filter(p => p.disponible).length

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
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
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <Input
              placeholder="🔍 Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="md:w-1/3"
            />
            
            {/* Category Filter */}
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="md:w-1/3 p-2 border rounded-md"
            >
              <option value="all">📋 Todas las categorías</option>
              {categorias.slice(1).map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4 mb-8">
          {productosFiltrados.map((producto) => (
            <Card key={producto.id} className={`shadow-sm transition-all ${producto.disponible ? 'ring-2 ring-green-200' : ''}`}>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {producto.producto}
                      </h3>
                      <Badge className={getCategoriaColor(producto.categoria)}>
                        {producto.categoria}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Subcategoría:</span> {producto.subcategoria}
                    </p>
                    
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Presentaciones:</span> {producto.presentacion_formato}
                    </p>
                    
                    {producto.ejemplos_notas && (
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="font-medium">Notas:</span> {producto.ejemplos_notas}
                      </p>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center space-x-4 lg:justify-end">
                    {/* Price Input */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">$</span>
                      <Input
                        type="number"
                        placeholder="0000"
                        value={producto.precio}
                        onChange={(e) => actualizarPrecio(producto.id!, e.target.value)}
                        className="w-24 text-center"
                        disabled={!producto.disponible}
                      />
                      <span className="text-sm text-gray-600">/kg</span>
                    </div>
                    
                    {/* Availability Toggle */}
                    <Button
                      variant={producto.disponible ? "default" : "outline"}
                      onClick={() => cambiarDisponibilidad(producto.id!)}
                      className={`w-28 ${
                        producto.disponible 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-gray-400 hover:bg-gray-500 text-white'
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

        {/* Save Button */}
        <div className="text-center sticky bottom-4">
          <Button 
            onClick={guardarStock}
            className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white text-xl py-4 shadow-lg"
          >
            💾 GUARDAR STOCK ({productosDisponibles} productos)
          </Button>
        </div>
      </div>
    </div>
  )
}