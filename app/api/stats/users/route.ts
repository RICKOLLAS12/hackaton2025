import { NextResponse } from 'next/server'
import { getAdminStats } from '@/server/data'

export async function GET() {
  try {
    const stats = await getAdminStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques utilisateurs:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}