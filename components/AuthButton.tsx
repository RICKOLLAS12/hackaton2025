'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type AuthButtonProps = {
  href: string
  className?: string
  children: React.ReactNode
}

export default function AuthButton({ href, className, children }: AuthButtonProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Vérifier l'état d'authentification au chargement du composant
  useEffect(() => {
    // Vérifier si un cookie de session existe
    const hasCookie = document.cookie.includes('session=')
    setIsAuthenticated(hasCookie)
  }, [])
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    if (isAuthenticated) {
      // Si l'utilisateur est connecté, rediriger vers la page demandée
      router.push(href)
    } else {
      // Sinon, rediriger vers la page de connexion avec un callback
      router.push(`/login?callbackUrl=${encodeURIComponent(href)}`)
    }
  }
  
  return (
    <a 
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  )
}