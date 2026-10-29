/* =====================================================================
   CONFIGURATION DU SITE — c'est le SEUL fichier à modifier au quotidien.
   Tout est en clair : changez simplement le texte entre les guillemets.
   Les lignes marquées « À CONFIRMER » attendent une information.
   ===================================================================== */

window.CAMP = {

  /* ---------- L'organisation ---------- */
  organisation:      "Jeunesse Et Vie",
  organisationCourt: "JEV",

  /* ---------- La retraite ---------- */
  titre:      "Retraite JEV",
  edition:    "Édition 2026",

  /* ---------- Les dates ----------
     dateISO = début de la retraite, au format "AAAA-MM-JJTHH:MM:SS".
     Sert au compte à rebours.                                          */
  dateISO:    "2026-11-28T09:00:00",
  dateTexte:  "Les 28 et 29 novembre 2026",
  dateCourte: "28 – 29 nov. 2026",

  /* ---------- Le thème ---------- */
  theme: {
    citation:  "Venez à l'écart dans un lieu désert, et reposez-vous un peu",   /* À CONFIRMER */
    reference: "Marc 6:31",
    paragraphes: [
      "Deux jours pour sortir du rythme habituel, se retrouver entre jeunes et se laisser renouveler. Louange, enseignements, temps de partage et de prière.",
      "Ce questionnaire nous aide à préparer l'accueil, les repas et l'hébergement, mais aussi à construire un programme qui réponde à tes attentes."
    ]
  },

  /* ---------- Le lieu ---------- */
  lieu: {
    nom:     "Marseille",                 /* À CONFIRMER : nom du lieu */
    ville:   "Marseille",
    adresse: "",                          /* À CONFIRMER : adresse exacte */
    carte:   ""                           /* lien Google Maps, ou "" pour masquer */
  },

  /* ---------- La participation financière ---------- */
  cotisation: {
    montant: "À confirmer",               /* À CONFIRMER : ex. "30 €" */
    detail:  "Repas et activités de la retraite compris.",
    /* Moyens de paiement. Laissez "" pour masquer une ligne.           */
    virement:  "",                        /* ex. "FR76 …" */
    lydia:     "",                        /* ex. "06 12 34 56 78" */
    titulaire: "",                        /* ex. "Jean Dupont (trésorier)" */
    note: "Le règlement peut se faire avant la retraite ou à l'arrivée. Personne ne sera empêché de venir pour une question d'argent : parles-en aux responsables."
  },

  /* ---------- Contact ---------- */
  infoline:      "",                      /* À CONFIRMER : ex. "06 12 34 56 78" */
  infolineLien:  "",                      /* format international sans espaces : "+33612345678" */
  emailContact:  "",

  /* ---------- Le programme ----------
     Vous pouvez ajouter ou supprimer des blocs librement.              */
  programme: [
    {
      icone: "🙌",
      jour:  "Samedi 28 novembre",
      titre: "Accueil, louange et enseignements",
      detail: "Arrivée, installation, culte d'ouverture, enseignements et ateliers. Veillée le soir. Horaires à confirmer."
    },
    {
      icone: "📖",
      jour:  "Dimanche 29 novembre",
      titre: "Culte et envoi",
      detail: "Temps de prière, culte, partage des témoignages et clôture. Horaires à confirmer."
    }
  ],

  /* ---------- Date limite d'inscription ---------- */
  dateLimite: "Merci de répondre avant le 20 novembre 2026.",

  /* =====================================================================
     SUPABASE — où sont enregistrées les réponses.
     Projet wmcbxjguihpupvirkkna, table inscriptions_jev.
     Tant que ces deux lignes sont vides, le site tourne en MODE DÉMO.
     ===================================================================== */
  supabaseUrl:     "https://wmcbxjguihpupvirkkna.supabase.co",
  supabaseAnonKey: "sb_publishable_RlnCHPGjc4Wd7UyEkINFzQ_BlyqqzWw"
};
