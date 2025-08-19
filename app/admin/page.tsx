"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import stockData from '../../bogavante-stock/stock.json'

interface ProductoAgrupado {
  categoria: string
  subcategoria: string
  producto: string
  presentaciones: {
    nombre: string
    unidad: string
    disponible: boolean
    precio: string
    ejemplos_notas: string
    enStock: boolean
  }[]
  unidadSeleccionada: string
  id: string
  enStock: boolean
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

// Standard presentations for all fish
const presentacionesPescado = [
  { nombre: 'Entero eviscerado', unidad: 'kg' },
  { nombre: 'Filete con piel', unidad: 'kg' },
  { nombre: 'Filete sin piel', unidad: 'kg' },
  { nombre: 'Lomo', unidad: 'kg' },
  { nombre: 'Medallón', unidad: 'kg' },
  { nombre: 'Trozo', unidad: 'kg' }
]

// Standard presentations for all seafood
const presentacionesMarisco = [
  { nombre: 'Entero crudo', unidad: 'kg' },
  { nombre: 'Entero cocido', unidad: 'kg' },
  { nombre: 'Pelado crudo', unidad: 'kg' },
  { nombre: 'Pelado cocido', unidad: 'kg' },
  { nombre: 'Vivo', unidad: 'kg' },
  { nombre: 'Por unidad', unidad: 'unidad' },
  { nombre: 'Por docena', unidad: 'docena' }
]

export default function AdminStockPage() {
  const [productos, setProductos] = useState<ProductoAgrupado[]>([])
  const [filtroCategoria, setFiltroCategoria] = useState<string>('all')
  const [busqueda, setBusqueda] = useState<string>('')
  
  // Initialize products from JSON - Group by product name with standard presentations
  useEffect(() => {
    const productosAgrupados: { [key: string]: ProductoAgrupado } = {}
    
    stockData.forEach((item, index) => {
      const key = `${item.categoria}-${item.producto}`
      
      if (!productosAgrupados[key]) {
        // Determine standard presentations based on subcategory
        let presentacionesEstandar = []
        if (item.subcategoria === 'Pescado') {
          presentacionesEstandar = presentacionesPescado
        } else if (item.subcategoria === 'Marisco') {
          presentacionesEstandar = presentacionesMarisco
        } else {
          // For other categories, use what's in the JSON
          const presentacionesUnicas = stockData
            .filter(p => p.categoria === item.categoria && p.producto === item.producto)
            .map(p => ({ nombre: p.presentacion, unidad: p.unidad }))
          presentacionesEstandar = presentacionesUnicas
        }

        // Get all possible units for this product
        const unidadesDisponibles = presentacionesEstandar.map(p => p.unidad)
        const uniqueUnidades = [...new Set(unidadesDisponibles)]
        
        productosAgrupados[key] = {
          categoria: item.categoria,
          subcategoria: item.subcategoria,
          producto: item.producto,
          presentaciones: presentacionesEstandar.map(pres => ({
            nombre: pres.nombre,
            unidad: pres.unidad,
            disponible: false,
            precio: '',
            ejemplos_notas: '',
            enStock: false
          })),
          unidadSeleccionada: uniqueUnidades[0] || 'kg',
          id: key,
          enStock: false
        }
      }
    })
    
    setProductos(Object.values(productosAgrupados))
  }, [])

  // Get unique categories
  const categorias = ['all', ...Array.from(new Set(stockData.map(item => item.categoria)))]

  // Filter products
  const productosFiltrados = productos.filter(producto => {
    const matchCategoria = filtroCategoria === 'all' || producto.categoria === filtroCategoria
    const matchBusqueda = producto.producto.toLowerCase().includes(busqueda.toLowerCase())
    return matchCategoria && matchBusqueda
  })

  const cambiarStockProducto = (productId: string) => {
    setProductos(productos.map(p => 
      p.id === productId ? { ...p, enStock: !p.enStock } : p
    ))
  }

  const cambiarUnidad = (productId: string, nuevaUnidad: string) => {
    setProductos(productos.map(p => 
      p.id === productId ? { ...p, unidadSeleccionada: nuevaUnidad } : p
    ))
  }

  const cambiarPresentacion = (productId: string, presentacionIndex: number, disponible: boolean) => {
    setProductos(productos.map(p => {
      if (p.id === productId) {
        const newPresentaciones = [...p.presentaciones]
        newPresentaciones[presentacionIndex] = {
          ...newPresentaciones[presentacionIndex],
          disponible
        }
        return { ...p, presentaciones: newPresentaciones }
      }
      return p
    }))
  }

  const cambiarStockPresentacion = (productId: string, presentacionIndex: number) => {
    setProductos(productos.map(p => {
      if (p.id === productId) {
        const newPresentaciones = [...p.presentaciones]
        newPresentaciones[presentacionIndex] = {
          ...newPresentaciones[presentacionIndex],
          enStock: !newPresentaciones[presentacionIndex].enStock
        }
        return { ...p, presentaciones: newPresentaciones }
      }
      return p
    }))
  }

  const actualizarPrecio = (productId: string, presentacionIndex: number, precio: string) => {
    setProductos(productos.map(p => {
      if (p.id === productId) {
        const newPresentaciones = [...p.presentaciones]
        newPresentaciones[presentacionIndex] = {
          ...newPresentaciones[presentacionIndex],
          precio
        }
        return { ...p, presentaciones: newPresentaciones }
      }
      return p
    }))
  }

  const guardarStock = () => {
    const productosDisponibles: any[] = []
    
    productos.forEach(producto => {
      if (producto.enStock) {
        producto.presentaciones.forEach(presentacion => {
          if (presentacion.disponible && presentacion.precio && presentacion.enStock) {
            productosDisponibles.push({
              categoria: producto.categoria,
              subcategoria: producto.subcategoria,
              producto: producto.producto,
              presentacion: presentacion.nombre,
              unidad: producto.unidadSeleccionada,
              precio: presentacion.precio,
              ejemplos_notas: presentacion.ejemplos_notas
            })
          }
        })
      }
    })
    
    console.log('Stock guardado:', productosDisponibles)
    alert(`¡Stock guardado! ${productosDisponibles.length} productos disponibles`)
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

  const totalProductosDisponibles = productos.filter(p => p.enStock).length
  const totalPresentacionesDisponibles = productos.reduce((total, producto) => {
    return total + producto.presentaciones.filter(p => p.disponible && p.precio && p.enStock).length
  }, 0)

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
              En Stock: {totalProductosDisponibles}
            </Badge>
            <Badge variant="default" className="px-4 py-2 bg-blue-500">
              Disponibles: {totalPresentacionesDisponibles}
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <Input
              placeholder="🔍 Buscar producto..."
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
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4 mb-8">
          {productosFiltrados.map((producto) => {
            const unidadesDisponibles = [...new Set(producto.presentaciones.map(p => p.unidad))]
            const presentacionesFiltradas = producto.presentaciones.filter(p => 
              p.unidad === producto.unidadSeleccionada
            )
            
            return (
              <Card key={producto.id} className={`shadow-sm transition-all ${producto.enStock ? 'ring-2 ring-blue-300' : ''}`}>
                <CardContent className="p-6">
                  {/* Product Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {producto.producto}
                        </h3>
                        <Badge className={getCategoriaColor(producto.categoria)} variant="secondary">
                          {producto.categoria}
                        </Badge>
                        
                        {/* STOCK BUTTON */}
                        <Button
                          variant={producto.enStock ? "default" : "outline"}
                          onClick={() => cambiarStockProducto(producto.id)}
                          className={`ml-4 ${
                            producto.enStock 
                              ? 'bg-blue-500 hover:bg-blue-600' 
                              : 'bg-gray-400 hover:bg-gray-500 text-white border-gray-400'
                          }`}
                        >
                          {producto.enStock ? '✅ EN STOCK' : '❌ SIN STOCK'}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Subcategoría:</span> {producto.subcategoria}
                      </p>
                    </div>

                    {/* Unit Selector */}
                    <div className="flex flex-col items-start lg:items-end gap-2">
                      <label className="text-sm font-medium text-gray-700">Unidad de venta:</label>
                      <select
                        value={producto.unidadSeleccionada}
                        onChange={(e) => cambiarUnidad(producto.id, e.target.value)}
                        className="p-2 border rounded-md bg-white min-w-[120px]"
                        disabled={!producto.enStock}
                      >
                        {unidadesDisponibles.map(unidad => (
                          <option key={unidad} value={unidad}>
                            {unidad} ({unidadLabels[unidad] || `/${unidad}`})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Presentations - Only show if product is in stock */}
                  {producto.enStock && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">
                        Presentaciones disponibles:
                      </h4>
                      
                      {presentacionesFiltradas.length === 0 && (
                        <p className="text-gray-500 italic">
                          No hay presentaciones disponibles para la unidad seleccionada
                        </p>
                      )}
                      
                      {presentacionesFiltradas.map((presentacion, index) => {
                        const originalIndex = producto.presentaciones.findIndex(p => 
                          p.nombre === presentacion.nombre && p.unidad === presentacion.unidad
                        )
                        
                        return (
                          <div key={`${presentacion.nombre}-${index}`} 
                               className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                                 presentacion.enStock ? (presentacion.disponible ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200') : 'bg-gray-50 border-gray-200'
                               }`}>
                            
                            {/* Stock Checkbox */}
                            <Checkbox
                              checked={presentacion.enStock}
                              onCheckedChange={() => 
                                cambiarStockPresentacion(producto.id, originalIndex)
                              }
                              className="w-5 h-5"
                            />
                            
                            {/* Sell Checkbox */}
                            <Checkbox
                              checked={presentacion.disponible}
                              onCheckedChange={(checked) => 
                                cambiarPresentacion(producto.id, originalIndex, checked as boolean)
                              }
                              className="w-5 h-5"
                              disabled={!presentacion.enStock}
                            />
                            
                            {/* Presentation Info */}
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">
                                {presentacion.nombre}
                              </p>
                              <p className="text-xs text-gray-500">
                                🔵 En stock | ✅ A la venta
                              </p>
                            </div>
                            
                            {/* Price Input */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">$</span>
                              <Input
                                type="number"
                                placeholder="0000"
                                value={presentacion.precio}
                                onChange={(e) => actualizarPrecio(producto.id, originalIndex, e.target.value)}
                                className="w-24 text-center"
                                disabled={!presentacion.disponible || !presentacion.enStock}
                              />
                              <span className="text-sm text-gray-600 whitespace-nowrap min-w-[50px]">
                                {unidadLabels[producto.unidadSeleccionada] || `/${producto.unidadSeleccionada}`}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Save Button - Fixed at bottom */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <Button 
            onClick={guardarStock}
            className="bg-green-600 hover:bg-green-700 text-white text-xl py-4 px-8 shadow-lg rounded-full"
          >
            💾 GUARDAR STOCK ({totalPresentacionesDisponibles})
          </Button>
        </div>

        {/* Spacer for fixed button */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}