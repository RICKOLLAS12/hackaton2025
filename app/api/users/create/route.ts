import { NextResponse } from 'next/server'
import db from '@/prisma/prisma'
import { Role } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Vérifier si l'email existe déjà
    const existingUser = await db.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      )
    }

    // Créer le nouvel utilisateur
    const newUser = await db.user.create({
      data: {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        password: data.password, // Note: Il faudrait hasher le mot de passe
        telephone: data.telephone,
        role: data.role as Role
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

    return NextResponse.json(newUser)
  } catch (error) {
    console.error('[CREATE_USER_ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    )
  }
}