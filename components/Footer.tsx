'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const links = [
    { text: 'Formulaire WISI', href: '/formulaires/wisi' },
    { text: 'Formulaire TARII', href: '/formulaires/tarii' },
    { text: 'Formulaire FHN', href: '/formulaires/fhn' },
    { text: 'Mentions légales', href: '#' }
  ]

  return (
    <footer className="bg-gradient-to-b from-[#006B3F] to-[#004B2F] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
      
      {/* Vague décorative en haut du footer */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0 transform rotate-180">
        <svg className="relative block w-full h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-6 py-16 pt-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="transform hover:translate-y-[-5px] transition-transform duration-300">
            <div className="flex items-center mb-6">
              <div className="relative w-12 h-12 mr-3">
                <Image 
                  src="/images/logo.png" 
                  alt="Logo Fondation Horizons Nouveaux" 
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#FFE5A5]">Fondation</h3>
                <p className="text-xs text-[#FF8B7B]">Horizons Nouveaux</p>
              </div>
            </div>
            <p className="text-white leading-relaxed">
              La Fondation Horizons Nouveaux œuvre depuis 1996 pour l'inclusion et
              l'accompagnement des jeunes en situation de handicap au Gabon.
            </p>
          </div>
          
          <div className="transform hover:translate-y-[-5px] transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-6 text-white">Contact</h3>
            <ul className="text-white space-y-4">
              <li className="flex items-center space-x-3 hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+241 XX XX XX XX</span>
              </li>
              <li className="flex items-center space-x-3 hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>contact@fhn.ga</span>
              </li>
              <li className="flex items-center space-x-3 hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Libreville, Gabon</span>
              </li>
            </ul>
          </div>

          <div className="transform hover:translate-y-[-5px] transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-6 text-white">Liens utiles</h3>
            <ul className="space-y-4">
              {links.map((link, index) => (
                <li 
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative overflow-hidden"
                >
                  <Link 
                    href={link.href}
                    className={`block text-white transition-all duration-300 hover:text-[#FF8B7B] ${
                      hoveredIndex === index ? 'transform translate-x-2' : ''
                    }`}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#FFE5A5]/20 mt-12 pt-8 text-center">
          <p className="text-white">
            © {new Date().getFullYear()} Fondation Horizons Nouveaux. Tous droits réservés.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            {['facebook', 'twitter', 'instagram'].map((social) => (
              <a 
                key={social}
                href="#" 
                className="text-[#A4D4E6] hover:text-[#FF8B7B] transition-colors"
                aria-label={`${social} link`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  {social === 'facebook' && <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />}
                  {social === 'twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />}
                  {social === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}