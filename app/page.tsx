import { getRecetas, getNotasDeMar, getSaludArticles } from '@/lib/queries'
import HomeClient from './HomeClient'

export default async function HomePage() {
  const [recetas, notasDeMar, saludArticles] = await Promise.all([
    getRecetas(12, true), // Only published
    getNotasDeMar(6, true), // Only published
    getSaludArticles(6, true), // Only published
  ])

  return (
    <HomeClient
      recetas={recetas}
      notasDeMar={notasDeMar}
      saludArticles={saludArticles}
    />
  )
}
