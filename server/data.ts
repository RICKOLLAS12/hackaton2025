"use server";

import db from "@/prisma/prisma";
import { UUID } from "crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { wisiSchema } from "./schema";
import { Role } from "@prisma/client";


const JWT_SECRET = process.env.JWT_SECRET || 'dfcghbjk,ljbhfvghjbkjl'

export async function subscribeUser(data: any) {
    return await db.user.create({
        data: {
    
            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
            telephone: data.telephone,
            password: data.password,
        }
    });
}



export async function connectUser(email: any, password: any) {
  if (!email || !password) {
    return { success: false, message: "Email et mot de passe requis" }
  }

  const user = await getUserByEmail(email)

  if (!user) {
    return { success: false, message: "Utilisateur introuvable" }
  }

  const isPasswordCorrect = user.password === password

  if (!isPasswordCorrect) {
    return { success: false, message: "Mot de passe incorrect" }
  }

  // Générer le token JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role, // optionnel
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  )

  return {
    success: true,
    message: "Connexion réussie",
    user,
    token, // <-- à renvoyer côté client pour le stocker en cookie
  }
}

// export async function connectUser( email:any, password:any) {
//   if (!email || !password) {
//     return { success: false, message: "Email et mot de passe requis" };
//   }

//   const user = await getUserByEmail(email);

//   if (!user) {
//     return { success: false, message: "Utilisateur introuvable" };
//   }

//   const isPasswordCorrect = user.password === password;

//   if (!isPasswordCorrect) {
//     return { success: false, message: "Mot de passe incorrect" };
//   }

//   return {
//     success: true,
//     message: "Connexion réussie",
//     user,
//   };
// }



export async function getAllUsers() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        createdAt: true,
        telephone: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return users;
  } catch (error) {
    console.error('[GET_ALL_USERS_ERROR]', error);
    return [];
  }
}

export async function searchUsers(searchTerm: string, role?: Role) {
  try {
    const where: any = {
      OR: [
        { nom: { contains: searchTerm, mode: 'insensitive' } },
        { prenom: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } }
      ]
    };

    if (role) {
      where.role = role;
    }

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        createdAt: true,
        telephone: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return users;
  } catch (error) {
    console.error('[SEARCH_USERS_ERROR]', error);
    return [];
  }
}

export async function getUserByEmail(email: string) {
  const data = await db.user.findUnique({
    select:{
      id:true,
      password:true,
      nom:true,
      prenom:true,
      role:true,
      email:true,
      telephone:true,
      createdAt:true,
      updatedAt:true
    },
      where: {
          email: email,
      },
  });
    return data;
}

const formulaireWisiSchema = z.object({
  dossierId: z.number(),
  revenuMensuel: z.number().optional(),
  besoins: z.string().optional(),
  autresInformations: z.string().optional()
});

export async function submitWisiForm(data: any) {
  try {
    await db.formulaireWisi.create({
      data: {
        dossierId: data.dossierId,
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
      }
    })
    return { success: true }
  } catch (error) {
    console.error('[WISI_SUBMIT_ERROR]', error)
    return { success: false, error: 'Erreur lors de la soumission.' }
  }
}


export async function getAdminStats() {
  try {
    const users = await db.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    });

    const stats = users.map(stat => ({
      label: stat.role === 'PARENT' ? 'Utilisateurs' :
             stat.role === 'STAFF' ? 'Secrétaires' :
             stat.role === 'ANALYSTE' ? 'Analystes' :
             stat.role === 'ADMIN' ? 'Admins' : stat.role,
      value: stat._count.id,
      color: stat.role === 'PARENT' ? 'bg-blue-500' :
             stat.role === 'STAFF' ? 'bg-green-500' :
             stat.role === 'ANALYSTE' ? 'bg-yellow-500' :
             stat.role === 'ADMIN' ? 'bg-purple-500' : 'bg-gray-500'
    }));

    return stats;
  } catch (error) {
    console.error('[GET_ADMIN_STATS_ERROR]', error);
    return [];
  }
}