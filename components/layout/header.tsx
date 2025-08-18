"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, User, ShoppingBag } from "lucide-react"

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="bg-potluck-yellow relative">
      {/* Bold High-Impact Header with Oversized Typography */}
      <div className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Main Logo - Oversized Typography */}
        <Link href="/" className="absolute inset-0 flex items-center justify-center z-10">
          <div className="font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl uppercase tracking-tighter text-potluck-darkText leading-none text-center">
            EL BOGAVANTE
          </div>
        </Link>

        {/* Navigation Controls Overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-potluck-yellow/90 to-transparent">
          <div className="potluck-container flex items-center justify-between py-4">
            <div className="flex items-center">
              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger className="md:hidden bg-potluck-darkText/10 p-2 rounded-lg backdrop-blur-sm">
                  <Menu className="h-6 w-6 text-potluck-darkText" />
                </SheetTrigger>
                <SheetContent side="left" className="bg-potluck-yellow p-0">
                  <div className="flex flex-col gap-4 p-6">
                    <Link
                      href="/"
                      className="text-potluck-darkText uppercase font-bold text-lg hover:text-potluck-brown transition-colors"
                    >
                      Home
                    </Link>
                    <Link
                      href="/pages/store-locator"
                      className="text-potluck-darkText uppercase font-bold text-lg hover:text-potluck-brown transition-colors"
                    >
                      Encontranos
                    </Link>
                    <Link
                      href="/pages/about"
                      className="text-potluck-darkText uppercase font-bold text-lg hover:text-potluck-brown transition-colors"
                    >
                      Sobre Nosotros
                    </Link>
                    <Link
                      href="/blogs/recipes"
                      className="text-potluck-darkText uppercase font-bold text-lg hover:text-potluck-brown transition-colors"
                    >
                      Recetas
                    </Link>
                    <Link
                      href="/notas-de-mar"
                      className="text-potluck-darkText uppercase font-bold text-lg hover:text-potluck-brown transition-colors"
                    >
                      Notas de Mar
                    </Link>
                    <Link
                      href="/salud"
                      className="text-potluck-darkText uppercase font-bold text-lg hover:text-potluck-brown transition-colors"
                    >
                      Salud
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8 bg-potluck-darkText/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Link
                  href="/"
                  className={`uppercase font-bold text-sm hover:text-potluck-brown transition-colors ${isActive("/") ? "underline" : ""}`}
                >
                  Home
                </Link>
                <Link
                  href="/pages/store-locator"
                  className={`uppercase font-bold text-sm hover:text-potluck-brown transition-colors ${isActive("/pages/store-locator") ? "underline" : ""}`}
                >
                  Encontranos
                </Link>
                <Link
                  href="/pages/about"
                  className={`uppercase font-bold text-sm hover:text-potluck-brown transition-colors ${isActive("/pages/about") ? "underline" : ""}`}
                >
                  Sobre Nosotros
                </Link>
                <Link
                  href="/blogs/recipes"
                  className={`uppercase font-bold text-sm hover:text-potluck-brown transition-colors ${isActive("/blogs/recipes") ? "underline" : ""}`}
                >
                  Recetas
                </Link>
                <Link
                  href="/notas-de-mar"
                  className={`uppercase font-bold text-sm hover:text-potluck-brown transition-colors ${isActive("/notas-de-mar") ? "underline" : ""}`}
                >
                  Notas de Mar
                </Link>
                <Link
                  href="/salud"
                  className={`uppercase font-bold text-sm hover:text-potluck-brown transition-colors ${isActive("/salud") ? "underline" : ""}`}
                >
                  Salud
                </Link>
              </nav>
            </div>

            {/* User actions */}
            <div className="flex items-center space-x-4 bg-potluck-darkText/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Link
                href="/customer_authentication/redirect"
                aria-label="Log in"
                className="hover:text-potluck-brown transition-colors"
              >
                <User className="h-5 w-5 text-potluck-darkText" />
              </Link>
              <Link href="/search" aria-label="Search" className="hover:text-potluck-brown transition-colors">
                <Search className="h-5 w-5 text-potluck-darkText" />
              </Link>
              <button
                aria-label="Shopping cart"
                onClick={() => setIsCartOpen(true)}
                className="relative hover:text-potluck-brown transition-colors"
              >
                <ShoppingBag className="h-5 w-5 text-potluck-darkText" />
                <span className="absolute -top-1 -right-1 bg-potluck-pink text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
