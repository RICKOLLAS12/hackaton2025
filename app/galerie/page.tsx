'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AnimationWrapper from '@/components/AnimationWrapper'

export default function GaleriePage() {
  const [selectedCategory, setSelectedCategory] = useState('tous')
  
  const categories = [
    { id: 'tous', name: 'Tous' },
    { id: 'activites', name: 'Activités' },
    { id: 'evenements', name: 'Événements' },
    { id: 'formations', name: 'Formations' }
  ]
  
  // Simuler des données de galerie
  const galleryItems = [
    { id: 1, category: 'activites', title: 'Atelier créatif', description: 'Développement des compétences artistiques' },
    { id: 2, category: 'evenements', title: 'Journée portes ouvertes', description: 'Présentation de nos services aux familles' },
    { id: 3, category: 'formations', title: 'Formation des éducateurs', description: 'Renforcement des compétences professionnelles' },
    { id: 4, category: 'activites', title: 'Séance de motricité', description: 'Exercices adaptés pour le développement physique' },
    { id: 5, category: 'evenements', title: 'Célébration annuelle', description: 'Fête de fin d\'année avec les familles' },
    { id: 6, category: 'formations', title: 'Atelier parents', description: 'Accompagnement des familles au quotidien' },
    { id: 7, category: 'activites', title: 'Activités sensorielles', description: 'Stimulation des sens et découverte' },
    { id: 8, category: 'evenements', title: 'Journée de sensibilisation', description: 'Sensibilisation au handicap dans les écoles' },
    { id: 9, category: 'formations', title: 'Conférence annuelle', description: 'Partage d\'expertise et de bonnes pratiques' },
  ]
  
  const filteredItems = selectedCategory === 'tous' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory)

  return (
    <AnimationWrapper>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#006B3F] mb-4">Notre Galerie</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez en images les moments forts de la Fondation Horizons Nouveaux et les activités que nous proposons pour accompagner les jeunes en situation de handicap.
            </p>
          </div>
          
          {/* Filtres de catégories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-[#006B3F] text-white'
                    : 'bg-[#FFE5A5]/20 text-[#006B3F] hover:bg-[#FFE5A5]/50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Grille de galerie */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={`/images/gallery-${item.id}.jpg`}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#006B3F] mb-2 group-hover:text-[#FF8B7B] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-[#FF8B7B] bg-[#FFE5A5]/20 px-3 py-1 rounded-full">
                      {categories.find(cat => cat.id === item.category)?.name}
                    </span>
                    <button className="text-[#006B3F] hover:text-[#FF8B7B] transition-colors duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bouton retour */}
          <div className="text-center mt-12">
            <Link 
              href="/"
              className="inline-flex items-center bg-[#FF8B7B] text-white px-8 py-3 rounded-full hover:bg-[#FF7B6B] transition-colors font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  )
}