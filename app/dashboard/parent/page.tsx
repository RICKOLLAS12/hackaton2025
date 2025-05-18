'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Dossier = {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  statut: string;
  dateModification: string;
};

export default function ParentDashboardPage() {
  const [dossiers, setDossiers] = useState<Dossier[]>([])

  useEffect(() => {
  const fetchDossiers = async () => {
    const userId = localStorage.getItem('id')
    if (!userId) return

    try {
      const res = await fetch(`/api/dossiers?userId=${userId}`)
      const data = await res.json()
      setDossiers(data)
    } catch (error) {
      console.error('Erreur lors du fetch des dossiers:', error)
    }
  }

  fetchDossiers()
}, []);

  // Calcul des stats dynamiques
  const stats = [
    { label: 'Mes Dossiers', value: dossiers.length, color: 'bg-blue-500' },
    { label: 'En cours', value: dossiers.filter(d => d.statut === 'EN_COURS').length, color: 'bg-yellow-500' },
    { label: 'Acceptés', value: dossiers.filter(d => d.statut === 'ACCEPTE').length, color: 'bg-green-500' },
    { label: 'En attente', value: dossiers.filter(d => d.statut === 'EN_ATTENTE').length, color: 'bg-orange-500' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#006B3F]">Espace Parent</h1>
            <p className="text-gray-600">Gérez les dossiers de vos enfants</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link 
              href="/dossiers/create" 
              className="inline-flex items-center px-4 py-2 bg-[#FF8B7B] text-white rounded-md hover:bg-[#FF7B6B] transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nouveau dossier
            </Link>
          </div>
        </div>
        
        {/* Statistiques dynamiques */}
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

        {/* Liste des dossiers */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-[#006B3F]">Mes Dossiers</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enfant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de naissance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière mise à jour</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dossiers.map((dossier: any) => (
                  <tr key={dossier.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{dossier.nom} {dossier.prenom}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(dossier.dateNaissance).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dossier.statut}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(dossier.dateModification).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link href={`/dossiers/${dossier.id}`} className="text-blue-600 hover:underline">Voir</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
