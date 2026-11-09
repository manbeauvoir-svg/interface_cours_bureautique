/*
  LA LISTE DU SITE : c'est le seul fichier à modifier pour ajouter une activité.

  Pour ajouter un jeu ou un exercice :
    1. Déposez votre fichier .html dans le dossier « activites ».
    2. Copiez le modèle ci-dessous et collez-le dans la liste ACTIVITES, à l'endroit voulu.
    3. Remplissez-le, puis enregistrez.

    {
      titre: "Le nom affiché",
      description: "Une phrase qui dit ce qu'on y fait.",
      icone: "🎯",                        // un emoji (touche Windows + point pour les choisir)
      rubrique: "jeux",                   // cours, exercices, jeux ou evaluations
      theme: "Word",                      // un mot, utilisé aussi par la recherche
      groupe: "Les jeux",                 // facultatif : le sous-titre dans la rubrique
      fichier: "nom-du-fichier.html"      // sans espace ni accent
    },

  Attention : gardez les guillemets et la virgule après l'accolade fermante.
*/

// Durée de conservation : les données d'un poste sont effacées après ce nombre de mois sans utilisation.
const CONSERVATION_MOIS = 12;

// horsParcours : la rubrique n'est ni comptée dans la progression, ni tirée par le dé.
const RUBRIQUES = [
  { id: "cours",       titre: "Cours",        icone: "📚", couleur: "#0b7285", intro: "Pour découvrir et revoir les notions.", groupes: {
    "L'ordinateur et Windows": { icone: "🖥️", intro: "Le matériel, le clavier, la souris, Windows et les fichiers." },
    "Word, Excel et PowerPoint": { icone: "📊", intro: "Les logiciels, leurs rubans et ce qu'ils ont en commun." },
    "Internet, sécurité et mémo": { icone: "🌐", intro: "Communiquer en ligne, les bons réflexes, raccourcis et lexique." }
  } },
  { id: "exercices",   titre: "Exercices",    icone: "🛠️", couleur: "#b45309", intro: "Pour s'entraîner et mettre en pratique." },
  { id: "jeux",        titre: "Jeux et quiz", icone: "🎮", couleur: "#a21caf", intro: "Le positionnement, les quiz des modules et les jeux.", groupes: {
    "Par où commencer": { icone: "🧭", intro: "Le quiz de positionnement, pour connaître vos priorités." },
    "Les quiz des modules": { icone: "📝", intro: "Positionnement, quiz par thème et quiz final de chaque module." },
    "Les autres quiz": { icone: "❓", intro: "La police, les raccourcis, Windows 11 et le retour de vacances." },
    "Les jeux": { icone: "🎲", intro: "Chasse aux fautes, mots croisés, pendu, devinettes…" }
  } },
  { id: "evaluations", titre: "Évaluations",  icone: "📝", couleur: "#4338ca", intro: "À faire à la demande du formateur.", horsParcours: true }
];

