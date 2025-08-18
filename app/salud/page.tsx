export default function SaludPage() {
  const healthArticles = [
    {
      id: 1,
      title: "Omega-3: El tesoro nutricional del pescado",
      excerpt:
        "Descubrí por qué los ácidos grasos omega-3 del pescado son esenciales para tu salud cardiovascular y cerebral.",
      date: "18 de Enero, 2024",
      readTime: "7 min",
      image: "/omega3-benefits.png",
      category: "Nutrición",
    },
    {
      id: 2,
      title: "Pescado vs. Carne: Comparación nutricional",
      excerpt: "Análisis completo de los beneficios nutricionales del pescado comparado con otras fuentes de proteína.",
      date: "16 de Enero, 2024",
      readTime: "6 min",
      image: "/fish-vs-meat-nutrition.png",
      category: "Comparativas",
    },
    {
      id: 3,
      title: "Los mejores pescados para niños",
      excerpt: "Qué pescados son más seguros y nutritivos para incluir en la dieta infantil.",
      date: "14 de Enero, 2024",
      readTime: "5 min",
      image: "/fish-for-children.png",
      category: "Familia",
    },
    {
      id: 4,
      title: "Pescado y embarazo: Guía completa",
      excerpt: "Todo lo que necesitás saber sobre el consumo seguro de pescado durante el embarazo.",
      date: "12 de Enero, 2024",
      readTime: "8 min",
      image: "/fish-pregnancy-guide.png",
      category: "Embarazo",
    },
    {
      id: 5,
      title: "Beneficios del pescado para deportistas",
      excerpt: "Cómo el pescado puede mejorar el rendimiento deportivo y la recuperación muscular.",
      date: "10 de Enero, 2024",
      readTime: "6 min",
      image: "/fish-sports-nutrition.png",
      category: "Deporte",
    },
    {
      id: 6,
      title: "Pescado azul vs. pescado blanco",
      excerpt: "Diferencias nutricionales y cuándo elegir cada tipo según tus necesidades de salud.",
      date: "8 de Enero, 2024",
      readTime: "5 min",
      image: "/blue-vs-white-fish.png",
      category: "Nutrición",
    },
  ]

  const categories = ["Todos", "Nutrición", "Comparativas", "Familia", "Embarazo", "Deporte"]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Pescado y Salud</h1>
          <p className="text-xl text-slate-700">
            Todo lo que necesitás saber sobre los beneficios nutricionales del pescado y mariscos
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-40 object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{article.category}</span>
                  <span className="text-sm text-slate-500">{article.readTime}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-2 hover:text-blue-600 cursor-pointer">
                  {article.title}
                </h2>
                <p className="text-slate-700 text-sm mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{article.date}</span>
                  <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm">
                    Leer más →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Health Benefits Summary */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-slate-800 text-center mb-8">Principales beneficios del pescado</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🧠</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Salud Cerebral</h4>
              <p className="text-slate-700 text-sm">
                Rico en omega-3 DHA, esencial para el desarrollo y función cerebral
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">❤️</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Corazón Sano</h4>
              <p className="text-slate-700 text-sm">
                Reduce el riesgo de enfermedades cardiovasculares y mejora la circulación
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💪</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Proteína Completa</h4>
              <p className="text-slate-700 text-sm">
                Fuente de proteína de alta calidad con todos los aminoácidos esenciales
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
