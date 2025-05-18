import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dossier = await prisma.dossier.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        documents: true,
        commentaires: true
      }
    })

    if (!dossier) {
      return NextResponse.json(
        { error: 'Dossier non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(dossier)
  } catch (error) {
    console.error('Erreur lors de la récupération du dossier:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du dossier' },
      { status: 500 }
    )
  }
}