import Image from 'next/image'
import Link from 'next/link'
import { getRecetas, getNotasDeMar, getSaludArticles } from '@/lib/queries'
import HomeClient from './HomeClient'

// Server component: fetch data at build/request time
export default async function HomePage() {
  const [recetas, notasDeMar, saludArticles] = await Promise.all([
    getRecetas(12),
    getNotasDeMar(6),
    getSaludArticles(6),
  ])

  return (
    <HomeClient
      recetas={recetas}
      notasDeMar={notasDeMar}
      saludArticles={saludArticles}
    />
  )
}
