'use client'

import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  id: string
  name: string
  price: string | number
  imageSrc: string
  imageAlt: string
  url: string
}

export function ProductCard({
  id,
  name,
  price,
  imageSrc,
  imageAlt,
  url
}: ProductCardProps) {
  return (
    <Link href={url} className="group block">
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-all duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <h3 className="text-potluck-darkText font-bold uppercase">{name}</h3>
        <p className="text-potluck-darkText">
          {typeof price === 'number'
            ? `$${price.toFixed(2)}`
            : price}
        </p>
      </div>
    </Link>
  )
}
