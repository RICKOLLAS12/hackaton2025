import { UseFormReturn } from "react-hook-form";
import { z } from "zod";


export const fullSchema = z.object({
  
  nom: z
    .string({ required_error: 'Le prénom est requis.' })
    .min(1, { message: 'Le prénom ne peut pas être vide.' }),
  prenom: z
    .string({ required_error: 'Le nom est requis.' })
    .min(1, { message: 'Le nom ne peut pas être vide.' }),
  telephone: z
    .string({ required_error: 'Le numéro de téléphone est requis.' })
    .min(1, { message: 'Le numéro de téléphone ne peut pas être vide.' }),
    password: z
    .string({ required_error: 'Le mot de passe est requis.' }),

    email: z.string().email({ message: "L'adresse e-mail doit être valide." }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(1, 'Mot de passe requis'),
})


export const formulaireFhnSchema = z.object({
  estPH: z.boolean().default(false),
  repondPourPH: z.boolean().default(false),
  lienFiliation: z.string(),
  autreLienFiliation: z.string(),

  // Informations de la personne handicapée
  sexe: z.string(),
  trancheAge: z.string(),
  ageSpecifique: z.string(),
  ville: z.string(),
  quartier: z.string(),

  // Type de handicap
  typeHandicap: z.object({
    sensoriel: z.object({
      type: z.boolean().default(false),
      sousType: z.string()
    }),
    physique: z.object({
      type: z.boolean().default(false),
      sousType: z.string()
    }),
    mental: z.object({
      type: z.boolean().default(false),
      sousType: z.string()
    }),
    psychique: z.object({
      type: z.boolean().default(false),
      sousType: z.string()
    }),
  })
});


  export const wisiSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  dateNaissance: z.string(),
  lieuNaissance: z.string(),
  adresse: z.string(),
  telephone: z.string(),
  email: z.string().email(),
  typeHandicap: z.string(),
  niveauEtude: z.string(),
  situationFamiliale: z.string(),
  nombreEnfants: z.string(), // ou z.number().transform(String)
  profession: z.string(),
  revenuMensuel: z.string(), // idem
  besoins: z.string(),
  dossierId: z.string()
});


export type wisiInput = z.infer<typeof wisiSchema>;
export type fhnInput = z.infer<typeof formulaireFhnSchema>;
export type connecionInput = z.infer<typeof loginSchema>;
export type subscribeInput = z.infer<typeof fullSchema>;

export type StepProps = {
  methods: UseFormReturn<subscribeInput>;
};
