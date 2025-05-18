'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SecretaireDashboardPage() {
  const stats = [
    { label: 'Total Dossiers', value: 124, color: 'bg-blue-500' },
    { label: 'Nouveaux', value: 15, color: 'bg-green-500' },
    { label: 'En attente', value: 45, color: 'bg-yellow-500' },
    { label: 'À compléter', value: 12, color: 'bg-orange-500' }
  ]

  return (
    <div className="min-h-screen pt-24 pb-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#006B3F]">Espace Secrétariat</h1>
            <p className="text-gray-600">Gestion des dossiers et suivi administratif</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link 
              href="/dossiers/create" 
              className="inline-flex items-center px-4 py-2 bg-[#FF8B7B] text-white rounded-md hover:bg-[#FF7B6B] transition-colors"
            >
              Nouveau dossier
            </Link>
            <Link 
              href="/recherche" 
              className="inline-flex items-center px-4 py-2 bg-[#006B3F] text-white rounded-md hover:bg-[#005535] transition-colors"
            >
              Recherche avancée
            </Link>
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

        {/* Liste des dossiers à traiter */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-[#006B3F]">Dossiers à traiter</h2>
          </div>
          
          {/* Filtres et recherche */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Rechercher un dossier..."
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
              />
              {/* 'NOUVEAU' | 'EN_COURS' | 'INCOMPLET' | 'ACCEPTE' | 'REJETE' | 'CLOTURE' */}
              <select className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006B3F]">
                <option value="">Tous les statuts</option>
                <option value="NOUVEAU">Nouveau</option>
                <option value="EN_COURS">En cours</option>
                <option value="INCOMPLET">Incomplet</option>
                <option value="ACCEPTE">Accepté</option>
                <option value="REJETE">Rejeté</option>
                <option value="CLOTURE">Cloturé</option>
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
                    Date de création
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