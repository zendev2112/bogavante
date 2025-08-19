"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import stockData from '../../bogavante-stock/stock.json'
import sushiData from '../../bogavante-stock/insumos_sushi.json'

interface GroupedProduct {
  category: string
  subcategory: string
  product: string
  presentations: {
    name: string
    unit: string
    available: boolean
    price: string
    notes: string
    inStock: boolean
  }[]
  selectedUnit: string
  id: string
  inStock: boolean
}

const unitLabels: { [key: string]: string } = {
  'kg': '/kg',
  'unidad': '/unidad',
  'docena': '/docena',
  'porción': '/porción',
  'bandeja': '/bandeja',
  'paquete': '/paquete',
  'litro': '/litro',
  'gramos': '/g',
  'ml': '/ml'
}

// Standard presentations for all fish
const fishPresentations = [
  { name: 'Entero eviscerado', unit: 'kg' },
  { name: 'Filete con piel', unit: 'kg' },
  { name: 'Filete sin piel', unit: 'kg' },
  { name: 'Lomo', unit: 'kg' },
  { name: 'Medallón', unit: 'kg' },
  { name: 'Trozo', unit: 'kg' }
]

// Standard presentations for all seafood
const seafoodPresentations = [
  { name: 'Entero crudo', unit: 'kg' },
  { name: 'Entero cocido', unit: 'kg' },
  { name: 'Pelado crudo', unit: 'kg' },
  { name: 'Pelado cocido', unit: 'kg' },
  { name: 'Vivo', unit: 'kg' },
  { name: 'Por unidad', unit: 'unidad' },
  { name: 'Por docena', unit: 'docena' }
]

// Special presentations for Langostinos only
const shrimpPresentations = [
  { name: 'Entero', unit: 'kg' },
  { name: 'Entero crudo', unit: 'kg' },
  { name: 'Entero cocido', unit: 'kg' },
  { name: 'Pelado crudo (PUD)', unit: 'kg' },
  { name: 'Pelado, sin desvenar', unit: 'kg' },
  { name: 'Pelado y desvenado', unit: 'kg' },
  { name: 'Sin cabeza, pelado y desvenado', unit: 'kg' }
]

