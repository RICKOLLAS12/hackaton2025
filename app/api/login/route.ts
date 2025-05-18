// app/api/login/route.ts
import { NextResponse } from 'next/server'
import { connectUser } from '@/server/data'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password } = body

  const con = await connectUser(email, password)

  if (con && con.user?.password === password) {
    const response = NextResponse.json({ success: true })

    // Stocker une session "fake" pour démonstration
    response.cookies.set({
      name: 'session',
      value: 'true',
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, 
    })

    return response
  }

  return NextResponse.json({ success: false, message: 'Identifiants invalides' }, { status: 401 })
}
