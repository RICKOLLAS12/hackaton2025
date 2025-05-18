'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

type User = {
  id: number
  nom: string
  prenom: string
  email: string
  role: string
  telephone?: string
  avatar?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData({
        nom: parsedUser.nom || '',
        prenom: parsedUser.prenom || '',
        email: parsedUser.email || '',
        telephone: parsedUser.telephone || ''
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
    }
  }

  if (!user) {
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
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-[#006B3F]">Mon Profil</h1>
            </div>

            <div className="p-6">
              <div className="flex items-start space-x-6">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#FFE5A5]">
                  <Image
                    src={user.avatar || "/images/avatar-placeholder.jpg"}
                    alt="Photo de profil"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-xl font-semibold">{user.prenom} {user.nom}</h2>
                        <p className="text-gray-600">{user.role}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-600">Email: {user.email}</p>
                        {user.telephone && (
                          <p className="text-gray-600">Téléphone: {user.telephone}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-[#006B3F] text-white rounded-md hover:bg-[#005535] transition-colors"
                      >
                        Modifier le profil
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom
                          </label>
                          <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prénom
                          </label>
                          <input
                            type="text"
                            value={formData.prenom}
                            onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={formData.telephone}
                          onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#006B3F] text-white rounded-md hover:bg-[#005535] transition-colors"
                        >
                          Enregistrer
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}