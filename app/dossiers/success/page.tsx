'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()
  
  useEffect(() => {
    // Redirection automatique après 5 secondes
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [router])
  
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-10 bg-white rounded-xl shadow-lg text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-[#006B3F] mb-4">Dossier créé avec succès!</h2>
        
        <p className="text-gray-600 mb-8">
          Votre dossier a été créé et sera examiné par notre équipe. Vous recevrez une notification par email lorsque le statut de votre dossier changera.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/dashboard"
            className="block w-full bg-[#006B3F] text-white px-4 py-2 rounded-md hover:bg-[#005535] transition-colors"
          >
            Retour au tableau de bord
          </Link>
          
          <Link 
            href="/dossiers/create"
            className="block w-full bg-white text-[#006B3F] border border-[#006B3F] px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Créer un autre dossier
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          Redirection automatique dans {countdown} secondes...
        </p>
      </div>
    </div>
  )
}