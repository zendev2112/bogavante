import { ProductCard } from '@/components/products/product-card'

// Sample data for products
const products = [
  {
    id: '1',
    name: 'Jang Trio',
    price: 52.00,
    imageSrc: 'https://ext.same-assets.com/1577298382/924641952.jpeg',
    imageAlt: 'Potluck Jang Trio',
    url: '/products/jang-trio'
  },
  {
    id: '2',
    name: 'Combo',
    price: 32.00,
    imageSrc: 'https://ext.same-assets.com/1577298382/298697965.jpeg',
    imageAlt: 'Potluck Combo',
    url: '/products/combo'
  },
  {
    id: '3',
    name: 'Gochujang',
    price: 16.00,
    imageSrc: 'https://ext.same-assets.com/1577298382/339258583.jpeg',
    imageAlt: 'Potluck Gochujang',
    url: '/products/gochujang'
  },
  {
    id: '4',
    name: 'Ssamjang',
    price: 16.00,
    imageSrc: 'https://ext.same-assets.com/1577298382/2382200254.jpeg',
    imageAlt: 'Potluck Ssamjang',
    url: '/products/ssamjang'
  },
  {
    id: '5',
    name: 'Gift Card',
    price: 'from $25.00',
    imageSrc: 'https://ext.same-assets.com/1577298382/2306065179.jpeg',
    imageAlt: 'Potluck Gift Card',
    url: '/products/gift-card'
  }
]

export default function ShopPage() {
  return (
    <div>
      {/* Shop Hero */}
      <section className="bg-potluck-brown py-12">
        <div className="potluck-container">
          <h1 className="text-5xl font-bold text-white">Shop</h1>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16">
        <div className="potluck-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageSrc={product.imageSrc}
                imageAlt={product.imageAlt}
                url={product.url}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
