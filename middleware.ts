import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Définir les chemins qui nécessitent une authentification
const protectedPaths = [
  '/formulaires/wisi',
  '/formulaires/tarii',
  '/formulaires/fhn',
]

export function middleware(request: NextRequest) {
  // Vérifier si l'utilisateur est connecté (via un cookie ou token JWT)
  const session = request.cookies.get('session')?.value
  
  // Obtenir le chemin de la requête
  const path = request.nextUrl.pathname
  
  // Vérifier si le chemin actuel nécessite une authentification
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path.startsWith(protectedPath)
  )
  
  // Si le chemin est protégé et que l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (isProtectedPath && !session) {
    const url = new URL('/login', request.url)
    // Ajouter le paramètre de redirection pour revenir à la page d'origine après connexion
    url.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

// Configurer le middleware pour s'exécuter uniquement sur les chemins spécifiés
export const config = {
  matcher: [
    '/formulaires/:path*',
    '/profile/:path*',
  ],
}