const ACTIVITES = [
  // ---------- COURS ----------
  {
    titre: "L'ordinateur",
    description: "Module 1 : le matériel, les périphériques et l'imprimante.",
    icone: "🖥️",
    rubrique: "cours",
    groupe: "L'ordinateur et Windows",
    theme: "Matériel",
    fichier: "livret-ordinateur.html"
  },
  {
    titre: "Le clavier AZERTY",
    description: "Guide interactif pour se repérer sur le clavier.",
    icone: "⌨️",
    rubrique: "cours",
    groupe: "L'ordinateur et Windows",
    theme: "Matériel",
    fichier: "clavier-azerty.html"
  },
  {
    titre: "La souris et le pavé tactile",
    description: "Guide interactif pour bien utiliser la souris et le pavé tactile.",
    icone: "🖱️",
    rubrique: "cours",
    groupe: "L'ordinateur et Windows",
    theme: "Matériel",
    fichier: "souris-pave-tactile.html"
  },
  {
    titre: "Windows 11",
    description: "Module 2 : le bureau, le double écran et les fenêtres.",
    icone: "🪟",
    rubrique: "cours",
    groupe: "L'ordinateur et Windows",
    theme: "Windows",
    fichier: "livret-windows.html"
  },
  {
    titre: "Les fichiers et dossiers",
    description: "Module 3 : icônes, extensions, Explorateur, arborescence et nommage.",
    icone: "📁",
    rubrique: "cours",
    groupe: "L'ordinateur et Windows",
    theme: "Fichiers",
    fichier: "livret-fichiers.html"
  },
  {
    titre: "Les fonctions communes d'Office",
    description: "Module 4 : modèles, en-têtes et pieds de page, numérotation.",
    icone: "🧰",
    rubrique: "cours",
    groupe: "Word, Excel et PowerPoint",
    theme: "Office",
    fichier: "livret-office-commun.html"
  },
  {
    titre: "Le ruban de Word",
    description: "Découvrir les onglets et les commandes de Word.",
    icone: "📄",
    rubrique: "cours",
    groupe: "Word, Excel et PowerPoint",
    theme: "Word",
    fichier: "ruban-word.html"
  },
  {
    titre: "Microsoft Word",
    description: "Module 5 : styles, table des matières, tableaux et publipostage.",
    icone: "📄",
    rubrique: "cours",
    groupe: "Word, Excel et PowerPoint",
    theme: "Word",
    fichier: "livret-word.html"
  },
  {
    titre: "Le ruban d'Excel",
    description: "Découvrir les onglets et les commandes d'Excel.",
    icone: "📊",
    rubrique: "cours",
    groupe: "Word, Excel et PowerPoint",
    theme: "Excel",
    fichier: "ruban-excel.html"
  },
  {
    titre: "Microsoft Excel",
    description: "Module 6 : formules, tri, graphiques et tableaux croisés dynamiques.",
    icone: "📊",
    rubrique: "cours",
    groupe: "Word, Excel et PowerPoint",
    theme: "Excel",
    fichier: "livret-excel.html"
  },
  {
    titre: "Le ruban de PowerPoint",
    description: "Découvrir les onglets et les commandes de PowerPoint.",
    icone: "🎞️",
    rubrique: "cours",
    groupe: "Word, Excel et PowerPoint",
    theme: "PowerPoint",
    fichier: "ruban-powerpoint.html"
  },
  {
    titre: "Microsoft PowerPoint",
    description: "Module 7 : thèmes, masque, multimédia et mode Présentateur.",
    icone: "🎞️",
    rubrique: "cours",
    groupe: "Word, Excel et PowerPoint",
    theme: "PowerPoint",
    fichier: "livret-powerpoint.html"
  },
  {
    titre: "Internet et communication",
    description: "Module 8 : la messagerie, OneDrive, Teams et SharePoint.",
    icone: "🌐",
    rubrique: "cours",
    groupe: "Internet, sécurité et mémo",
    theme: "Internet",
    fichier: "livret-internet.html"
  },
  {
    titre: "Les bonnes pratiques",
    description: "Module 9 : sécurité, désinformation, nétiquette et écologie.",
    icone: "🛡️",
    rubrique: "cours",
    groupe: "Internet, sécurité et mémo",
    theme: "Sécurité",
    fichier: "livret-bonnes-pratiques.html"
  },
  {
    titre: "Le mémo",
    description: "Tous les raccourcis clavier et le lexique du numérique.",
    icone: "📌",
    rubrique: "cours",
    groupe: "Internet, sécurité et mémo",
    theme: "Lexique",
    fichier: "livret-memo.html"
  },

  // ---------- EXERCICES ----------
  {
    titre: "Les exercices Word",
    description: "Tous les exercices à ouvrir dans Word, avec leurs corrigés.",
    icone: "📝",
    rubrique: "exercices",
    theme: "Word",
    fichier: "exercices-word.html"
  },
  {
    titre: "Fichiers, Excel et PowerPoint",
    description: "Les grands exercices de classement, Excel, PowerPoint et Internet.",
    icone: "🗂️",
    rubrique: "exercices",
    theme: "Fichiers",
    fichier: "exercices-fichiers-excel-powerpoint.html"
  },
  {
    titre: "L'Explorateur de fichiers",
    description: "Activité pratique pour maîtriser l'Explorateur.",
    icone: "📁",
    rubrique: "exercices",
    theme: "Windows",
    fichier: "explorateur-fichiers.html"
  },
  {
    titre: "Icônes, noms et extensions",
    description: "Reconnaître les fichiers à leur icône et à leur extension.",
    icone: "🔍",
    rubrique: "exercices",
    theme: "Fichiers",
    fichier: "icones-extensions.html"
  },
  {
    titre: "Mission Équipement",
    description: "Classer le matériel : indispensable, confort ou optionnel.",
    icone: "🛒",
    rubrique: "exercices",
    theme: "Matériel",
    fichier: "mission-equipement.html"
  },

  {
    titre: "Dictées",
    description: "Écouter, écrire, corriger : trois textes sur la bureautique.",
    icone: "🎧",
    rubrique: "exercices",
    theme: "Français",
    fichier: "dictees.html"
  },

  // ---------- JEUX ET QUIZ ----------
  {titre: "Le quiz de positionnement",description: "Cinq questions par module pour savoir quoi travailler en priorité.",icone: "🧭",rubrique: "jeux",groupe: "Par où commencer",theme: "Positionnement",fichier: "quiz-positionnement.html"},
  {titre: "Quiz : L'ordinateur",description: "Quiz de positionnement, quiz par thème et quiz final, 10 questions au moins.",icone: "🖥️",rubrique: "jeux",groupe: "Les quiz des modules",theme: "Matériel",fichier: "quiz-ordinateur.html"},
  {titre: "Quiz : Windows 11",description: "Quiz de positionnement, quiz par thème et quiz final, 10 questions au moins.",icone: "🪟",rubrique: "jeux",groupe: "Les quiz des modules",theme: "Windows",fichier: "quiz-windows.html"},
  {titre: "Quiz : Les fichiers et dossiers",description: "Quiz de positionnement, quiz par thème et quiz final, 10 questions au moins.",icone: "📁",rubrique: "jeux",groupe: "Les quiz des modules",theme: "Fichiers",fichier: "quiz-fichiers.html"},
  {titre: "Quiz : Les fonctions communes d'Office",description: "Quiz de positionnement, quiz par thème et quiz final, 10 questions au moins.",icone: "🧰",rubrique: "jeux",groupe: "Les quiz des modules",theme: "Office",fichier: "quiz-office-commun.html"},
  {titre: "Quiz : Microsoft Word",description: "Quiz de positionnement, quiz par thème et quiz final, 10 questions au moins.",icone: "📄",rubrique: "jeux",groupe: "Les quiz des modules",theme: "Word",fichier: "quiz-word.html"},
  {titre: "Quiz : Microsoft Excel",description: "Quiz de positionnement, quiz par thème et quiz final, 10 questions au moins.",icone: "📊",rubrique: "jeux",groupe: "Les quiz des modules",theme: "Excel",fichier: "quiz-excel.html"},
  {titre: "Quiz : Microsoft PowerPoint",description: "Quiz de positionnement, quiz par thème et quiz final, 10 questions au moins.",icone: "🎞️",rubrique: "jeux",groupe: "Les quiz des modules",theme: "PowerPoint",fichier: "quiz-powerpoint.html"},
  {titre: "Quiz : Internet et communication",description: "Quiz de positionnement, quiz par thème et quiz final, 10 questions au moins.",icone: "🌐",rubrique: "jeux",groupe: "Les quiz des modules",theme: "Internet",fichier: "quiz-internet.html"},
  {titre: "Quiz : Les bonnes pratiques",description: "Quiz de positionnement, quiz par thème et quiz final, 10 questions au moins.",icone: "🛡️",rubrique: "jeux",groupe: "Les quiz des modules",theme: "Sécurité",fichier: "quiz-bonnes-pratiques.html"},
  {titre: "Le quiz de la police",description: "Quinze questions sur le groupe Police de Word.",icone: "🔤",rubrique: "jeux",theme: "Word",fichier: "jeu-police.html",groupe: "Les autres quiz"},
  {titre: "Quiz des raccourcis",description: "Dix questions au hasard sur Windows, les fichiers et Office.",icone: "⌨️",rubrique: "jeux",theme: "Raccourcis",fichier: "quiz-raccourcis.html",groupe: "Les autres quiz"},
  {titre: "L'environnement Windows 11",description: "Un quiz pour vérifier ses repères dans Windows 11.",icone: "🪟",rubrique: "jeux",theme: "Windows",fichier: "quiz-windows-11.html",groupe: "Les autres quiz"},
  {titre: "Quiz du retour de vacances",description: "Se remettre dans le bain après une pause.",icone: "🏖️",rubrique: "jeux",theme: "Révisions",fichier: "quiz-retour-vacances.html",groupe: "Les autres quiz"},
  {titre: "La chasse aux fautes",description: "Cliquer sur chaque mot mal écrit, dans trois textes.",icone: "🔎",rubrique: "jeux",theme: "Français",fichier: "jeu-chasse-fautes.html",groupe: "Les jeux"},
  {titre: "Quel onglet ?",description: "Retrouver l'onglet de chaque commande dans Word, Excel et PowerPoint.",icone: "🎀",rubrique: "jeux",theme: "Ruban",fichier: "jeu-quel-onglet.html",groupe: "Les jeux"},
  {titre: "Mots croisés",description: "Cinq grilles pour réviser le vocabulaire de la bureautique.",icone: "🧩",rubrique: "jeux",theme: "Vocabulaire",fichier: "mots-croises.html",groupe: "Les jeux"},
  {titre: "Le pendu",description: "Retrouver les mots du matériel et de l'environnement Windows.",icone: "🔤",rubrique: "jeux",theme: "Vocabulaire",fichier: "pendu.html",groupe: "Les jeux"},
  {titre: "Devinettes",description: "Culture bureautique, Internet, intelligence artificielle, informatique et web.",icone: "🕵️",rubrique: "jeux",theme: "Culture numérique",fichier: "devinettes.html",groupe: "Les jeux"},

  // ---------- ÉVALUATIONS ----------
  {
    titre: "Évaluation : fichiers et matériel",
    description: "Le bureau, l'Explorateur, le matériel, les fichiers et dossiers.",
    icone: "🗂️",
    rubrique: "evaluations",
    theme: "Bureautique",
    fichier: "evaluation-fichiers-materiel.html"
  },
  {
    titre: "Test niveau 1",
    description: "Mes premiers pas en bureautique.",
    icone: "🌱",
    rubrique: "evaluations",
    theme: "Bureautique",
    fichier: "test-niveau-1.html"
  },
  {
    titre: "Test niveau 2",
    description: "Les outils du quotidien en formation.",
    icone: "🌿",
    rubrique: "evaluations",
    theme: "Bureautique",
    fichier: "test-niveau-2.html"
  }
];
