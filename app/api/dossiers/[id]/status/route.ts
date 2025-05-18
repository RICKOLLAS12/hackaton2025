import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { statut } = await request.json()
    
    const status = await prisma.dossier.update({
      where: { id: parseInt(params.id) },
      data: {
        statut
      }
    })

    return NextResponse.json(status)
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du commentaire' },
      { status: 500 }
    )
  }
}