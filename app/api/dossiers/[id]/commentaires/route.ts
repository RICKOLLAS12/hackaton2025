import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { text, author } = await request.json()
    
    const commentaire = await prisma.commentaire.create({
      data: {
        text,
        author,
        dossierId: parseInt(context.params.id),
        date: new Date(),
        dateModification: new Date()
      }
    })

    return NextResponse.json(commentaire)
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du commentaire' },
      { status: 500 }
    )
  }
}