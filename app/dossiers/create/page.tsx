'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schéma de validation Zod
const dossierSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  dateNaissance: z.string().min(1, 'La date de naissance est requise'),
  sexe: z.enum(['M', 'F'], { required_error: 'Le sexe est requis' }),
  commune: z.string().min(2, 'La commune est requise'),
  parentNom: z.string().min(2, 'Le nom du parent est requis'),
  parentTelephone: z.string().regex(/^\+?[0-9]{8,}$/, 'Numéro de téléphone invalide'),
  parentEmail: z.string().email('Email invalide').optional(),
  diagnostic: z.string().optional(),
})

type DossierFormData = z.infer<typeof dossierSchema>

export default function CreateDossierPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [uploadError, setUploadError] = useState<string>('')
  const [documents, setDocuments] = useState<File[]>([])

  const removeFile = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index))
  }

  const { register, handleSubmit, formState: { errors, isValid }, trigger } = useForm<DossierFormData>({
    resolver: zodResolver(dossierSchema),
    mode: 'onChange' // Activer la validation en temps réel
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const validFiles = newFiles.filter(file => {
        const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)
        const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
        if (!isValidType || !isValidSize) {
          setUploadError('Format de fichier invalide ou taille supérieure à 10MB')
          return false
        }
        return true
      })
      setDocuments(prev => [...prev, ...validFiles])
      setUploadError('')
    }
  }

  const handleNextStep = async () => {
    // Déclencher la validation des champs de l'étape actuelle
    const fieldsToValidate = step === 1 
      ? ['nom', 'prenom', 'dateNaissance', 'sexe', 'commune']
      : ['parentNom', 'parentTelephone', 'parentEmail', 'diagnostic']

    const isStepValid = await trigger(fieldsToValidate)
    if (isStepValid) {
      setStep(step + 1)
    }
  }

  const onSubmit = async (data: DossierFormData) => {
    if (!documents.length) {
      setUploadError('Veuillez ajouter au moins un document')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      
      // Ajouter les données du formulaire
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })
      
      // Ajouter les documents
      documents.forEach((file, index) => {
        formData.append(`document${index}`, file)
      })
      
      const response = await fetch('/api/dossiers/create', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(await response.text())
      }
      
      router.push('/dossiers/success')
    } catch (error) {
      console.error('Erreur lors de la création du dossier:', error)
      setUploadError('Une erreur est survenue lors de la création du dossier.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-10 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#006B3F]">Création d'un nouveau dossier</h1>
          <p className="text-gray-600 mt-2">
            Veuillez remplir les informations ci-dessous pour créer un dossier pour votre enfant
          </p>
        </div>
        
        {/* Indicateur d'étapes */}
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= stepNumber ? 'bg-[#006B3F] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`h-1 w-16 ${step > stepNumber ? 'bg-[#006B3F]' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium">Informations de l'enfant</span>
            <span className="text-sm font-medium">Informations du parent</span>
            <span className="text-sm font-medium">Documents</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Étape 1: Informations de l'enfant */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#006B3F] mb-4">Informations de l'enfant</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      {...register('nom')}
                      id="nom"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#006B3F] focus:border-[#006B3F]"
                    />
                    {errors.nom && (
                      <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <input
                      {...register('prenom')}
                      id="prenom"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#006B3F] focus:border-[#006B3F]"
                    />
                    {errors.prenom && (
                      <p className="mt-1 text-sm text-red-600">{errors.prenom.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                    <input
                      {...register('dateNaissance')}
                      id="dateNaissance"
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#006B3F] focus:border-[#006B3F]"
                    />
                    {errors.dateNaissance && (
                      <p className="mt-1 text-sm text-red-600">{errors.dateNaissance.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="sexe" className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                    <select
                      {...register('sexe')}
                      id="sexe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#006B3F] focus:border-[#006B3F]"
                    >
                      <option value="">Sélectionner</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                    {errors.sexe && (
                      <p className="mt-1 text-sm text-red-600">{errors.sexe.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="commune" className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
                  <input
                    {...register('commune')}
                    id="commune"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#006B3F] focus:border-[#006B3F]"
                  />
                  {errors.commune && (
                    <p className="mt-1 text-sm text-red-600">{errors.commune.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Étape 2: Informations du parent/tuteur */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#006B3F] mb-4">Informations du parent/tuteur</h2>
                
                <div>
                  <label htmlFor="parentNom" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input
                    {...register('parentNom')}
                    id="parentNom"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#006B3F] focus:border-[#006B3F]"
                  />
                  {errors.parentNom && (
                    <p className="mt-1 text-sm text-red-600">{errors.parentNom.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="parentTelephone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    {...register('parentTelephone')}
                    id="parentTelephone"
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#006B3F] focus:border-[#006B3F]"
                  />
                  {errors.parentTelephone && (
                    <p className="mt-1 text-sm text-red-600">{errors.parentTelephone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    {...register('parentEmail')}
                    id="parentEmail"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#006B3F] focus:border-[#006B3F]"
                  />
                  {errors.parentEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.parentEmail.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="diagnostic" className="block text-sm font-medium text-gray-700 mb-1">Diagnostic (optionnel)</label>
                  <textarea
                    {...register('diagnostic')}
                    id="diagnostic"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#006B3F] focus:border-[#006B3F]"
                  />
                  {errors.diagnostic && (
                    <p className="mt-1 text-sm text-red-600">{errors.diagnostic.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Étape 3: Documents */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#006B3F] mb-4">Documents</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ajouter des documents
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-[#006B3F] file:text-white
                      hover:file:bg-[#005535]"
                  />
                  {uploadError && (
                    <p className="mt-1 text-sm text-red-600">{uploadError}</p>
                  )}
                </div>
                
                {documents.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Documents ajoutés:</h3>
                    <ul className="space-y-2">
                      {documents.map((file, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <span className="text-sm text-gray-600">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Supprimer
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Précédent
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-[#006B3F] text-white rounded-md hover:bg-[#005535] transition-colors"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className={`px-6 py-2 bg-[#006B3F] text-white rounded-md transition-colors ${
                    (loading || !isValid) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#005535]'
                  }`}
                >
                  {loading ? 'Création en cours...' : 'Créer le dossier'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}