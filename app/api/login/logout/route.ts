// app/api/logout/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ success: true })
  await res.cookies.set('session', '', { maxAge: 0 })
  return res;
}
