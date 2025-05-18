// app/api/wisi/route.ts
import db from '@/prisma/prisma'
import { NextResponse } from 'next/server'


export async function POST(req: Request) {
  try {
    const data = await req.json()

    await db.formulaireWisi.create({
      data: {
        dossierId: Number(data.dossierId),
        nom: data.nom,
        prenom: data.prenom,
        dateNaissance: new Date(data.dateNaissance),
        lieuNaissance: data.lieuNaissance,
        adresse: data.adresse,
        telephone: data.telephone,
        email: data.email,
        typeHandicap: data.typeHandicap,
        niveauEtude: data.niveauEtude,
        situationFamiliale: data.situationFamiliale,
        nombreEnfants: Number(data.nombreEnfants),
        profession: data.profession,
        revenuMensuel: Number(data.revenuMensuel),
        besoins: data.besoins,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[WISI_SUBMIT_ERROR]', error)
    return NextResponse.json({ success: false, error: 'Erreur lors de la soumission.' }, { status: 500 })
  }
}
