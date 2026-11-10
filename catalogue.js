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

// Le code que le stagiaire tape en arrivant : EV, le dispositif, puis 3 chiffres (EV-MAN-001, EV-OPTIM-001, EV-SAMA-001…).
// Pour un autre format, changez le motif et l'exemple.
const CODE_STAGIAIRE = { motif: /^EV-[A-Z]+-\d{3}$/, exemple: "EV-MAN-001" };

// horsParcours : la rubrique n'est ni comptée dans la progression, ni tirée par le dé.
const RUBRIQUES = [
  { id: "cours",       titre: "Cours",        icone: "📚", couleur: "#0b7285", intro: "Pour découvrir et revoir les notions.", groupes: {
    "L'ordinateur et Windows": { icone: "🖥️", intro: "Le matériel, le clavier, la souris, Windows et les fichiers." },
    "Word, Excel et PowerPoint": { icone: "📊", intro: "Les logiciels, leurs rubans et ce qu'ils ont en commun." },
    "Internet, sécurité et mémo": { icone: "🌐", intro: "Communiquer en ligne, les bons réflexes, raccourcis et lexique." }
  } },
  { id: "exercices",   titre: "Exercices",    icone: "🛠️", couleur: "#b45309", intro: "Pour s'entraîner et mettre en pratique.", groupes: {
    "Dans les logiciels": { icone: "💻", intro: "Word, Excel, PowerPoint, fichiers et mails : sur votre ordinateur, avec les fichiers et les corrigés." },
    "Les diagrammes à compléter": { icone: "🏷️", intro: "Retrouver les zones du Bureau, de l'Explorateur, de Word, d'Excel, de PowerPoint et d'une page web." },
    "Les activités interactives": { icone: "🧩", intro: "Explorateur, icônes et extensions, équipement, dictées." }
  } },
  { id: "jeux",        titre: "Jeux et quiz", icone: "🎮", couleur: "#a21caf", intro: "Le positionnement, les quiz des modules et les jeux.", groupes: {
    "Par où commencer": { icone: "🧭", intro: "Le quiz de positionnement, pour connaître vos priorités." },
    "Les quiz des modules": { icone: "📝", intro: "Positionnement, quiz par thème et quiz final de chaque module." },
    "Les autres quiz": { icone: "❓", intro: "La police, les raccourcis, Windows 11 et le retour de vacances." },
    "Quiz express": { icone: "⚡", intro: "10 questions au hasard sur chaque module, différentes à chaque partie." },
    "Vrai ou faux": { icone: "✅", intro: "Des affirmations à juger, avec l'explication." },
    "Trouve l'intrus": { icone: "🕵️", intro: "Quatre propositions, un intrus, sur chaque module." },
    "Mots mêlés": { icone: "🔠", intro: "Le vocabulaire de chaque module caché dans une grille." },
    "Les jeux": { icone: "🎲", intro: "Excel, PowerPoint, extensions, icônes, memory, chasse aux fautes, pendu…" }
  } },
  { id: "evaluations", titre: "Évaluations",  icone: "📝", couleur: "#4338ca", intro: "À faire à la demande du formateur.", horsParcours: true, groupes: {
    "L'évaluation générale": { icone: "🎓", intro: "Toutes les thématiques en une seule évaluation." },
    "Les évaluations par thème": { icone: "📋", intro: "Une évaluation de 20 questions pour chaque module." },
    "Les tests": { icone: "🧪", intro: "Les tests de niveau et l'évaluation fichiers et matériel." }
  } }
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
    description: "Guide interactif pour se repérer sur le clavier et bien placer ses doigts, avec l'exercice « Quel doigt ? ».",
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
    fichier: "exercices-word.html",
    groupe: "Dans les logiciels"
  },
  {titre: "Fichiers et Windows",description: "Ranger, renommer et trier ses fichiers, capture d'écran : à faire sur l'ordinateur.",icone: "📁",rubrique: "exercices",theme: "Fichiers",fichier: "exercices-fichiers-windows.html",groupe: "Dans les logiciels"},
  {titre: "Exercices Excel",description: "Courses, semaine de travail, dépenses en graphique, facture, ventes, commandes : avec les fichiers et les corrigés.",icone: "📊",rubrique: "exercices",theme: "Excel",fichier: "exercices-excel.html",groupe: "Dans les logiciels"},
  {titre: "Exercices PowerPoint",description: "Se présenter, une affiche, un SmartArt et un tableau, animer une présentation.",icone: "🎞️",rubrique: "exercices",theme: "PowerPoint",fichier: "exercices-powerpoint.html",groupe: "Dans les logiciels"},
  {titre: "Internet et mails",description: "Chercher sur Internet, corriger et rédiger des mails.",icone: "🌐",rubrique: "exercices",theme: "Internet",fichier: "exercices-internet.html",groupe: "Dans les logiciels"},
  {titre: "Diagramme : Le Bureau de Windows 11",description: "Barre des tâches, bouton Démarrer, zone de notification…",icone: "🪟",rubrique: "exercices",theme: "Interface",fichier: "diagramme-bureau.html",groupe: "Les diagrammes à compléter"},
  {titre: "Diagramme : L'Explorateur de fichiers",description: "Barre d'adresse, volet de navigation, zone d'affichage…",icone: "📁",rubrique: "exercices",theme: "Interface",fichier: "diagramme-explorateur.html",groupe: "Les diagrammes à compléter"},
  {titre: "Diagramme : La fenêtre de Word",description: "Ruban, règle, zone de saisie, barre d'état…",icone: "📄",rubrique: "exercices",theme: "Interface",fichier: "diagramme-word.html",groupe: "Les diagrammes à compléter"},
  {titre: "Diagramme : La fenêtre d'Excel",description: "Zone Nom, barre de formule, cellule active, onglets des feuilles…",icone: "📊",rubrique: "exercices",theme: "Interface",fichier: "diagramme-excel.html",groupe: "Les diagrammes à compléter"},
  {titre: "Diagramme : La fenêtre de PowerPoint",description: "Volet des miniatures, zone des notes, bouton Diaporama…",icone: "🎞️",rubrique: "exercices",theme: "Interface",fichier: "diagramme-powerpoint.html",groupe: "Les diagrammes à compléter"},
  {titre: "Diagramme : Une page web",description: "Barre d'adresse, cadenas, favoris, lien, barre de défilement…",icone: "🌐",rubrique: "exercices",theme: "Interface",fichier: "diagramme-web.html",groupe: "Les diagrammes à compléter"},
  {
    titre: "L'Explorateur de fichiers",
    description: "Activité pratique pour maîtriser l'Explorateur.",
    icone: "📁",
    rubrique: "exercices",
    theme: "Windows",
    fichier: "explorateur-fichiers.html",
    groupe: "Les activités interactives"
  },
  {
    titre: "Icônes, noms et extensions",
    description: "Reconnaître les fichiers à leur icône et à leur extension.",
    icone: "🔍",
    rubrique: "exercices",
    theme: "Fichiers",
    fichier: "icones-extensions.html",
    groupe: "Les activités interactives"
  },
  {
    titre: "Mission Équipement",
    description: "Classer le matériel : indispensable, confort ou optionnel.",
    icone: "🛒",
    rubrique: "exercices",
    theme: "Matériel",
    fichier: "mission-equipement.html",
    groupe: "Les activités interactives"
  },

  {
    titre: "Dictées",
    description: "Écouter, écrire, corriger : quinze textes de la vie courante et du travail, du plus facile au plus difficile.",
    icone: "🎧",
    rubrique: "exercices",
    theme: "Français",
    fichier: "dictees.html",
    groupe: "Les activités interactives"
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
  {titre: "Le jeu des extensions",description: "Quel logiciel ouvre ce fichier ? Ranger, relier et déjouer les pièges des extensions.",icone: "🔖",rubrique: "jeux",theme: "Fichiers",fichier: "jeu-extensions.html",groupe: "Les jeux"},
  {titre: "Le jeu des icônes",description: "Reconnaître les icônes de Windows et d'Office, et savoir laquelle ouvrir.",icone: "🧩",rubrique: "jeux",theme: "Fichiers",fichier: "jeu-icones.html",groupe: "Les jeux"},
  {titre: "Le memory des fichiers",description: "Retrouver les paires extension et icône, en un minimum de coups.",icone: "🃏",rubrique: "jeux",theme: "Fichiers",fichier: "jeu-memory-fichiers.html",groupe: "Les jeux"},
  {titre: "Le jeu d'Excel",description: "Deviner le résultat d'une formule, le $ qui bloque, repérer les formules fausses.",icone: "📊",rubrique: "jeux",theme: "Excel",fichier: "jeu-excel.html",groupe: "Les jeux"},
  {titre: "Le jeu de PowerPoint",description: "Transition ou animation, touches du diaporama, le bon onglet.",icone: "🎞️",rubrique: "jeux",theme: "PowerPoint",fichier: "jeu-powerpoint.html",groupe: "Les jeux"},
  {titre: "Quiz express : L'ordinateur",description: "10 questions au hasard, différentes à chaque partie.",icone: "🖥️",rubrique: "jeux",theme: "L'ordinateur",fichier: "express-ordinateur.html",groupe: "Quiz express"},
  {titre: "Quiz express : Windows 11",description: "10 questions au hasard, différentes à chaque partie.",icone: "🪟",rubrique: "jeux",theme: "Windows 11",fichier: "express-windows.html",groupe: "Quiz express"},
  {titre: "Quiz express : Les fichiers et dossiers",description: "10 questions au hasard, différentes à chaque partie.",icone: "📁",rubrique: "jeux",theme: "Les fichiers et dossiers",fichier: "express-fichiers.html",groupe: "Quiz express"},
  {titre: "Quiz express : Les fonctions communes d'Office",description: "10 questions au hasard, différentes à chaque partie.",icone: "🧰",rubrique: "jeux",theme: "Les fonctions communes d'Office",fichier: "express-office-commun.html",groupe: "Quiz express"},
  {titre: "Quiz express : Microsoft Word",description: "10 questions au hasard, différentes à chaque partie.",icone: "📄",rubrique: "jeux",theme: "Microsoft Word",fichier: "express-word.html",groupe: "Quiz express"},
  {titre: "Quiz express : Microsoft Excel",description: "10 questions au hasard, différentes à chaque partie.",icone: "📊",rubrique: "jeux",theme: "Microsoft Excel",fichier: "express-excel.html",groupe: "Quiz express"},
  {titre: "Quiz express : Microsoft PowerPoint",description: "10 questions au hasard, différentes à chaque partie.",icone: "🎞️",rubrique: "jeux",theme: "Microsoft PowerPoint",fichier: "express-powerpoint.html",groupe: "Quiz express"},
  {titre: "Quiz express : Internet et communication",description: "10 questions au hasard, différentes à chaque partie.",icone: "🌐",rubrique: "jeux",theme: "Internet et communication",fichier: "express-internet.html",groupe: "Quiz express"},
  {titre: "Quiz express : Les bonnes pratiques",description: "10 questions au hasard, différentes à chaque partie.",icone: "🛡️",rubrique: "jeux",theme: "Les bonnes pratiques",fichier: "express-bonnes-pratiques.html",groupe: "Quiz express"},
  {titre: "Vrai ou faux : L'ordinateur",description: "10 affirmations : vraies ou fausses ?",icone: "🖥️",rubrique: "jeux",theme: "L'ordinateur",fichier: "vrai-faux-ordinateur.html",groupe: "Vrai ou faux"},
  {titre: "Vrai ou faux : Windows 11",description: "10 affirmations : vraies ou fausses ?",icone: "🪟",rubrique: "jeux",theme: "Windows 11",fichier: "vrai-faux-windows.html",groupe: "Vrai ou faux"},
  {titre: "Vrai ou faux : Les fichiers et dossiers",description: "10 affirmations : vraies ou fausses ?",icone: "📁",rubrique: "jeux",theme: "Les fichiers et dossiers",fichier: "vrai-faux-fichiers.html",groupe: "Vrai ou faux"},
  {titre: "Vrai ou faux : Les fonctions communes d'Office",description: "10 affirmations : vraies ou fausses ?",icone: "🧰",rubrique: "jeux",theme: "Les fonctions communes d'Office",fichier: "vrai-faux-office-commun.html",groupe: "Vrai ou faux"},
  {titre: "Vrai ou faux : Microsoft Word",description: "10 affirmations : vraies ou fausses ?",icone: "📄",rubrique: "jeux",theme: "Microsoft Word",fichier: "vrai-faux-word.html",groupe: "Vrai ou faux"},
  {titre: "Vrai ou faux : Microsoft Excel",description: "10 affirmations : vraies ou fausses ?",icone: "📊",rubrique: "jeux",theme: "Microsoft Excel",fichier: "vrai-faux-excel.html",groupe: "Vrai ou faux"},
  {titre: "Vrai ou faux : Microsoft PowerPoint",description: "10 affirmations : vraies ou fausses ?",icone: "🎞️",rubrique: "jeux",theme: "Microsoft PowerPoint",fichier: "vrai-faux-powerpoint.html",groupe: "Vrai ou faux"},
  {titre: "Vrai ou faux : Internet et communication",description: "10 affirmations : vraies ou fausses ?",icone: "🌐",rubrique: "jeux",theme: "Internet et communication",fichier: "vrai-faux-internet.html",groupe: "Vrai ou faux"},
  {titre: "Vrai ou faux : Les bonnes pratiques",description: "10 affirmations : vraies ou fausses ?",icone: "🛡️",rubrique: "jeux",theme: "Les bonnes pratiques",fichier: "vrai-faux-bonnes-pratiques.html",groupe: "Vrai ou faux"},
  {titre: "Trouve l'intrus : L'ordinateur",description: "Huit séries de quatre : une seule n'a rien à faire là.",icone: "🖥️",rubrique: "jeux",theme: "L'ordinateur",fichier: "intrus-ordinateur.html",groupe: "Trouve l'intrus"},
  {titre: "Trouve l'intrus : Windows 11",description: "Huit séries de quatre : une seule n'a rien à faire là.",icone: "🪟",rubrique: "jeux",theme: "Windows 11",fichier: "intrus-windows.html",groupe: "Trouve l'intrus"},
  {titre: "Trouve l'intrus : Les fichiers et dossiers",description: "Huit séries de quatre : une seule n'a rien à faire là.",icone: "📁",rubrique: "jeux",theme: "Les fichiers et dossiers",fichier: "intrus-fichiers.html",groupe: "Trouve l'intrus"},
  {titre: "Trouve l'intrus : Les fonctions communes d'Office",description: "Huit séries de quatre : une seule n'a rien à faire là.",icone: "🧰",rubrique: "jeux",theme: "Les fonctions communes d'Office",fichier: "intrus-office-commun.html",groupe: "Trouve l'intrus"},
  {titre: "Trouve l'intrus : Microsoft Word",description: "Huit séries de quatre : une seule n'a rien à faire là.",icone: "📄",rubrique: "jeux",theme: "Microsoft Word",fichier: "intrus-word.html",groupe: "Trouve l'intrus"},
  {titre: "Trouve l'intrus : Microsoft Excel",description: "Huit séries de quatre : une seule n'a rien à faire là.",icone: "📊",rubrique: "jeux",theme: "Microsoft Excel",fichier: "intrus-excel.html",groupe: "Trouve l'intrus"},
  {titre: "Trouve l'intrus : Microsoft PowerPoint",description: "Huit séries de quatre : une seule n'a rien à faire là.",icone: "🎞️",rubrique: "jeux",theme: "Microsoft PowerPoint",fichier: "intrus-powerpoint.html",groupe: "Trouve l'intrus"},
  {titre: "Trouve l'intrus : Internet et communication",description: "Huit séries de quatre : une seule n'a rien à faire là.",icone: "🌐",rubrique: "jeux",theme: "Internet et communication",fichier: "intrus-internet.html",groupe: "Trouve l'intrus"},
  {titre: "Trouve l'intrus : Les bonnes pratiques",description: "Huit séries de quatre : une seule n'a rien à faire là.",icone: "🛡️",rubrique: "jeux",theme: "Les bonnes pratiques",fichier: "intrus-bonnes-pratiques.html",groupe: "Trouve l'intrus"},
  {titre: "Mots mêlés : L'ordinateur",description: "Dix mots du vocabulaire à retrouver dans la grille.",icone: "🖥️",rubrique: "jeux",theme: "L'ordinateur",fichier: "mots-meles-ordinateur.html",groupe: "Mots mêlés"},
  {titre: "Mots mêlés : Windows 11",description: "Dix mots du vocabulaire à retrouver dans la grille.",icone: "🪟",rubrique: "jeux",theme: "Windows 11",fichier: "mots-meles-windows.html",groupe: "Mots mêlés"},
  {titre: "Mots mêlés : Les fichiers et dossiers",description: "Dix mots du vocabulaire à retrouver dans la grille.",icone: "📁",rubrique: "jeux",theme: "Les fichiers et dossiers",fichier: "mots-meles-fichiers.html",groupe: "Mots mêlés"},
  {titre: "Mots mêlés : Les fonctions communes d'Office",description: "Dix mots du vocabulaire à retrouver dans la grille.",icone: "🧰",rubrique: "jeux",theme: "Les fonctions communes d'Office",fichier: "mots-meles-office-commun.html",groupe: "Mots mêlés"},
  {titre: "Mots mêlés : Microsoft Word",description: "Dix mots du vocabulaire à retrouver dans la grille.",icone: "📄",rubrique: "jeux",theme: "Microsoft Word",fichier: "mots-meles-word.html",groupe: "Mots mêlés"},
  {titre: "Mots mêlés : Microsoft Excel",description: "Dix mots du vocabulaire à retrouver dans la grille.",icone: "📊",rubrique: "jeux",theme: "Microsoft Excel",fichier: "mots-meles-excel.html",groupe: "Mots mêlés"},
  {titre: "Mots mêlés : Microsoft PowerPoint",description: "Dix mots du vocabulaire à retrouver dans la grille.",icone: "🎞️",rubrique: "jeux",theme: "Microsoft PowerPoint",fichier: "mots-meles-powerpoint.html",groupe: "Mots mêlés"},
  {titre: "Mots mêlés : Internet et communication",description: "Dix mots du vocabulaire à retrouver dans la grille.",icone: "🌐",rubrique: "jeux",theme: "Internet et communication",fichier: "mots-meles-internet.html",groupe: "Mots mêlés"},
  {titre: "Mots mêlés : Les bonnes pratiques",description: "Dix mots du vocabulaire à retrouver dans la grille.",icone: "🛡️",rubrique: "jeux",theme: "Les bonnes pratiques",fichier: "mots-meles-bonnes-pratiques.html",groupe: "Mots mêlés"},
  {titre: "Mots croisés",description: "Cinq grilles pour réviser le vocabulaire de la bureautique.",icone: "🧩",rubrique: "jeux",theme: "Vocabulaire",fichier: "mots-croises.html",groupe: "Les jeux"},
  {titre: "Le pendu",description: "Retrouver les mots du matériel et de l'environnement Windows.",icone: "🔤",rubrique: "jeux",theme: "Vocabulaire",fichier: "pendu.html",groupe: "Les jeux"},
  {titre: "Devinettes",description: "Culture bureautique, Internet, intelligence artificielle, informatique et web.",icone: "🕵️",rubrique: "jeux",theme: "Culture numérique",fichier: "devinettes.html",groupe: "Les jeux"},

  // ---------- ÉVALUATIONS ----------
  {titre: "Évaluation : L'ordinateur",description: "20 questions, correction à la fin, réussie à 80 %.",icone: "🖥️",rubrique: "evaluations",theme: "L'ordinateur",fichier: "evaluation-ordinateur.html",groupe: "Les évaluations par thème"},
  {titre: "Évaluation : Windows 11",description: "20 questions, correction à la fin, réussie à 80 %.",icone: "🪟",rubrique: "evaluations",theme: "Windows 11",fichier: "evaluation-windows.html",groupe: "Les évaluations par thème"},
  {titre: "Évaluation : Les fichiers et dossiers",description: "20 questions, correction à la fin, réussie à 80 %.",icone: "📁",rubrique: "evaluations",theme: "Les fichiers et dossiers",fichier: "evaluation-fichiers.html",groupe: "Les évaluations par thème"},
  {titre: "Évaluation : Les fonctions communes d'Office",description: "20 questions, correction à la fin, réussie à 80 %.",icone: "🧰",rubrique: "evaluations",theme: "Les fonctions communes d'Office",fichier: "evaluation-office-commun.html",groupe: "Les évaluations par thème"},
  {titre: "Évaluation : Microsoft Word",description: "20 questions, correction à la fin, réussie à 80 %.",icone: "📄",rubrique: "evaluations",theme: "Microsoft Word",fichier: "evaluation-word.html",groupe: "Les évaluations par thème"},
  {titre: "Évaluation : Microsoft Excel",description: "20 questions, correction à la fin, réussie à 80 %.",icone: "📊",rubrique: "evaluations",theme: "Microsoft Excel",fichier: "evaluation-excel.html",groupe: "Les évaluations par thème"},
  {titre: "Évaluation : Microsoft PowerPoint",description: "20 questions, correction à la fin, réussie à 80 %.",icone: "🎞️",rubrique: "evaluations",theme: "Microsoft PowerPoint",fichier: "evaluation-powerpoint.html",groupe: "Les évaluations par thème"},
  {titre: "Évaluation : Internet et communication",description: "20 questions, correction à la fin, réussie à 80 %.",icone: "🌐",rubrique: "evaluations",theme: "Internet et communication",fichier: "evaluation-internet.html",groupe: "Les évaluations par thème"},
  {titre: "Évaluation : Les bonnes pratiques",description: "20 questions, correction à la fin, réussie à 80 %.",icone: "🛡️",rubrique: "evaluations",theme: "Les bonnes pratiques",fichier: "evaluation-bonnes-pratiques.html",groupe: "Les évaluations par thème"},
  {titre: "Évaluation générale",description: "36 questions sur toutes les thématiques, 4 par module, réussie à 80 %.",icone: "🎓",rubrique: "evaluations",theme: "Bureautique",fichier: "evaluation-generale.html",groupe: "L'évaluation générale"},
  {
    titre: "Évaluation : fichiers et matériel",
    description: "Le bureau, l'Explorateur, le matériel, les fichiers et dossiers.",
    icone: "🗂️",
    rubrique: "evaluations",
    theme: "Bureautique",
    fichier: "evaluation-fichiers-materiel.html",
    groupe: "Les tests"
  },
  {
    titre: "Test niveau 1",
    description: "Mes premiers pas en bureautique.",
    icone: "🌱",
    rubrique: "evaluations",
    theme: "Bureautique",
    fichier: "test-niveau-1.html",
    groupe: "Les tests"
  },
  {
    titre: "Test niveau 2",
    description: "Les outils du quotidien en formation.",
    icone: "🌿",
    rubrique: "evaluations",
    theme: "Bureautique",
    fichier: "test-niveau-2.html",
    groupe: "Les tests"
  }
];
