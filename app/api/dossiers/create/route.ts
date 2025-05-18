import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { StatutDossier } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    // Extraire les données du formulaire
    const dossierData = {
      nom: formData.get('nom') as string,
      prenom: formData.get('prenom') as string,
      dateNaissance: new Date(formData.get('dateNaissance') as string),
      sexe: formData.get('sexe') as 'M' | 'F',
      commune: formData.get('commune') as string,
      parentNom: formData.get('parentNom') as string,
      parentTelephone: formData.get('parentTelephone') as string,
      parentEmail: formData.get('parentEmail') as string || null,
      diagnostic: formData.get('diagnostic') as string || null,
      statut: 'NOUVEAU' as StatutDossier,
      dateCreation: new Date(),
      dateModification: new Date(),
      userId: 1, // À remplacer par l'ID de l'utilisateur connecté
    }

    // Créer le dossier dans la base de données
    const dossier = await prisma.dossier.create({
      data: dossierData
    })

    // Gérer les documents
    const documents = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('document')) {
        const file = value as File
        // Créer l'entrée du document dans la base de données
        const document = await prisma.document.create({
          data: {
            name: file.name,
            type: file.type,
            url: '/uploads/' + file.name, // Required field according to schema
            uploadDate: new Date(),
            dossier: {
              connect: {
                id: dossier.id
              }
            }
          }
        })
        documents.push(document)
      }
    }

    return NextResponse.json({ 
      success: true, 
      dossier, 
      documents 
    })
  } catch (error) {
    console.error('Erreur lors de la création du dossier:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la création du dossier' 
      },
      { status: 500 }
    )
  }
}