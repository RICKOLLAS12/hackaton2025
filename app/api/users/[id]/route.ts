import { NextResponse } from 'next/server'
import db from '@/prisma/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    const data = await request.json()

    // Vérification des données requises
    if (!data.nom || !data.prenom || !data.email) {
      return NextResponse.json(
        { error: 'Les champs nom, prénom et email sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà pour un autre utilisateur
    const existingUser = await db.user.findFirst({
      where: {
        email: data.email,
        id: { not: userId }
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé par un autre utilisateur' },
        { status: 400 }
      )
    }

    // Mise à jour de l'utilisateur
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone || null
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        telephone: true,
       
        createdAt: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('[UPDATE_USER_ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    )
  }
}