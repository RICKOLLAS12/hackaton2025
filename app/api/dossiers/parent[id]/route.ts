
import db from '@/prisma/prisma'
import { NextRequest, NextResponse } from 'next/server'
// import { useUser } from '@/context/UserProvider' // Removed: not usable in API routes

export async function GET(req: NextRequest) {
  // const { user } = useUser() // Removed: not usable in API routes
  // const Userpro = user?.id   // Removed: not usable in API routes

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId requis' }, { status: 400 })
  }

  const dossiers = await db.dossier.findMany({
    where: { userId: parseInt(userId) },
    include: {
      documents: true,
      commentaires: true,
    }
  })

  return NextResponse.json(dossiers)
}