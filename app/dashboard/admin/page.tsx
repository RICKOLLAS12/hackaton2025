'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAdminStats, getAllUsers, searchUsers } from '@/server/data'
import { Role } from '@prisma/client'

interface User {
  id: number
  nom: string
  prenom: string
  email: string
  role: Role
  telephone?: string
  createdAt: Date
}

interface Stat {
  label: string
  value: number
  color: string
}

export default function AdminDashboardPage() {
  // États
  const [stats, setStats] = useState<Stat[]>([
    { label: 'Utilisateurs', value: 0, color: 'bg-blue-500' },
    { label: 'Secrétaires', value: 0, color: 'bg-green-500' },
    { label: 'Analystes', value: 0, color: 'bg-yellow-500' },
    { label: 'Admins', value: 0, color: 'bg-purple-500' }
  ])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  // Chargement initial des données
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        const [statsData, usersData] = await Promise.all([
          getAdminStats(),
          getAllUsers()
        ])
        
        if (statsData.length > 0) setStats(statsData)
        setUsers(usersData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  // Gestionnaires d'événements
  const handleSearch = async () => {
    try {
      setLoading(true)
      const filteredUsers = await searchUsers(searchTerm, selectedRole as Role || undefined)
      setUsers(filteredUsers)
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    // Déclencher la recherche après un court délai pour éviter trop d'appels API
    const searchValue = e.target.value
    setTimeout(async () => {
      try {
        setLoading(true)
        const filteredUsers = await searchUsers(searchValue, selectedRole as Role || undefined)
        setUsers(filteredUsers)
      } catch (error) {
        console.error('Erreur lors de la recherche:', error)
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value
    setSelectedRole(role)
    try {
      setLoading(true)
      const filteredUsers = await searchUsers(searchTerm, role as Role || undefined)
      setUsers(filteredUsers)
    } catch (error) {
      console.error('Erreur lors du filtrage par rôle:', error)
    } finally {
      setLoading(false)
    }
  }

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditRole = async (user: User, newRole: Role) => {
    try {
      const response = await fetch(`/api/users/${user.id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        // Mettre à jour la liste des utilisateurs
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, role: newRole } : u
        ));
        setShowEditModal(false);
      } else {
        throw new Error('Erreur lors de la modification du rôle');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la modification du rôle');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#006B3F]">Administration</h1>
            <p className="text-gray-600">Gestion des utilisateurs et paramètres système</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link 
              href="/dashboard/admin/users/create" 
              className="inline-flex items-center px-6 py-3 bg-[#FF8B7B] text-white rounded-lg hover:bg-[#FF7B6B] transition-colors shadow-md hover:shadow-lg"
            >
              <svg 
                className="w-5 h-5 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <span className="font-medium">Ajouter un utilisateur</span>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

        {/* Gestion des utilisateurs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-[#006B3F]">Gestion des utilisateurs</h2>
          </div>
          
          {/* Filtres et recherche */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Rechercher un utilisateur..."
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
              />
              <select
                value={selectedRole}
                onChange={handleRoleChange}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
              >
                <option value="">Tous les rôles</option>
                <option value="PARENT">Utilisateur</option>
                <option value="STAFF">Secrétaire</option>
                <option value="ANALYSTE">Analyste</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-[#006B3F] text-white rounded-md hover:bg-[#005B2F]"
              >
                Rechercher
              </button>
            </div>
          </div>

          {/* Tableau des utilisateurs */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Téléphone
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
                {users.map((user: any) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.nom} {user.prenom}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'STAFF' ? 'bg-green-100 text-green-800' :
                        user.role === 'ANALYSTE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.telephone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    {/* Modal de modification de rôle */}
                    {showEditModal && editingUser && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                          <h3 className="text-lg font-bold text-[#006B3F] mb-4">
                            Modifier le rôle de {editingUser.nom} {editingUser.prenom}
                          </h3>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nouveau rôle
                            </label>
                            <select
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
                              value={editingUser.role}
                              onChange={(e) => handleEditRole(editingUser, e.target.value as Role)}
                            >
                              <option value="PARENT">Utilisateur</option>
                              <option value="STAFF">Secrétaire</option>
                              <option value="ANALYSTE">Analyste</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => setShowEditModal(false)}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={() => handleEditRole(editingUser, editingUser.role)}
                              className="px-4 py-2 bg-[#006B3F] text-white rounded-md hover:bg-[#005B2F]"
                            >
                              Confirmer
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Modifier le rendu du tableau pour ajouter le bouton de modification */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setShowEditModal(true);
                        }}
                        className="text-[#006B3F] hover:text-[#005B2F] mr-4"
                      >
                        Modifier le rôle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Paramètres système */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-[#006B3F]">Paramètres système</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Configuration générale</h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nom de l'application
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
                    defaultValue="Fondation Horizons Nouveaux"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-[#006B3F] focus:ring-[#006B3F]" />
                    <span className="text-sm text-gray-700">Activer les notifications par email</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-[#006B3F] text-white rounded-md hover:bg-[#005535] transition-colors">
                Sauvegarder les paramètres
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}