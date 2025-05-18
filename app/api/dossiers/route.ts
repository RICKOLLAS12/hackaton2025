import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Récupérer tous les dossiers
export async function GET() {
  try {
    const dossiers = await prisma.dossier.findMany({
      include: {
        documents: true,
        commentaires: true
      }
    })
    return NextResponse.json(dossiers)
  } catch (error) {
    console.error('Erreur lors de la récupération des dossiers:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des dossiers' },
      { status: 500 }
    )
  }
}