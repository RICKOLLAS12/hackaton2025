'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Détecter le défilement pour changer le style de la navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Fermer le menu mobile lors du changement de page
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])
  
  // Vérifier si le lien est actif
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }
  
  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-12 h-12 mr-3">
              <Image 
                src="/images/logo.png" 
                alt="Logo Fondation Horizons Nouveaux" 
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#006B3F]">Fondation</h1>
              <p className="text-xs text-[#FF8B7B]">Horizons Nouveaux</p>
            </div>
          </Link>
          
          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-gray-700 hover:text-[#006B3F] transition-colors ${
                isActive('/') ? 'font-semibold text-[#006B3F]' : ''
              }`}
            >
              Accueil
            </Link>
            <Link 
              href="/dashboard" 
              className={`text-gray-700 hover:text-[#006B3F] transition-colors ${
                isActive('/dashboard') ? 'font-semibold text-[#006B3F]' : ''
              }`}
            >
              Tableau de bord
            </Link>
            <Link 
              href="/dossiers" 
              className={`text-gray-700 hover:text-[#006B3F] transition-colors ${
                isActive('/dossiers') ? 'font-semibold text-[#006B3F]' : ''
              }`}
            >
              Dossiers
            </Link>
            <Link 
              href="/galerie" 
              className={`text-gray-700 hover:text-[#006B3F] transition-colors ${
                isActive('/galerie') ? 'font-semibold text-[#006B3F]' : ''
              }`}
            >
              Galerie
            </Link>
            <Link 
              href="/auth/login" 
              className="bg-[#006B3F] text-white px-4 py-2 rounded-full hover:bg-[#005535] transition-colors"
            >
              Connexion
            </Link>
          </nav>
          
          {/* Bouton menu mobile */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4">
            <Link 
              href="/" 
              className={`block py-2 text-gray-700 hover:text-[#006B3F] transition-colors ${
                isActive('/') ? 'font-semibold text-[#006B3F]' : ''
              }`}
            >
              Accueil
            </Link>
            <Link 
              href="/dashboard" 
              className={`block py-2 text-gray-700 hover:text-[#006B3F] transition-colors ${
                isActive('/dashboard') ? 'font-semibold text-[#006B3F]' : ''
              }`}
            >
              Tableau de bord
            </Link>
            <Link 
              href="/dossiers" 
              className={`block py-2 text-gray-700 hover:text-[#006B3F] transition-colors ${
                isActive('/dossiers') ? 'font-semibold text-[#006B3F]' : ''
              }`}
            >
              Dossiers
            </Link>
            <Link 
              href="/galerie" 
              className={`block py-2 text-gray-700 hover:text-[#006B3F] transition-colors ${
                isActive('/galerie') ? 'font-semibold text-[#006B3F]' : ''
              }`}
            >
              Galerie
            </Link>
            <Link 
              href="/auth/login" 
              className="block bg-[#006B3F] text-white px-4 py-2 rounded-md hover:bg-[#005535] transition-colors"
            >
              Connexion
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}