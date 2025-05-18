'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { StatutDossier, Sexe } from '@prisma/client'

interface Document {
  id: number
  name: string
  type: string
  url: string
  uploadDate: Date
}

interface Commentaire {
  id: number
  text: string
  author: string
  date: Date
}

interface Dossier {
  id: number
  nom: string
  prenom: string
  dateNaissance: Date
  sexe: Sexe
  commune: string
  quartier: string | null
  parentNom: string
  parentTelephone: string | null
  parentEmail: string | null
  diagnostic: string | null
  statut: StatutDossier
  dateCreation: Date
  dateModification: Date
  documents: Document[]
  commentaires: Commentaire[]
}

export default function DossierDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [dossier, setDossier] = useState<Dossier | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('info')
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [newStatus, setNewStatus] = useState<StatutDossier | ''>('')

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/dossiers/${params.id}`)
        if (!response.ok) {
          const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors du chargement du dossier')
        }
        const data = await response.json()
        setDossier(data)
        setNewStatus(data.statut)
      } catch (error) {
        console.error('Erreur lors du chargement du dossier:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDossier()
  }, [params.id])

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !dossier) return
    
    setSubmittingComment(true)
    
    try {
      const response = await fetch(`/api/dossiers/${dossier.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newComment }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du commentaire')
      }

      const newCommentData = await response.json()
      
      setDossier(prev => {
        if (!prev) return prev
        return {
          ...prev,
          commentaires: [...prev.commentaires, newCommentData]
        }
      })
      
      setNewComment('')
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleStatusChange = async () => {
    if (!newStatus || !dossier) return
    
    try {
      const response = await fetch(`/api/dossiers/${dossier.id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du statut')
      }

      const updatedDossier = await response.json()
      setDossier(updatedDossier)
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
      // Vous pouvez ajouter ici un état pour afficher l'erreur à l'utilisateur
      alert('Une erreur est survenue lors de la mise à jour du statut')
    }
  }

  const getStatusColor = (status: StatutDossier) => {
    switch(status) {
      case 'NOUVEAU': return 'bg-blue-100 text-blue-800'
      case 'EN_COURS': return 'bg-yellow-100 text-yellow-800'
      case 'INCOMPLET': return 'bg-orange-100 text-orange-800'
      case 'ACCEPTE': return 'bg-green-100 text-green-800'
      case 'REJETE': return 'bg-red-100 text-red-800'
      case 'CLOTURE': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Obtenir l'icône pour le type de document
  const getDocumentIcon = (type: string) => {
    if (type.includes('pdf')) {
      return (
        <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      )
    } else if (type.includes('image')) {
      return (
        <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      )
    } else {
      return (
        <svg className="h-6 w-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      )
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-10 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#006B3F] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Chargement du dossier...</p>
        </div>
      </div>
    )
  }
  
  if (!dossier) {
    return (
      <div className="min-h-screen pt-24 pb-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="mt-2 text-xl font-semibold text-gray-900">Dossier non trouvé</h2>
            <p className="mt-1 text-gray-500">Le dossier que vous recherchez n'existe pas ou a été supprimé.</p>
            <div className="mt-6">
              <Link href="/dossiers" className="inline-flex items-center bg-[#006B3F] text-white px-4 py-2 rounded-md hover:bg-[#005535] transition-colors">
                Retour à la liste des dossiers
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-24 pb-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/dossiers" className="inline-flex items-center text-[#006B3F] hover:underline">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à la liste des dossiers
          </Link>
        </div>
        
        {/* En-tête du dossier */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dossier de {dossier.prenom} {dossier.nom}
              </h1>
              <p className="text-gray-600 mt-1">
                ID: {dossier.id} | Créé le {new Date(dossier.dateCreation).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dossier.statut)}`}>
                {dossier.statut}
              </span>
              <div className="ml-4">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as DossierStatus)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-[#006B3F] focus:border-[#006B3F]"
                >
                  <option value="">Changer le statut</option>
                  <option value="Nouveau">Nouveau</option>
                  <option value="En cours">En cours</option>
                  <option value="Incomplet">Incomplet</option>
                  <option value="Accepté">Accepté</option>
                  <option value="Rejeté">Rejeté</option>
                  <option value="Clôturé">Clôturé</option>
                </select>
                <button
                  onClick={handleStatusChange}
                  disabled={!newStatus || newStatus === dossier.statut}
                  className={`ml-2 px-3 py-1 rounded-md text-sm ${
                    !newStatus || newStatus === dossier.statut
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-[#006B3F] text-white hover:bg-[#005535]'
                  }`}
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Onglets */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'info'
                    ? 'border-[#006B3F] text-[#006B3F]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Informations
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-[#006B3F] text-[#006B3F]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('commentaires')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'commentaires'
                    ? 'border-[#006B3F] text-[#006B3F]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Commentaires
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {/* Onglet Informations */}
            {activeTab === 'info' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Informations de l'enfant</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nom complet</p>
                      <p className="mt-1 text-gray-900">{dossier.prenom} {dossier.nom}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date de naissance</p>
                      <p className="mt-1 text-gray-900">{new Date(dossier.dateNaissance).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Sexe</p>
                      <p className="mt-1 text-gray-900">{dossier.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Commune</p>
                      <p className="mt-1 text-gray-900">{dossier.commune}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Informations du parent/tuteur</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nom complet</p>
                      <p className="mt-1 text-gray-900">{dossier.parentNom}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Téléphone</p>
                      <p className="mt-1 text-gray-900">{dossier.parentTelephone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1 text-gray-900">{dossier.parentEmail}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Diagnostic</h2>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-900">{dossier.diagnostic}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Onglet Documents */}
            {activeTab === 'documents' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Documents ({dossier.documents.length})</h2>
                  <button className="inline-flex items-center bg-[#006B3F] text-white px-3 py-1 rounded-md hover:bg-[#005535] transition-colors text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter un document
                  </button>
                </div>
                
                {dossier.documents.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-md">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Commencez par ajouter un document à ce dossier.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {dossier.documents.map((doc) => (
                      <li key={doc.id} className="py-4 flex items-center">
                        <div className="flex-shrink-0">
                          {getDocumentIcon(doc.type)}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            Ajouté le {new Date(doc.uploadDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex space-x-2">
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-[#006B3F] hover:text-[#005535]"
                          >
                            Voir
                          </a>
                          <button className="text-sm font-medium text-[#FF8B7B] hover:text-[#FF7B6B]">
                            Supprimer
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {/* Onglet Commentaires */}
            {activeTab === 'commentaires' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Commentaires</h2>
                
                {/* Formulaire d'ajout de commentaire */}
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="mb-3">
                    <label htmlFor="comment" className="sr-only">Commentaire</label>
                    <textarea
                      id="comment"
                      rows={3}
                      placeholder="Ajouter un commentaire..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#006B3F] focus:border-[#006B3F]"
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className={`inline-flex items-center px-4 py-2 rounded-md text-white ${
                        submittingComment
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#006B3F] hover:bg-[#005535]'
                      }`}
                    >
                      {submittingComment ? 'Envoi en cours...' : 'Ajouter un commentaire'}
                    </button>
                  </div>
                </form>
                
                {/* Liste des commentaires */}
                {dossier.commentaires.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-md">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun commentaire</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Soyez le premier à commenter ce dossier.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {dossier.commentaires.slice().reverse().map((comment) => (
                      <li key={comment.id} className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">{comment.author}</div>
                          <div className="text-sm text-gray-500">{new Date(comment.date).toLocaleDateString('fr-FR')}</div>
                        </div>
                        <p className="mt-2 text-gray-900">{comment.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}