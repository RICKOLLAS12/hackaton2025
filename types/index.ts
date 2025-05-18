// Types pour les modèles de données
export type Enfant = {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: Date;
  sexe: string;
  commune: string;
  parent: {
    nom: string;
    telephone: string;
    email: string;
  };
  statut_dossier: "Nouveau" | "En cours" | "Incomplet" | "Accepté" | "Rejeté" | "Clôturé";
  documents: Document[];
  observations: Commentaire[];
  diagnostic: string | null;
  date_creation: Date;
  utilisateur_createur: string;
};

export type Document = {
  id: string;
  nom: string;
  type: string;
  url: string;
  date_upload: Date;
  utilisateur_upload: string;
};

export type Commentaire = {
  id: string;
  texte: string;
  date_creation: Date;
  utilisateur: string;
  interne: boolean; // Si true, visible uniquement par le personnel interne
};

export type Utilisateur = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe_hash: string;
  role: "parent" | "secretaire" | "analyste" | "admin";
};