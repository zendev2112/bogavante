'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Instagram, TiktokIcon, Linkedin, Mail } from '@/components/icons'

export function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real implementation, this would send the email to a subscription service
    console.log('Subscribing email:', email)
    setEmail('')
    // Show success message or toast notification
  }

  return (
    <footer>
      {/* Newsletter section */}
      <div className="bg-potluck-pink py-8">
        <div className="potluck-container flex flex-col md:flex-row justify-between items-start md:items-center">
          <p className="text-potluck-darkText font-medium mb-4 md:mb-0">
            Your invitation to updates and all things Potluck.
          </p>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-input w-full md:w-60 text-potluck-darkText"
              required
            />
            <button
              type="submit"
              className="uppercase font-bold ml-2 text-potluck-darkText bg-transparent"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-potluck-yellow py-8">
        <div className="potluck-container grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company info */}
          <div>
            <p className="text-potluck-darkText mb-4 max-w-sm">
              Potluck is an all-natural Korean staples line that was founded with the desire to bring the highest quality Korean ingredients to every pantry.
            </p>
          </div>

          {/* Navigation and Social */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Navigation links */}
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-potluck-darkText uppercase font-bold">Home</Link>
              <Link href="/collections/shop-active" className="text-potluck-darkText uppercase font-bold">Shop</Link>
              <Link href="/pages/about" className="text-potluck-darkText uppercase font-bold">About</Link>
              <Link href="/pages/faqs" className="text-potluck-darkText uppercase font-bold">Help & FAQ</Link>
              <Link href="/policies/privacy-policy" className="text-potluck-darkText uppercase font-bold">Privacy Policy</Link>
              <Link href="/policies/terms-of-service" className="text-potluck-darkText uppercase font-bold">Terms of Service</Link>
            </nav>

            {/* Social links */}
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/potluckmarket" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-6 w-6 text-potluck-darkText" />
              </a>
              <a href="https://www.tiktok.com/@potluckmarket" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <TiktokIcon className="h-6 w-6 text-potluck-darkText" />
              </a>
              <a href="https://www.linkedin.com/company/potluckmarket/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6 text-potluck-darkText" />
              </a>
              <a href="mailto:hello@potluckmarket.com" aria-label="Email">
                <Mail className="h-6 w-6 text-potluck-darkText" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="potluck-container mt-8">
          <p className="text-potluck-darkText text-sm">© 2025, Potluck.</p>
        </div>
      </div>
    </footer>
  )
}