export default function AdminStockPage() {
  const [products, setProducts] = useState<GroupedProduct[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  
  useEffect(() => {
    const groupedProducts: { [key: string]: GroupedProduct } = {}
    
    // Process main stock data ONLY from stock.json
    stockData.forEach((item, index) => {
      const key = `${item.categoria}-${item.producto}`
      
      if (!groupedProducts[key]) {
        let standardPresentations = []
        
        if (item.producto === 'Langostino') {
          standardPresentations = shrimpPresentations
        } else if (item.subcategoria === 'Pescado') {
          standardPresentations = fishPresentations
        } else if (item.subcategoria === 'Marisco') {
          standardPresentations = seafoodPresentations
        } else {
          // For other categories, use what's in the stock.json
          const uniquePresentations = stockData
            .filter(p => p.categoria === item.categoria && p.producto === item.producto)
            .map(p => ({ name: p.presentacion, unit: p.unidad }))
          
          // Remove duplicates
          const filteredPresentations = uniquePresentations.filter((p, index, self) =>
            index === self.findIndex((t) => t.name === p.name && t.unit === p.unit)
          )
          standardPresentations = filteredPresentations
        }

        const availableUnits = standardPresentations.map(p => p.unit)
        const uniqueUnits = [...new Set(availableUnits)]
        
        groupedProducts[key] = {
          category: item.categoria,
          subcategory: item.subcategoria,
          product: item.producto,
          presentations: standardPresentations.map(pres => ({
            name: pres.name,
            unit: pres.unit,
            available: false,
            price: '',
            notes: item.ejemplos_notas || '',
            inStock: false
          })),
          selectedUnit: uniqueUnits[0] || 'kg',
          id: key,
          inStock: false
        }
      }
    })

    // Process sushi ingredients ONLY from insumos_sushi.json
    if (sushiData && sushiData.ingredientes) {
      sushiData.ingredientes.forEach((ingredient: any, index: number) => {
        const key = `Sushi-${ingredient.nombre}`
        
        groupedProducts[key] = {
          category: 'Sushi',
          subcategory: ingredient.categoria || 'Ingredientes',
          product: ingredient.nombre,
          presentations: [{
            name: ingredient.presentacion || 'Estándar',
            unit: ingredient.unidad || 'unidad',
            available: false,
            price: '',
            notes: ingredient.descripcion || '',
            inStock: false
          }],
          selectedUnit: ingredient.unidad || 'unidad',
          id: key,
          inStock: false
        }
      })
    }
    
    setProducts(Object.values(groupedProducts))
  }, [])

  // Get unique categories from the actual data
  const categories = ['all', ...Array.from(new Set(products.map(item => item.category)))]

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchCategory = categoryFilter === 'all' || product.category === categoryFilter
    const matchSearch = product.product.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCategory && matchSearch
  })

  const toggleProductStock = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    ))
  }

  const changeUnit = (productId: string, newUnit: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, selectedUnit: newUnit } : p
    ))
  }

  const togglePresentation = (productId: string, presentationIndex: number, available: boolean) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const newPresentations = [...p.presentations]
        newPresentations[presentationIndex] = {
          ...newPresentations[presentationIndex],
          available
        }
        return { ...p, presentations: newPresentations }
      }
      return p
    }))
  }

  const togglePresentationStock = (productId: string, presentationIndex: number) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const newPresentations = [...p.presentations]
        newPresentations[presentationIndex] = {
          ...newPresentations[presentationIndex],
          inStock: !newPresentations[presentationIndex].inStock
        }
        return { ...p, presentations: newPresentations }
      }
      return p
    }))
  }

  const updatePrice = (productId: string, presentationIndex: number, price: string) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const newPresentations = [...p.presentations]
        newPresentations[presentationIndex] = {
          ...newPresentations[presentationIndex],
          price
        }
        return { ...p, presentations: newPresentations }
      }
      return p
    }))
  }

  const saveStock = () => {
    const availableProducts: any[] = []
    
    products.forEach(product => {
      if (product.inStock) {
        product.presentations.forEach(presentation => {
          if (presentation.available && presentation.price && presentation.inStock) {
            availableProducts.push({
              category: product.category,
              subcategory: product.subcategory,
              product: product.product,
              presentation: presentation.name,
              unit: product.selectedUnit,
              price: presentation.price,
              notes: presentation.notes
            })
          }
        })
      }
    })
    
    console.log('Stock guardado:', availableProducts)
    alert(`¡Stock guardado! ${availableProducts.length} productos disponibles`)
    localStorage.setItem('bogavante-stock', JSON.stringify(availableProducts))
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
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
      'Complementos': 'bg-amber-100 text-amber-800',
      'Sushi': 'bg-rose-100 text-rose-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const totalInStock = products.filter(p => p.inStock).length
  const totalAvailable = products.reduce((total, product) => {
    return total + product.presentations.filter(p => p.available && p.price && p.inStock).length
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
              Total: {products.length} productos
            </Badge>
            <Badge variant="default" className="px-4 py-2 bg-green-500">
              En Stock: {totalInStock}
            </Badge>
            <Badge variant="default" className="px-4 py-2 bg-blue-500">
              Disponibles: {totalAvailable}
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="🔍 Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="all">📋 Todas las categorías</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4 mb-8">
          {filteredProducts.map((product) => {
            const availableUnits = [...new Set(product.presentations.map(p => p.unit))]
            const filteredPresentations = product.presentations.filter(p => 
              p.unit === product.selectedUnit
            )
            
            return (
              <Card key={product.id} className={`shadow-sm transition-all ${product.inStock ? 'ring-2 ring-blue-300' : ''}`}>
                <CardContent className="p-6">
                  {/* Product Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {product.product}
                        </h3>
                        <Badge className={getCategoryColor(product.category)} variant="secondary">
                          {product.category}
                        </Badge>
                        
                        {/* Special indicators */}
                        {product.product === 'Langostino' && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            🦐 Presentaciones Especiales
                          </Badge>
                        )}
                        
                        {product.category === 'Sushi' && (
                          <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                            🍣 Ingrediente Sushi
                          </Badge>
                        )}
                        
                        {/* STOCK BUTTON */}
                        <Button
                          variant={product.inStock ? "default" : "outline"}
                          onClick={() => toggleProductStock(product.id)}
                          className={`ml-4 ${
                            product.inStock 
                              ? 'bg-blue-500 hover:bg-blue-600' 
                              : 'bg-gray-400 hover:bg-gray-500 text-white border-gray-400'
                          }`}
                        >
                          {product.inStock ? '✅ EN STOCK' : '❌ SIN STOCK'}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Subcategoría:</span> {product.subcategory}
                      </p>
                    </div>

                    {/* Unit Selector */}
                    <div className="flex flex-col items-start lg:items-end gap-2">
                      <label className="text-sm font-medium text-gray-700">Unidad de venta:</label>
                      <select
                        value={product.selectedUnit}
                        onChange={(e) => changeUnit(product.id, e.target.value)}
                        className="p-2 border rounded-md bg-white min-w-[120px]"
                        disabled={!product.inStock}
                      >
                        {availableUnits.map(unit => (
                          <option key={unit} value={unit}>
                            {unit} ({unitLabels[unit] || `/${unit}`})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Presentations - Only show if product is in stock */}
                  {product.inStock && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">
                        Presentaciones disponibles:
                        {product.product === 'Langostino' && (
                          <span className="text-sm font-normal text-orange-600 ml-2">
                            (Presentaciones específicas para langostinos)
                          </span>
                        )}
                        {product.category === 'Sushi' && (
                          <span className="text-sm font-normal text-rose-600 ml-2">
                            (Ingrediente de sushi)
                          </span>
                        )}
                      </h4>
                      
                      {filteredPresentations.length === 0 && (
                        <p className="text-gray-500 italic">
                          No hay presentaciones disponibles para la unidad seleccionada
                        </p>
                      )}
                      
                      {filteredPresentations.map((presentation, index) => {
                        const originalIndex = product.presentations.findIndex(p => 
                          p.name === presentation.name && p.unit === presentation.unit
                        )
                        
                        return (
                          <div key={`${presentation.name}-${index}`} 
                               className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                                 presentation.inStock ? (presentation.available ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200') : 'bg-gray-50 border-gray-200'
                               }`}>
                            
                            {/* Stock Checkbox */}
                            <Checkbox
                              checked={presentation.inStock}
                              onCheckedChange={() => 
                                togglePresentationStock(product.id, originalIndex)
                              }
                              className="w-5 h-5"
                            />
                            
                            {/* Available Checkbox */}
                            <Checkbox
                              checked={presentation.available}
                              onCheckedChange={(checked) => 
                                togglePresentation(product.id, originalIndex, checked as boolean)
                              }
                              className="w-5 h-5"
                              disabled={!presentation.inStock}
                            />
                            
                            {/* Presentation Info */}
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">
                                {presentation.name}
                                {product.product === 'Langostino' && presentation.name.includes('desven') && (
                                  <span className="text-xs text-orange-600 ml-1">🦐</span>
                                )}
                              </p>
                              {presentation.notes && (
                                <p className="text-xs text-gray-500">{presentation.notes}</p>
                              )}
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
                                value={presentation.price}
                                onChange={(e) => updatePrice(product.id, originalIndex, e.target.value)}
                                className="w-24 text-center"
                                disabled={!presentation.available || !presentation.inStock}
                              />
                              <span className="text-sm text-gray-600 whitespace-nowrap min-w-[50px]">
                                {unitLabels[product.selectedUnit] || `/${product.selectedUnit}`}
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

        {/* No results message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron productos con los filtros seleccionados
            </p>
          </div>
        )}

        {/* Save Button - Fixed at bottom */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <Button 
            onClick={saveStock}
            className="bg-green-600 hover:bg-green-700 text-white text-xl py-4 px-8 shadow-lg rounded-full"
          >
            💾 GUARDAR STOCK ({totalAvailable})
          </Button>
        </div>

        {/* Spacer for fixed button */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}