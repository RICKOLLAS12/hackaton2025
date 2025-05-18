import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Supprimer le cookie de session
    const cookieStore = cookies()
    cookieStore.delete('session')
    
    // Vous pouvez ajouter d'autres opérations de nettoyage ici
    // Par exemple, invalider le token côté serveur si vous utilisez une table de sessions

    return NextResponse.json(
      { message: 'Déconnexion réussie' },
      { 
        status: 200,
        headers: {
          'Set-Cookie': 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict'
        }
      }
    )
  } catch (error) {
    console.error('[LOGOUT_ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    )
  }
}