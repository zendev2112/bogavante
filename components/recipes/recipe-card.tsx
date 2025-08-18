'use client'

import Link from 'next/link'
import Image from 'next/image'

interface RecipeCardProps {
  id: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  url: string
}

export function RecipeCard({
  id,
  title,
  description,
  imageSrc,
  imageAlt,
  url
}: RecipeCardProps) {
  return (
    <Link href={url} className="block group">
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-all duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-potluck-darkText font-bold text-xl">{title}</h3>
        <p className="text-potluck-darkText mt-1">{description}</p>
        <p className="text-potluck-darkText font-medium mt-2 group-hover:underline">
          Read more
        </p>
      </div>
    </Link>
  )
}
