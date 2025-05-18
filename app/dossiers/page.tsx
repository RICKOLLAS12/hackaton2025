'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Types
type DossierStatus = 'Nouveau' | 'En cours' | 'Incomplet' | 'Accepté' | 'Rejeté' | 'Clôturé'

interface Dossier {
  id: string
  nom: string
  prenom: string
  dateNaissance: string
  parentNom: string
  commune: string
  statut: DossierStatus
  dateCreation: string
}

export default function DossiersPage() {
  const router = useRouter()
  const [dossiers, setDossiers] = useState<Dossier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<DossierStatus | 'tous'>('tous')
  const [sortField, setSortField] = useState<keyof Dossier>('dateCreation')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Simuler le chargement des dossiers
  useEffect(() => {
    const fetchDossiers = async () => {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Données de test
      const mockDossiers: Dossier[] = Array.from({ length: 25 }, (_, i) => {
        const id = (i + 1).toString()
        const statuses: DossierStatus[] = ['Nouveau', 'En cours', 'Incomplet', 'Accepté', 'Rejeté', 'Clôturé']
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)] as DossierStatus
        
        return {
          id,
          nom: `Nom${id}`,
          prenom: `Prénom${id}`,
          dateNaissance: new Date(2010 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
          parentNom: `Parent${id}`,
          commune: ['Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Matadi'][Math.floor(Math.random() * 5)],
          statut: randomStatus,
          dateCreation: new Date(2022 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
        }
      })
      
      setDossiers(mockDossiers)
      setLoading(false)
    }
    
    fetchDossiers()
  }, [])
  
  // Filtrer les dossiers
  const filteredDossiers = dossiers.filter(dossier => {
    const matchesSearch = 
      dossier.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.parentNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.commune.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'tous' || dossier.statut === statusFilter
    
    return matchesSearch && matchesStatus
  })
  
  // Trier les dossiers
  const sortedDossiers = [...filteredDossiers].sort((a, b) => {
    const fieldA = a[sortField]
    const fieldB = b[sortField]
    
    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1
    return 0
  })
  
  // Pagination
  const totalPages = Math.ceil(sortedDossiers.length / itemsPerPage)
  const paginatedDossiers = sortedDossiers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  // Changer le tri
  const handleSort = (field: keyof Dossier) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  // Obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: DossierStatus) => {
    switch(status) {
      case 'Nouveau': return 'bg-blue-100 text-blue-800'
      case 'En cours': return 'bg-yellow-100 text-yellow-800'
      case 'Incomplet': return 'bg-orange-100 text-orange-800'
      case 'Accepté': return 'bg-green-100 text-green-800'
      case 'Rejeté': return 'bg-red-100 text-red-800'
      case 'Clôturé': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Générer les boutons de pagination
  const paginationButtons = () => {
    const buttons = []
    
    // Bouton précédent
    buttons.push(
      <button
        key="prev"
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-[#006B3F] hover:bg-gray-50'
        }`}
      >
        Précédent
      </button>
    )
    
    // Numéros de page
    for (let i = 1; i <= totalPages; i++) {
      // Afficher seulement les pages proches de la page actuelle
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        buttons.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`px-3 py-1 rounded-md ${
              currentPage === i 
                ? 'bg-[#006B3F] text-white' 
                : 'bg-white text-[#006B3F] hover:bg-gray-50'
            }`}
          >
            {i}
          </button>
        )
      } else if (
        (i === currentPage - 2 && currentPage > 3) || 
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        // Afficher des points de suspension
        buttons.push(
          <span key={i} className="px-2">...</span>
        )
      }
    }
    
    // Bouton suivant
    buttons.push(
      <button
        key="next"
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-[#006B3F] hover:bg-gray-50'
        }`}
      >
        Suivant
      </button>
    )
    
    return buttons
  }
  
  return (
    <div className="min-h-screen pt-24 pb-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#006B3F]">Dossiers</h1>
            <p className="text-gray-600 mt-1">
              Gérez et suivez tous les dossiers des enfants
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link 
              href="/dossiers/create"
              className="inline-flex items-center bg-[#006B3F] text-white px-4 py-2 rounded-md hover:bg-[#005535] transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nouveau dossier
            </Link>
          </div>
        </div>
        
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Rechercher
              </label>
              <input
                type="text"
                id="search"
                placeholder="Nom, prénom, parent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#006B3F] focus:border-[#006B3F]"
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as DossierStatus | 'tous')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#006B3F] focus:border-[#006B3F]"
              >
                <option value="tous">Tous les statuts</option>
                <option value="Nouveau">Nouveau</option>
                <option value="En cours">En cours</option>
                <option value="Incomplet">Incomplet</option>
                <option value="Accepté">Accepté</option>
                <option value="Rejeté">Rejeté</option>
                <option value="Clôturé">Clôturé</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('tous')
                  setSortField('dateCreation')
                  setSortDirection('desc')
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>
        
        {/* Tableau des dossiers */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#006B3F] border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Chargement des dossiers...</p>
            </div>
          ) : paginatedDossiers.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun dossier trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucun dossier ne correspond à vos critères de recherche.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center">
                        ID
                        {sortField === 'id' && (
                          <svg className={`ml-1 w-4 h-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('nom')}
                    >
                      <div className="flex items-center">
                        Nom & Prénom
                        {sortField === 'nom' && (
                          <svg className={`ml-1 w-4 h-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('dateNaissance')}
                    >
                      <div className="flex items-center">
                        Date de naissance
                        {sortField === 'dateNaissance' && (
                          <svg className={`ml-1 w-4 h-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('parentNom')}
                    >
                      <div className="flex items-center">
                        Parent/Tuteur
                        {sortField === 'parentNom' && (
                          <svg className={`ml-1 w-4 h-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('commune')}
                    >
                      <div className="flex items-center">
                        Commune
                        {sortField === 'commune' && (
                          <svg className={`ml-1 w-4 h-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('statut')}
                    >
                      <div className="flex items-center">
                        Statut
                        {sortField === 'statut' && (
                          <svg className={`ml-1 w-4 h-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('dateCreation')}
                    >
                      <div className="flex items-center">
                        Date de création
                        {sortField === 'dateCreation' && (
                          <svg className={`ml-1 w-4 h-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedDossiers.map((dossier) => (
                    <tr 
                      key={dossier.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/dossiers/${dossier.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dossier.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dossier.nom} {dossier.prenom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(dossier.dateNaissance).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dossier.parentNom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dossier.commune}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(dossier.statut)}`}>
                          {dossier.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(dossier.dateCreation).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/dossiers/${dossier.id}`}
                          className="text-[#006B3F] hover:text-[#005535] mr-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Voir
                        </Link>
                        <button
                          className="text-[#FF8B7B] hover:text-[#FF7B6B]"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Logique pour éditer le dossier
                          }}
                        >
                          Éditer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {!loading && paginatedDossiers.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredDossiers.length)}
                </span>{' '}
                sur <span className="font-medium">{filteredDossiers.length}</span> dossiers
              </div>
              <div className="flex space-x-2">
                {paginationButtons()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}