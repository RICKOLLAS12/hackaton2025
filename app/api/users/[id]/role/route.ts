import { NextResponse } from 'next/server'
import db from '@/prisma/prisma'
import { Role } from '@prisma/client'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    const { role } = await request.json()

    // Vérifier si le rôle est valide
    if (!Object.values(Role).includes(role)) {
      return NextResponse.json(
        { error: 'Rôle invalide' },
        { status: 400 }
      )
    }

    // Mettre à jour le rôle de l'utilisateur
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { role: role as Role },
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
    console.error('[UPDATE_USER_ROLE_ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification du rôle' },
      { status: 500 }
    )
  }
}