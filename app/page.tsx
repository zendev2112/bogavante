import {
  getRecetas,
  getNotasDeMar,
  getSaludArticles,
  getOfertas,
} from '@/lib/queries'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const [recetas, notasDeMar, saludArticles, ofertas] = await Promise.all([
    getRecetas(12, true), // Only published
    getNotasDeMar(6, true), // Only published
    getSaludArticles(6, true), // Only published
    getOfertas(), // Only published
  ])

  return (
    <HomeClient
      recetas={recetas}
      notasDeMar={notasDeMar}
      saludArticles={saludArticles}
      ofertas={ofertas}
    />
  )
}
