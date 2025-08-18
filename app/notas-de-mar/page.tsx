export default function NotasDeMarPage() {
  const articles = [
    {
      id: 1,
      title: "Cómo elegir pescado fresco en la pescadería",
      excerpt: "Consejos esenciales para reconocer la frescura del pescado y mariscos al momento de la compra.",
      date: "15 de Enero, 2024",
      readTime: "5 min",
      image: "/fresh-fish-selection.png",
      content: "La frescura del pescado es fundamental para obtener los mejores sabores...",
    },
    {
      id: 2,
      title: "Técnicas básicas para limpiar pescado",
      excerpt: "Guía paso a paso para limpiar y preparar diferentes tipos de pescado en casa.",
      date: "12 de Enero, 2024",
      readTime: "8 min",
      image: "/cleaning-fish-technique.png",
      content: "Limpiar pescado puede parecer intimidante al principio...",
    },
    {
      id: 3,
      title: "Secretos para cocinar mariscos perfectos",
      excerpt: "Tips profesionales para no sobrecocinar langostinos, mejillones y otros mariscos.",
      date: "10 de Enero, 2024",
      readTime: "6 min",
      image: "/perfect-seafood-cooking.png",
      content: "Los mariscos requieren técnicas específicas para mantener su textura...",
    },
    {
      id: 4,
      title: "Marinadas que transforman el pescado",
      excerpt: "Recetas de marinadas argentinas que realzan el sabor natural del pescado.",
      date: "8 de Enero, 2024",
      readTime: "4 min",
      image: "/fish-marinades.png",
      content: "Una buena marinada puede transformar completamente un pescado...",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Notas de Mar</h1>
          <p className="text-xl text-slate-700">
            Consejos, técnicas y secretos para cocinar pescado y mariscos como un profesional
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center text-sm text-slate-500 mb-3">
                  <span>{article.date}</span>
                  <span className="mx-2">•</span>
                  <span>{article.readTime} de lectura</span>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-3 hover:text-blue-600 cursor-pointer">
                  {article.title}
                </h2>
                <p className="text-slate-700 mb-4">{article.excerpt}</p>
                <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">Leer más →</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Recibí nuestros consejos semanales</h3>
          <p className="text-slate-700 mb-6">
            Suscribite para recibir las mejores técnicas y consejos para cocinar pescado
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
