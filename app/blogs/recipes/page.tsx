"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Sample data for fish recipes
const recipes = [
  {
    id: "1",
    title: "Pan-Seared Salmon with Lemon",
    description: "Simple and delicious salmon with a crispy skin and bright lemon finish.",
    imageSrc: "/pan-seared-salmon-lemon.png",
    imageAlt: "Pan-Seared Salmon with Lemon",
    url: "/blogs/recipes/pan-seared-salmon",
    fishType: "Salmon",
    difficulty: "Easy",
    cookTime: "15 mins",
  },
  {
    id: "2",
    title: "Grilled Sea Bass with Herbs",
    description: "Mediterranean-style sea bass with fresh herbs and olive oil.",
    imageSrc: "/grilled-sea-bass.png",
    imageAlt: "Grilled Sea Bass with Herbs",
    url: "/blogs/recipes/grilled-sea-bass",
    fishType: "Sea Bass",
    difficulty: "Medium",
    cookTime: "20 mins",
  },
  {
    id: "3",
    title: "Garlic Butter Prawns",
    description: "Quick and flavorful prawns in a rich garlic butter sauce.",
    imageSrc: "/garlic-butter-prawns.png",
    imageAlt: "Garlic Butter Prawns",
    url: "/blogs/recipes/garlic-butter-prawns",
    fishType: "Prawns",
    difficulty: "Easy",
    cookTime: "10 mins",
  },
  {
    id: "4",
    title: "Baked Cod with Tomatoes",
    description: "Healthy baked cod with cherry tomatoes and Mediterranean flavors.",
    imageSrc: "/baked-cod-tomatoes.png",
    imageAlt: "Baked Cod with Tomatoes",
    url: "/blogs/recipes/baked-cod",
    fishType: "Cod",
    difficulty: "Easy",
    cookTime: "25 mins",
  },
  {
    id: "5",
    title: "Sesame Crusted Tuna",
    description: "Restaurant-quality seared tuna with a crispy sesame crust.",
    imageSrc: "/sesame-crusted-tuna.png",
    imageAlt: "Sesame Crusted Tuna",
    url: "/blogs/recipes/sesame-tuna",
    fishType: "Tuna",
    difficulty: "Hard",
    cookTime: "12 mins",
  },
  {
    id: "6",
    title: "Prawn Stir-Fry",
    description: "Quick and colorful prawn stir-fry with fresh vegetables.",
    imageSrc: "/prawn-stir-fry.png",
    imageAlt: "Prawn Stir-Fry",
    url: "/blogs/recipes/prawn-stir-fry",
    fishType: "Prawns",
    difficulty: "Medium",
    cookTime: "15 mins",
  },
]

const fishTypes = ["All", "Salmon", "Sea Bass", "Prawns", "Cod", "Tuna"]
const difficulties = ["All", "Easy", "Medium", "Hard"]

export default function RecipesPage() {
  const [selectedFishType, setSelectedFishType] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesFishType = selectedFishType === "All" || recipe.fishType === selectedFishType
      const matchesDifficulty = selectedDifficulty === "All" || recipe.difficulty === selectedDifficulty
      return matchesFishType && matchesDifficulty
    })
  }, [selectedFishType, selectedDifficulty])

  const clearFilters = () => {
    setSelectedFishType("All")
    setSelectedDifficulty("All")
  }

  return (
    <div>
      {/* Hero section */}
      <section className="bg-blue-50 py-12">
        <div className="potluck-container">
          <h1 className="text-5xl font-bold text-slate-800">Fish & Seafood Recipes</h1>
          <p className="text-slate-600 mt-4 text-lg">
            Discover delicious and easy ways to prepare fresh fish and seafood
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="potluck-container">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Fish Type Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Fish Type:</label>
              <div className="flex flex-wrap gap-2">
                {fishTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedFishType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFishType(type)}
                    className={selectedFishType === type ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Difficulty:</label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={selectedDifficulty === difficulty ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedFishType !== "All" || selectedDifficulty !== "All") && (
              <Button variant="ghost" onClick={clearFilters} className="text-slate-600 hover:text-slate-800">
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4">
            <p className="text-slate-600">
              Showing {filteredRecipes.length} of {recipes.length} recipes
            </p>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="py-16">
        <div className="potluck-container">
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredRecipes.map((recipe) => (
                <Link key={recipe.id} href={recipe.url} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={recipe.imageSrc || "/placeholder.svg"}
                      alt={recipe.imageAlt}
                      fill
                      className="object-cover transition-all duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="mt-6 bg-slate-50 p-4 rounded-lg">
                    <div className="flex gap-2 mb-3">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {recipe.fishType}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          recipe.difficulty === "Easy"
                            ? "border-green-500 text-green-700"
                            : recipe.difficulty === "Medium"
                              ? "border-yellow-500 text-yellow-700"
                              : "border-red-500 text-red-700"
                        }
                      >
                        {recipe.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-slate-600">
                        {recipe.cookTime}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{recipe.title}</h2>
                    <p className="mt-2 text-slate-600">{recipe.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg mb-4">No recipes found matching your filters.</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
