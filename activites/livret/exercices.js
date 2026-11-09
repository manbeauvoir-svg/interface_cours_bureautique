/*
  LES EXERCICES À FAIRE DANS LES VRAIS LOGICIELS.
  Chaque exercice s'utilise dans un cours avec { exo: "son-nom" }.
  Les fichiers sont rangés dans activites/fichiers.

  taches   : les étapes que le stagiaire coche
  fichier  : le document à ouvrir
  corrige  : le corrigé en PDF, débloqué quand tout est coché
  modele   : un modèle à reproduire, disponible dès le début
  consigne : la consigne en PDF, pour que le texte soit saisi et non collé (consigneGros : en gros caractères)
  pack     : un dossier compressé à télécharger
*/
const EXERCICES = {
  /* ---------- WORD : saisie ---------- */
  "saisie-berenice": {
    app: "word", niveau: 1, duree: "15 min", titre: "La princesse Bérénice",
    objectif: "Saisir un texte, puis corriger ses fautes avec le bouton droit de la souris.",
    consigne: "word/consignes/saisie-verifications.pdf", consigneGros: "word/consignes/saisie-verifications-gros.pdf", corrige: "word/corriges/princesse-berenice.pdf", suite: "saisie-electricite",
    taches: ["Saisissez le texte « La princesse Bérénice » de la consigne.", "Corrigez les fautes à l'aide du bouton droit de la souris.", "Relisez le texte.", "Enregistrez le fichier dans votre dossier avec un nom qui permet de l'identifier rapidement."]
  },
  "saisie-electricite": {
    app: "word", niveau: 1, duree: "15 min", titre: "L'électricité",
    objectif: "Le même entraînement, sur un texte un peu plus long.",
    consigne: "word/consignes/saisie-verifications.pdf", consigneGros: "word/consignes/saisie-verifications-gros.pdf", corrige: "word/corriges/electricite.pdf", suite: "saisie-large",
    taches: ["Saisissez le texte « L'électricité » de la consigne.", "Corrigez les fautes à l'aide du bouton droit de la souris.", "Relisez le texte.", "Enregistrez le fichier avec un nom clair."]
  },
  "saisie-large": {
    app: "word", niveau: 1, duree: "15 min", titre: "Direction le grand large",
    objectif: "Dernier entraînement à la saisie : visez la régularité, sans vous presser.",
    consigne: "word/consignes/saisie-verifications.pdf", consigneGros: "word/consignes/saisie-verifications-gros.pdf", corrige: "word/corriges/grand-large.pdf",
    taches: ["Saisissez le texte « Direction le grand large » de la consigne.", "Corrigez les fautes à l'aide du bouton droit de la souris.", "Relisez le texte.", "Enregistrez le fichier avec un nom clair."]
  },

  /* ---------- WORD : couper, copier, coller ---------- */
  "ccc-jours": {
    app: "word", niveau: 1, duree: "15 min", titre: "Les jours de la semaine",
    objectif: "Remettre un texte dans l'ordre en déplaçant des paragraphes.",
    fichier: "word/jours-de-la-semaine.docx", consigne: "word/consignes/couper-copier-coller.pdf", consigneGros: "word/consignes/couper-copier-coller-gros.pdf", corrige: "word/corriges/jours-de-la-semaine.pdf", suite: "ccc-tante",
    taches: ["Mettez le titre « Jours de la semaine » en gras, taille 18.", "Déplacez le paragraphe « Le lundi… » en dessous du titre.", "Déplacez le paragraphe « Le samedi… » tout en bas du document.", "Déplacez le paragraphe « il y a des régions… » au-dessus du paragraphe « Le jeudi… ».", "Dans le paragraphe « Le jeudi », placez « la journée » avant « … est longue ». N'oubliez pas la majuscule.", "Écrivez vos prénom et nom à la fin du texte.", "Corrigez les fautes, enregistrez, puis imprimez."]
  },
  "ccc-tante": {
    app: "word", niveau: 2, duree: "20 min", titre: "Chez ma tante",
    objectif: "Déplacer des paragraphes et gérer les lignes blanches.",
    fichier: "word/chez-ma-tante.docx", consigne: "word/consignes/couper-copier-coller.pdf", consigneGros: "word/consignes/couper-copier-coller-gros.pdf", corrige: "word/corriges/chez-ma-tante.pdf", suite: "ccc-ecologie",
    taches: ["Sélectionnez tout le document : taille 13, police Comic Sans MS.", "Mettez le titre « Chez ma tante… » en gras, taille 20.", "Placez le paragraphe « À la fin du siècle… » en dessous du titre.", "Placez le paragraphe « En 1984… » avant le paragraphe « Les prêts sur gages ».", "Placez la ligne « D'après un article… » en bas du document.", "Mettez le sous-titre « Les prêts sur gages » en gras, taille 15.", "Sautez une ligne entre chaque paragraphe, et 3 lignes entre le titre et le début du texte.", "Corrigez les fautes, enregistrez, puis imprimez."]
  },
  "ccc-ecologie": {
    app: "word", niveau: 2, duree: "20 min", titre: "L'écologie au quotidien",
    objectif: "Compléter un texte et reproduire sa présentation.",
    fichier: "word/ecologie.docx", consigne: "word/consignes/couper-copier-coller.pdf", consigneGros: "word/consignes/couper-copier-coller-gros.pdf", corrige: "word/corriges/ecologie.pdf",
    taches: ["Mettez tout le document en taille 13 et en police Arial.", "Mettez le titre centré, en taille 20 et en gras.", "Ajoutez en fin de document les définitions de la consigne : Recyclage, Ressources naturelles, Tri sélectif, Zéro déchet.", "Présentez l'ensemble comme le document de la consigne (attention au gras et à l'italique).", "Enregistrez, puis imprimez."]
  },

  /* ---------- WORD : police ---------- */
  "police-bureautique": {
    app: "word", niveau: 1, duree: "15 min", titre: "La bureautique",
    objectif: "Saisir, corriger, puis appliquer des mises en forme de police.",
    consigne: "word/consignes/police-bureautique.pdf", consigneGros: "word/consignes/police-bureautique-gros.pdf",
    suite: "police-chien",
    taches: ["Saisissez le texte de la consigne et enregistrez le document dans votre dossier.", "Corrigez les fautes.", "Mettez tout le document en police High Tower Text et justifié.", "Mettez le titre en gras, taille 18, aligné à gauche.", "Mettez le reste du document en taille 14.", "Mettez le deuxième paragraphe en gras.", "Soulignez la première ligne du troisième paragraphe.", "Remettez ou envoyez le document à votre formateur."]
  },
  "police-chien": {
    app: "word", niveau: 2, duree: "25 min", titre: "La vie du chien",
    objectif: "Combiner les polices, les couleurs et les espacements, puis corriger les fautes.",
    fichier: "word/la-vie-du-chien.docx", corrige: "word/corriges/la-vie-du-chien.pdf", suite: "police-alignements",
    taches: ["Mettez tout le document en police Bradley Hand ITC, taille 14, gras et justifié.", "Appliquez un interligne de 1.", "Mettez le titre en police ALGERIAN, taille 26, couleur orange à 50 %.", "Ajoutez un espace avant le premier sous-titre et mettez-le en couleur orange à 25 %.", "Appliquez cette mise en forme à tous les sous-titres.", "Sautez une ligne entre chaque paragraphe.", "Corrigez les fautes.", "Remettez ou envoyez le document à votre formateur."]
  },
  "police-alignements": {
    app: "word", niveau: 2, duree: "25 min", titre: "Police et alignements",
    objectif: "Un exercice de reproduction : chaque phrase dit ce qu'il faut lui appliquer.",
    corrige: "word/corriges/police-et-alignements.pdf",
    consigne: "word/consignes/police-alignements.pdf", consigneGros: "word/consignes/police-alignements-gros.pdf",
    taches: ["Saisissez tout le texte de la consigne.", "Appliquez à chaque ligne ce qu'elle demande.", "Enregistrez sous le nom « Police et alignements » dans votre dossier."]
  },

  /* ---------- WORD : mise en page ---------- */
  "mep-voyages": {
    app: "word", niveau: 2, duree: "30 min", titre: "Voyages",
    objectif: "Retraits, surbrillance et mise en page, avec tout le texte sur une seule page.",
    fichier: "word/voyages.docx", consigne: "word/consignes/mise-en-page.pdf", consigneGros: "word/consignes/mise-en-page-gros.pdf", corrige: "word/corriges/voyages.pdf", suite: "mep-effets",
    taches: ["Mettez le texte en Comic Sans MS, taille 14.", "Mettez le titre en police Matura MT Script, taille 26, avec le WordArt remplissage vert d'eau et contour bleu.", "Soulignez le premier paragraphe avec des vagues.", "Appliquez aux 2ᵉ et 3ᵉ paragraphes un retrait à droite de 2 cm et une surbrillance cyan.", "Faites l'inverse sur les deux paragraphes suivants, avec une surbrillance grise.", "Mettez le dernier paragraphe en italique, avec une lumière bleue de 1,8 pt.", "Faites tenir le tout sur une page, sans toucher à la taille du titre, en restant lisible à 100 %.", "Corrigez les fautes, puis remettez le travail au formateur."]
  },
  "mep-effets": {
    app: "word", niveau: 3, duree: "40 min", titre: "Les effets spéciaux au cinéma",
    objectif: "Reproduire un modèle avec interlignes, surbrillance, bordure de paragraphe et bordure de page.",
    fichier: "word/effets-speciaux.docx", consigne: "word/consignes/mise-en-page.pdf", consigneGros: "word/consignes/mise-en-page-gros.pdf", corrige: "word/corriges/effets-speciaux.pdf",
    taches: ["Mettez le titre en Old English Text, taille 25, centré, avec un effet de texte (remplissage vert olive, contour noir, lumière violette de 18 points).", "Mettez le texte en Agency FB, taille 12.", "Utilisez les interlignes, la surbrillance, le soulignement, la bordure de paragraphe et la bordure de page pour obtenir le résultat de la consigne.", "Vérifiez, puis présentez le travail au formateur."]
  },

  /* ---------- WORD : paragraphes, puces et numéros ---------- */
  "puces-canada": {
    app: "word", niveau: 2, duree: "40 min", titre: "Le Canada",
    objectif: "Maîtriser les espacements, les retraits et l'interligne sur un long document.",
    fichier: "word/le-canada.docx", consigne: "word/consignes/puces-et-numeros.pdf", consigneGros: "word/consignes/puces-et-numeros-gros.pdf", corrige: "word/corriges/le-canada.pdf", suite: "puces-coniferes",
    taches: ["Mettez tout le document en Comic Sans MS, justifié.", "Mettez le titre « LE CANADA » en taille 20, centré, avec la couleur de votre choix.", "Mettez le paragraphe sous le titre en justifié, ombré, avec un espace de 12 pts au-dessus.", "Mettez « Les premières explorations » en Arial 12, gras, rouge accentuation 2, avec 9 pts au-dessus et 6 pts en dessous.", "Appliquez cette présentation à tous les autres titres.", "Appliquez aux paragraphes les retraits et interlignes indiqués dans la consigne, partie par partie.", "Numérotez les pages en bas à droite : I, II, III…", "Enregistrez le document."]
  },
  "puces-coniferes": {
    app: "word", niveau: 2, duree: "40 min", titre: "Les conifères et leurs belles variétés",
    objectif: "Lettrine, titres numérotés et puces personnalisées.",
    fichier: "word/les-coniferes.docx", consigne: "word/consignes/puces-et-numeros.pdf", consigneGros: "word/consignes/puces-et-numeros-gros.pdf", corrige: "word/corriges/les-coniferes.pdf",
    taches: ["Mettez tout le document en Comic Sans MS, taille 11, justifié.", "Présentez le titre sur deux lignes, de façon lisible, et ajoutez 4 lignes blanches après lui.", "Mettez le texte de « Les conifères… » à « …comme ceux des pins. » en italique, avec un interligne de 1,5.", "Mettez une lettrine sur le L de « Les conifères… ».", "Mettez « Pin Sylvestre » en taille 14, en bleu, avec 9 pts au-dessus et 6 pts en dessous, numéroté au format 1.", "Appliquez cette présentation à tous les autres titres, en vérifiant la numérotation.", "Appliquez des puces aux lignes de chaque partie, comme indiqué dans la consigne.", "Enregistrez vos modifications."]
  },

  /* ---------- WORD : tabulations ---------- */
  "tab-bruit": {
    app: "word", niveau: 2, duree: "15 min", titre: "Le bruit",
    objectif: "Aligner des chiffres à droite avec des points de suite.",
    corrige: "word/corriges/le-bruit.pdf", suite: "tab-accidents",
    consigne: "word/consignes/tab-bruit.pdf", consigneGros: "word/consignes/tab-bruit-gros.pdf",
    taches: ["Saisissez le titre de la consigne, puis réglez une tabulation droite avec des points de suite.", "Saisissez chaque ligne : le texte, la touche {Tab}, puis le chiffre.", "Vérifiez que tous les chiffres sont bien alignés à droite.", "Enregistrez sous le nom « Le bruit »."]
  },
  "tab-accidents": {
    app: "word", niveau: 3, duree: "30 min", titre: "Casque et gravité des accidents",
    objectif: "Un tableau de chiffres sans tableau : plusieurs tabulations sur une même ligne.",
    corrige: "word/corriges/accidents.pdf", suite: "tab-reservation",
    consigne: "word/consignes/tab-accidents.pdf", consigneGros: "word/consignes/tab-accidents-gros.pdf",
    taches: ["Réglez une tabulation droite à 10 cm avec des points de suite (modèle 2).", "Ajoutez des tabulations droites à 12, 14 et 16 cm.", "Saisissez chaque ligne avec la touche {Tab} entre les colonnes.", "Enregistrez sous le nom « Accidents »."]
  },
  "tab-reservation": {
    app: "word", niveau: 3, duree: "30 min", titre: "La réservation",
    objectif: "Reproduire un formulaire : tabulations gauche et droite, points de suite et bordure en vagues.",
    modele: "word/modeles/reservation.pdf",
    taches: ["Ouvrez le modèle et observez-le.", "Soulignez le titre avec une bordure « vague ».", "Réglez une tabulation droite à 7 cm avec des points de suite 2.", "Réglez une tabulation gauche à 8,5 cm et une tabulation droite à 15,5 cm avec des points de suite 2.", "Saisissez le formulaire et comparez avec le modèle.", "Enregistrez sous le nom « Réservation »."]
  },

  /* ---------- WORD : insertion ---------- */
  "ins-labo": {
    app: "word", niveau: 2, duree: "30 min", titre: "Les métiers du laboratoire",
    objectif: "WordArt, image avec habillage et en-tête.",
    fichier: "word/metiers-du-laboratoire.docx", consigne: "word/consignes/insertion.pdf", consigneGros: "word/consignes/insertion-gros.pdf", corrige: "word/corriges/metiers-du-laboratoire.pdf", suite: "ins-entrepreneuriat",
    taches: ["Centrez le titre, taille 20, gras et majuscules, remplissage bleu, contour noir, lumière bleu accentuation 5.", "Justifiez les 1er et 3ᵉ paragraphes, centrez le 2ᵉ.", "Interligne de 1,5 aux 1er et 3ᵉ paragraphes, de 1,15 au 2ᵉ.", "Insérez une image en ligne d'un outil de laboratoire : habillage carré, position centrée.", "Appliquez un retrait gauche de 1 cm sur les deux premiers paragraphes.", "Insérez un en-tête intégral à trame rouge foncé avec « DOCUMENT CONFIDENTIEL » à droite, en Arial gras.", "Sautez une ligne avant le dernier paragraphe et mettez en rouge les étapes critiques de l'analyse.", "Corrigez les fautes, puis envoyez le document au formateur."]
  },
  "ins-entrepreneuriat": {
    app: "word", niveau: 2, duree: "30 min", titre: "L'entrepreneuriat",
    objectif: "Liste numérotée, forme, image et pied de page.",
    fichier: "word/entrepreneuriat.docx", consigne: "word/consignes/insertion.pdf", consigneGros: "word/consignes/insertion-gros.pdf", corrige: "word/corriges/entrepreneuriat.pdf", suite: "ins-formations",
    taches: ["Mettez en forme le titre selon votre choix et sautez une ligne après « …une fois lancée ».", "Créez une liste numérotée pour les étapes de la création d'entreprise.", "Insérez une flèche orange, habillage carré, d'environ 6 cm de large, à gauche du 2ᵉ paragraphe.", "Ajoutez à droite du 1er paragraphe une image d'une personne au travail : cadre rectangle arrondi réfléchi, habillage rapproché.", "Insérez un pied de page avec la date et le numéro de page, aligné à droite.", "Mettez en vert les exemples de dispositifs d'accompagnement.", "Corrigez les fautes."]
  },
  "ins-formations": {
    app: "word", niveau: 3, duree: "35 min", titre: "Les formations qualifiantes",
    objectif: "Effets WordArt, illustration, pied de page prédéfini et surlignage.",
    fichier: "word/formations-qualifiantes.docx", consigne: "word/consignes/insertion.pdf", consigneGros: "word/consignes/insertion-gros.pdf", corrige: "word/corriges/formations-qualifiantes.pdf",
    taches: ["Appliquez un interligne de 1,15 à tout le texte, justifiez-le, et ajoutez 12 points avant et après les paragraphes.", "Mettez le titre en majuscules et centré, avec un WordArt à dégradé violet, taille 20.", "Sautez une ligne après « qualifiantes » et après « les » dans le titre.", "Insérez une illustration de personnes en situation de handicap en formation.", "Ajoutez un pied de page Rétrospective : « Document pédagogique » à gauche, numérotation à droite.", "Surlignez en jaune les phrases clés sur les domaines de formation.", "Mettez en gras les mots importants, comme « accessibilité » et « inclusion »."]
  },

  /* ---------- EXCEL ET POWERPOINT ---------- */
  "xl-budget": {
    app: "excel", niveau: 1, duree: "20 min", titre: "Le budget fournitures",
    objectif: "Créer un petit tableau, avec ses formules et sa mise en forme.",
    corrige: "excel/budget-fournitures-corrige.pdf",
    consigne: "excel/budget-fournitures.pdf", consigneGros: "excel/budget-fournitures-gros.pdf",
    taches: ["Créez un classeur nommé <code>Exo Excel.xlsx</code> dans votre dossier Excel.", "En A1, tapez le titre : Budget Fournitures.", "En ligne 3, créez les colonnes : Article (A3), Prix Unitaire (B3), Quantité (C3) et Total (D3).", "Remplissez les lignes 4 et 5 avec les données de la consigne.", "En D4 et D5, calculez le total de chaque ligne (prix × quantité).", "En D7, calculez le total général avec <code>=SOMME(D4:D5)</code>.", "Mettez les colonnes B et D au format monétaire (€) et les titres de la ligne 3 en gras.", "Appliquez un remplissage jaune à la cellule D7."]
  },
  "ppt-formatech": {
    app: "powerpoint", niveau: 1, duree: "25 min", titre: "Bienvenue chez Formatech",
    objectif: "Créer une courte présentation de 3 diapositives.",
    corrige: "powerpoint/formatech-corrige.pdf",
    taches: ["Créez une présentation <code>test_ppt.pptx</code> dans votre dossier PowerPoint.", "<strong>Diapositive 1 :</strong> titre « Bienvenue chez Formatech » (Aptos Display, taille 60), sous-titre « Rapport d'activité 2026 » (Aptos, taille 24).", "<strong>Diapositive 2 :</strong> titre « Nos Résultats » (taille 44). Insérez une forme contenant « +15% de croissance » (Aptos gras, taille 36).", "<strong>Diapositive 3 :</strong> titre « Contact » (taille 44). Insérez une image et une zone de texte en bas : « Fin de présentation » (Aptos, taille 28)."]
  },

  /* ---------- FICHIERS ET DOSSIERS ---------- */
  "gf-deplacer": {
    app: "windows", niveau: 2, duree: "30 min", titre: "Le cabinet Quichon et le garage Arkanault",
    objectif: "Un couple partage le même ordinateur, l'un est vétérinaire et l'autre garagiste. Suite à un bug, tout s'est mélangé : à vous de ranger.",
    pack: "packs/entreprise.zip", consigne: "fichiers-dossiers/consignes-deplacer.pdf", consigneGros: "fichiers-dossiers/consignes-deplacer-gros.pdf", suite: "gf-renommer",
    taches: ["Dans le dossier Entreprise, créez ANIMAUX et VEHICULES s'ils n'existent pas.", "Déplacez Chats, Chiens, Insectes, Animaux Fermes et Animaux Exotiques dans ANIMAUX.", "Déplacez Autos, Bus, Motos, Utilitaires et Vélos-Trotinettes dans VEHICULES.", "Copiez Vaccinations2024 et Opérations2024 (dossier Chats) dans tous les dossiers d'ANIMAUX.", "Copiez Carrosserie et Mécanique (dossier Autos) dans tous les dossiers de VEHICULES.", "Déplacez ANIMAUX dans CABINET et VEHICULES dans GARAGE.", "Rangez les fichiers Comptabilité et Prospectus dans leur dossier. Déplacez Inventaire et Liste de clients dans CABINET, et copiez-les dans GARAGE."]
  },
  "gf-renommer": {
    app: "windows", niveau: 2, duree: "30 min", titre: "La maison de Nathalie et Paul",
    objectif: "Nathalie ne comprend pas le rangement de Paul : renommez leurs dossiers et leurs fichiers.",
    pack: "packs/maison.zip", consigne: "fichiers-dossiers/consignes-renommer.pdf", consigneGros: "fichiers-dossiers/consignes-renommer-gros.pdf", suite: "gf-supprimer",
    taches: ["Renommez les dossiers : Documents → PERSONNEL, Documents administratifs → ADMINISTRATIF, Documents emploi → EMPLOI, Documents fiscaux → FISCAL.", "Dans ADMINISTRATIF : cOURRIER mONSIEUR LE maire → Courrier Mairie 101223, Lettre de réclamation SFR → Prlv SFR 050124.", "Dans EMPLOI : renommez les contrats (CT NATHALIE 2010, CT PAUL 2015) et les statuts (Statuts GARAGE, Statuts CABINET).", "Renommez les deux fichiers Excel selon leur contenu : Budget famille 2024 et Budget vacances 2024.", "Suivez la suite de la consigne pour le dossier PERSONNEL."]
  },
  "gf-supprimer": {
    app: "windows", niveau: 3, duree: "30 min", titre: "Le vide-grenier de la famille Quichon",
    objectif: "Faire du tri : supprimer les dossiers et les fichiers inutiles, en une seule suppression par dossier.",
    pack: "packs/vide-grenier.zip", consigne: "fichiers-dossiers/consignes-supprimer.pdf", consigneGros: "fichiers-dossiers/consignes-supprimer-gros.pdf",
    taches: ["Supprimez les dossiers MOBILIER, SACS et VAISSELLE.", "Dans TELEPHONES, supprimez ALCATEL, NOKIA, SAGEM et SAMSUNG.", "Dans VIDEOTHEQUE, ne conservez que les séries américaines.", "Dans VIDEOTHEQUE, supprimez les fichiers notés « vendu », ainsi que les doublons.", "Dans VETEMENTS, supprimez les fichiers inutiles (vendu, déchiré…)."]
  },

  /* ---------- FONCTIONS COMMUNES ---------- */
  "commun-modele": {
    app: "word", niveau: 2, duree: "20 min", titre: "Un modèle de compte rendu",
    objectif: "Préparer un document réutilisable, puis l'enregistrer comme modèle.",
    taches: ["Créez un document Word et définissez les styles Titre 1, Titre 2 et Normal.", "Ajoutez des zones à remplir entre crochets : [Titre de la réunion], [Date], [Participants].", "Ajoutez le numéro de page dans le pied de page.", "Fichier > Enregistrer sous > « Modèle Word (*.dotx) », avec un nom explicite.", "Rouvrez le modèle par un double-clic : vérifiez qu'il crée bien un nouveau document."]
  },
  "commun-numero": {
    app: "word", niveau: 1, duree: "10 min", titre: "Numéroter un long document",
    objectif: "Essayer les formats de numérotation sur un vrai document.",
    fichier: "word/le-canada.docx",
    taches: ["Insertion > Numéro de page > Bas de page : choisissez une position à droite.", "Ouvrez « Format des numéros de page » et choisissez les chiffres romains : I, II, III.", "Activez « Première page différente » : le numéro disparaît de la première page.", "Ajoutez la date automatique dans l'en-tête."]
  },

  /* ---------- WINDOWS ET INTERNET ---------- */
  "win-capture": {
    app: "windows", niveau: 1, duree: "10 min", titre: "Ma première capture d'écran",
    objectif: "Capturer une partie de l'écran et l'enregistrer.",
    taches: ["Appuyez sur {Windows+Maj+S}.", "Choisissez la capture Rectangle et sélectionnez une zone de l'écran.", "Cliquez sur la notification, puis enregistrez l'image dans votre dossier avec un nom clair.", "Refaites une capture en choisissant cette fois le mode Fenêtre."]
  },
  "net-recherches": {
    app: "internet", niveau: 2, duree: "45 min", titre: "Recherches sur Internet",
    objectif: "Trouver des informations réelles sur plusieurs sites et apprendre à vérifier ce qu'on trouve.",
    consigne: "internet/recherches-internet.pdf", consigneGros: "internet/recherches-internet-gros.pdf",
    taches: ["<strong>Pages Jaunes :</strong> trouvez l'adresse de France Travail à Évry et le numéro de la bibliothèque universitaire d'Évry.", "<strong>France Travail :</strong> trouvez comment obtenir de l'aide pour rédiger un bon CV.", "<strong>Allociné :</strong> trouvez comment connaître les films encore à l'affiche.", "<strong>Société Delacroix :</strong> cherchez un train de Paris à Tours, arrivée avant 9 h 30, sans correspondance.", "Faites une capture d'écran de vos recherches de train."]
  },
  "net-corriger-mail": {
    app: "internet", niveau: 1, duree: "30 min", titre: "Corriger des mails",
    objectif: "Corriger les fautes d'orthographe et de présentation de vrais exemples.",
    consigne: "internet/corriger-un-mail.pdf", consigneGros: "internet/corriger-un-mail-gros.pdf", suite: "net-repondre-mail",
    taches: ["Ouvrez la consigne et lisez les mails.", "Corrigez l'orthographe de chaque mail.", "Corrigez la présentation : formule de politesse, retours à la ligne, signature.", "Proposez un objet clair pour chaque mail."]
  },
  "net-repondre-mail": {
    app: "internet", niveau: 2, duree: "30 min", titre: "Répondre à un mail",
    objectif: "Préparer une réponse adaptée, sur une boîte d'entraînement Yopmail.",
    consigne: "internet/repondre-un-mail.pdf", consigneGros: "internet/repondre-un-mail-gros.pdf",
    taches: ["Ouvrez le site yopmail.com.", "Choisissez un mail de la consigne et préparez une réponse adaptée.", "Vérifiez l'orthographe et la présentation.", "Signez avec vos prénom et nom."]
  },

  /* ---------- LES GRANDS DÉFIS ---------- */
  "defi-word-1": {"app":"word","niveau":2,"titre":"Mon premier document Word","taches":["Ouvrez un nouveau document et saisissez un paragraphe de votre choix (environ 50 mots).","Avec la marge : mettez la première ligne en gras, taille 14 ; justifiez le paragraphe entier ; passez tout le document en Times New Roman.","Appliquez différents alignements (gauche, centré, droite) à des phrases séparées.","Enregistrez sous le nom <code>Mon_Premier_Document_Word.docx</code>."]},
  "defi-word-2": {"app":"word","niveau":2,"titre":"Appliquer les styles à un document","taches":["<strong>Préparation :</strong> ouvrez le fichier et lisez-le pour comprendre sa structure et ses sections.","<strong>Application :</strong> utilisez les styles prédéfinis (Titre 1, Titre 2, Titre 3, Normal, Citation…) ou créez les vôtres pour formater chaque élément de façon cohérente.","<strong>Vérification :</strong> corrigez toute incohérence et ajustez les espacements et les alignements."]},
  "defi-word-3": {"app":"word","niveau":2,"titre":"Rapport de gestion et publipostage","taches":["Ouvrez le fichier « Rapport de gestion 2024 » (réseau P:) et appliquez les styles Titre 1, Titre 2 et Normal à tout le document.","Insérez une table des matières automatique en début de document, puis mettez-la à jour après avoir ajouté une nouvelle section.","Créez un tableau à 3 colonnes (Nom, Prénom, Service) avec 5 lignes de données fictives. Appliquez un style de tableau professionnel.","Réalisez un publipostage simple : créez une lettre de convocation type et fusionnez-la avec une liste de 5 destinataires (fichier Excel sur le réseau P:), puis prévisualisez les résultats."]},
  "defi-excel-1": {"app":"excel","niveau":2,"titre":"Tableau_Produits.xlsx","taches":["Dans un nouveau classeur, saisissez 5 produits avec leurs quantités et prix unitaires. Calculez le montant de chaque ligne avec une formule.","Avec la recopie, générez une série de jours (du lundi au vendredi) et une numérotation de 1 à 20.","Mettez en forme : format monétaire pour les prix, gras pour les en-têtes, couleur de fond pour la ligne de total.","Utilisez =SOMME(), =MOYENNE(), =MIN() et =MAX(), puis enregistrez sous <code>Tableau_Produits.xlsx</code>."]},
  "defi-excel-2": {"app":"excel","niveau":2,"titre":"Références, conditions et TCD","taches":["Reprenez vos produits et calculez la TVA avec une référence absolue : le taux de 20 % est dans une cellule fixe.","Avec =SI(), affichez « Stock OK » si la quantité dépasse 10, sinon « Réapprovisionner ». Avec =NB.SI(), comptez les produits en rupture.","Mise en forme conditionnelle : cellules en rouge si le stock est inférieur à 5, en vert s'il dépasse 20.","Créez un TCD à partir d'un tableau de ventes (fichier du réseau P:) pour analyser le chiffre d'affaires par catégorie et par mois.","Générez un graphique en barres à partir de ce TCD."]},
  "defi-powerpoint-1": {"app":"powerpoint","niveau":2,"titre":"Une présentation professionnelle","taches":["Créez une nouvelle présentation vierge : Fichier > Nouveau.","Affichage > Masque des diapositives : personnalisez l'apparence, avec un logo et des couleurs cohérentes.","Ajoutez au moins 5 diapositives avec différentes dispositions (titre, contenu, deux colonnes…).","Appliquez des transitions sobres et animez les éléments clés (titres, listes à puces).","Ajoutez le pied de page avec la date et la numérotation, puis enregistrez en modèle <code>.potx</code>."]},
  "defi-powerpoint-2": {"app":"powerpoint","niveau":2,"titre":"Une présentation de 5 diapositives","taches":["Sur un sujet de votre choix : 1 diapositive de titre, 3 de contenu, 1 de conclusion.","Sur chaque diapositive : un titre, un texte en puces et au moins une image.","Appliquez un thème cohérent (onglet Création), puis personnalisez les couleurs et les polices.","Lancez le diaporama ({F5}), naviguez, puis enregistrez sous <code>Ma_Presentation.pptx</code>."]},
  "defi-powerpoint-3": {"app":"powerpoint","niveau":2,"titre":"Masque, transitions et mode Présentateur","taches":["Dans le masque, ajoutez un logo en haut à droite et une couleur de fond cohérente.","Appliquez la transition « Fondu » à toutes les diapositives et l'animation « Apparition » sur les listes à puces.","Insérez un pied de page avec la date automatique et la numérotation (Insertion > En-tête et pied de page).","Enregistrez en modèle (<code>.potx</code>), puis présentez en mode Présentateur : guidez-vous avec les notes et le pointeur laser."]},
  "defi-fichiers-1": {"app":"windows","niveau":2,"titre":"Créer un PDF depuis Word","taches":["<strong>Méthode 1, Enregistrer sous :</strong> Fichier > Enregistrer sous, choisissez l'emplacement, sélectionnez PDF (*.pdf) dans « Type de fichier », puis Enregistrer.","<strong>Méthode 2, Exporter :</strong> Fichier > Exporter > Créer un document PDF/XPS, choisissez l'emplacement, puis Publier.","<strong>Méthode 3, Imprimer en PDF :</strong> {Ctrl+P}, sélectionnez l'imprimante Microsoft Print to PDF, cliquez sur Imprimer, puis choisissez l'emplacement et le nom.","<strong>Vérification :</strong> dans l'Explorateur, vérifiez que l'icône est rouge avec la mention PDF et que l'extension est bien .pdf."]},
  "defi-fichiers-2": {"app":"windows","niveau":2,"titre":"Premier classement numérique","objectif":"Vous allez créer votre espace de travail personnel pour la formation bureautique.","taches":["Ouvrez l'Explorateur avec {Windows+E} et allez dans Documents. Testez les modes Icônes, Liste et Détails, puis gardez le mode Détails.","Dans Documents > BUREAUTIQUE, vérifiez les dossiers présents et créez uniquement ceux qui manquent : <code>01_Gestion_Fichiers</code>, <code>02_Word</code>, <code>03_Excel</code>, <code>04_PowerPoint</code>, <code>05_Internet</code>.","Dans chaque dossier, vérifiez qu'un sous-dossier <code>Images</code> existe. Sinon, créez-le. Exemple : Documents > BUREAUTIQUE > 02_Word > Images."]},
  "defi-fichiers-3": {"app":"windows","niveau":2,"titre":"Créer une arborescence avec nommage","taches":["<strong>Créez les dossiers :</strong> <code>ENTREPRISE_LUMINA_DESIGN</code>, <code>01_RH_ET_SOCIAL</code>, <code>03_STUDIO_CREATIF</code>, <code>Identites_Visuelles</code>, <code>Notes_de_Frais</code>, <code>Service_Commercial</code>.","<strong>Créez 9 fichiers.</strong> Images : logo principal.png, charte graphique.png, photo equipe.jpg, photo bureau.jpg. Word : note frais janvier.docx. PowerPoint : presentation agence.pptx, formation interne.pptx. Excel : budget agence.xlsx, suivi notes frais.xlsx.","<strong>Renommez 5 fichiers :</strong> logo principal.png → <code>Logo_Principal_Lumina.png</code> ; note frais janvier.docx → <code>Note_Frais_Janvier_2026.docx</code> ; photo equipe.jpg → <code>Photo_Equipe_Studio.jpg</code> ; presentation agence.pptx → <code>Presentation_Agence_2026.pptx</code> ; budget agence.xlsx → <code>Budget_Agence_2026.xlsx</code>.","<strong>Rangez les fichiers</strong> dans les bons dossiers, puis comparez avec la solution."],"solution":{"bouton":"👀 Voir l'arborescence attendue","contenu":[{"img":"p023_0","alt":"ENTREPRISE_LUMINA_DESIGN contient 03_STUDIO_CREATIF avec Presentation_Agence_2026.pptx, Budget_Agence_2026.xlsx et le sous-dossier Identites_Visuelles (Logo_Principal_Lumina.png, charte graphique.png, Photo_Equipe_Studio.jpg, photo bureau.jpg). 01_RH_ET_SOCIAL contient formation interne.pptx et Service_Commercial, lui-même avec Notes_de_Frais (Note_Frais_Janvier_2026.docx, suivi notes frais.xlsx)."}]}},
  "defi-windows-1": {"app":"windows","niveau":2,"titre":"Personnaliser et maîtriser Windows 11","taches":["<strong>Personnaliser le Bureau :</strong> faites un clic droit sur le Bureau, changez le fond d'écran, puis choisissez un thème de couleur dans les paramètres.","<strong>Naviguer entre les applications :</strong> ouvrez le Bloc-notes, l'Explorateur de fichiers et un navigateur. Passez de l'un à l'autre avec {Alt+Tab}, sans la souris.","<strong>Gérer les notifications :</strong> ouvrez le centre de notifications, vérifiez le Wi-Fi et le volume, puis épinglez une application à la barre des tâches.","<strong>Gérer l'affichage :</strong> appuyez sur {Windows+P} et explorez les 4 modes. Si un second écran est disponible, testez le mode Étendre et déplacez une fenêtre avec {Windows+Maj+Flèche}."]},
  "defi-internet-1": {"app":"internet","niveau":2,"titre":"Rédiger un e-mail professionnel","taches":["Rédigez un message clair et concis, avec un objet précis et une formule de politesse appropriée.","Structurez le corps du message et ajoutez une signature complète.","Envoyez-le à un collègue (destinataire principal) avec une pièce jointe PDF.","Mettez un autre collègue en copie (Cc)."]},
  "defi-internet-2": {"app":"internet","niveau":2,"titre":"Collaborer sur Teams et Outlook Calendar","taches":["Créez un canal Microsoft Teams dédié à un nouveau projet.","Partagez dans ce canal un document Word depuis OneDrive.","Invitez un collègue à co-éditer le document en temps réel avec vous.","Avec Outlook Calendar, planifiez une réunion de suivi en vérifiant les disponibilités de chacun."]}
};
