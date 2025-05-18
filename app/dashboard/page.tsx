'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Types basés sur le schéma Prisma
type DossierStatus = 'NOUVEAU' | 'EN_COURS' | 'INCOMPLET' | 'ACCEPTE' | 'REJETE' | 'CLOTURE'

type Dossier = {
  id: number
  nom: string
  prenom: string
  dateNaissance: Date
  statut: DossierStatus
  dateCreation: Date
  dateModification: Date
}

type DashboardStats = {
  total: number
  enCours: number
  acceptes: number
  enAttente: number
}

type StatCard = {
  label: string
  value: number
  color: string
}

export default function DashboardPage() {
  const [dossiers, setDossiers] = useState<Dossier[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    enCours: 0,
    acceptes: 0,
    enAttente: 0
  })
  const [statusFilter, setStatusFilter] = useState<DossierStatus | 'TOUS'>('TOUS')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        const response = await fetch('/api/dossiers')
        const data = await response.json()
        setDossiers(data)
        
        // Calculer les statistiques
        setStats({
          total: data.length,
          enCours: data.filter((d: Dossier) => d.statut === 'EN_COURS').length,
          acceptes: data.filter((d: Dossier) => d.statut === 'ACCEPTE').length,
          enAttente: data.filter((d: Dossier) => d.statut === 'NOUVEAU').length
        })
      } catch (error) {
        console.error('Erreur lors du chargement des dossiers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDossiers()
  }, [])

  const statsCards: StatCard[] = [
    { label: 'Total Dossiers', value: stats.total, color: 'bg-blue-500' },
    { label: 'En cours', value: stats.enCours, color: 'bg-yellow-500' },
    { label: 'Acceptés', value: stats.acceptes, color: 'bg-green-500' },
    { label: 'En attente', value: stats.enAttente, color: 'bg-orange-500' }
  ]

  const statusOptions = ['Tous', 'Nouveau', 'En cours', 'Incomplet', 'Accepté', 'Rejeté', 'Clôturé']

  const filteredDossiers = statusFilter === 'TOUS'
    ? dossiers
    : dossiers.filter(dossier => dossier.statut === statusFilter)

  const getStatusColor = (status: DossierStatus) => {
    const statusColors = {
      'NOUVEAU': 'bg-blue-100 text-blue-800',
      'EN_COURS': 'bg-yellow-100 text-yellow-800',
      'INCOMPLET': 'bg-orange-100 text-orange-800',
      'ACCEPTE': 'bg-green-100 text-green-800',
      'REJETE': 'bg-red-100 text-red-800',
      'CLOTURE': 'bg-gray-100 text-gray-800'
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-10 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#006B3F]">Tableau de bord</h1>
            <p className="text-gray-600">Bienvenue sur votre espace personnel</p>
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
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
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
            <h2 className="text-xl font-bold text-[#006B3F]">Dossiers récents</h2>
          </div>
          
          {/* Filtres */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as DossierStatus | 'TOUS')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    statusFilter === status 
                      ? 'bg-[#006B3F] text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tableau */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de naissance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière mise à jour</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDossiers.map((dossier) => (
                  <tr key={dossier.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dossier.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dossier.nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dossier.prenom}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(dossier.dateNaissance)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(dossier.statut)}`}>
                        {dossier.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(dossier.dateCreation)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(dossier.dateModification)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/dossiers/${dossier.id}`}
                        className="text-[#006B3F] hover:text-[#005535]"
                      >
                        Voir détails
                      </Link>
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