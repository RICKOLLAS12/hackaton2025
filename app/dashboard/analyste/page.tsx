'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AnalysteDashboardPage() {
  const stats = [
    { label: 'À analyser', value: 28, color: 'bg-yellow-500' },
    { label: 'En cours', value: 15, color: 'bg-blue-500' },
    { label: 'Validés', value: 62, color: 'bg-green-500' },
    { label: 'En attente', value: 8, color: 'bg-orange-500' }
  ]

  return (
    <div className="min-h-screen pt-24 pb-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#006B3F]">Espace Analyste</h1>
            <p className="text-gray-600">Analyse et validation des dossiers</p>
          </div>
        </div>
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center text-white`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold">{stat.value}</h2>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Liste des dossiers à analyser */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-[#006B3F]">Dossiers à analyser</h2>
          </div>
          
          {/* Filtres et recherche */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Rechercher un dossier..."
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
              />
              <select className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006B3F]">
                <option value="">Tous les statuts</option>
                <option value="a_analyser">À analyser</option>
                <option value="en_cours">En cours d'analyse</option>
                <option value="valide">Validé</option>
              </select>
            </div>
          </div>
          
          {/* Tableau des dossiers */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière analyse
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Contenu du tableau */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}