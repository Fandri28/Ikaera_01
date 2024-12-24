export interface Comment {
    idcomment: number;
    idproduit: number;
    iduser: number;
    commentaire: string;
    date: string;
    action: string;
  }
  
  export interface Etoile {
    id: number;
    idformation: number; // id de la formation
    rate: number;
    daterate: string;
    iduser: number;
  }
  
  export interface Formation {
    id: number;
    image: string;
    titre: string;
    description: string;
    lieu: string;
    frais: string;
  }
  
  export interface Utilisateur {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  }
  