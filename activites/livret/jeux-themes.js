/*
  LE CONTENU DES JEUX PAR THÈME : « Trouve l'intrus », « Vrai ou faux » et « Mots mêlés ».
  Pour corriger ou ajouter, modifiez une ligne en gardant les guillemets, les virgules et les crochets.
    INTRUS : [les 4 éléments, le numéro de l'intrus (0 = le premier), l'explication]
    VRAI_FAUX : [l'affirmation, true si c'est vrai / false si c'est faux, l'explication]
    MOTS_MELES : les mots à trouver, en majuscules, sans accent ni espace (12 lettres au plus)
*/
const INTRUS = {
  "ordinateur": [
    [["Clavier", "Souris", "Scanner", "Imprimante"], 3, "L'imprimante est un périphérique de sortie ; les autres envoient des informations à l'ordinateur (entrée)."],
    [["Écran", "Imprimante", "Haut-parleurs", "Micro"], 3, "Le micro est un périphérique d'entrée ; les autres sont des périphériques de sortie."],
    [["Clé USB", "Disque dur externe", "Carte SD", "Webcam"], 3, "La webcam filme ; les autres servent à stocker des fichiers."],
    [["Processeur", "Mémoire vive", "Carte mère", "Logiciel"], 3, "Le logiciel est un programme (software) ; les autres sont du matériel (hardware)."],
    [["Word", "Excel", "Windows", "PowerPoint"], 2, "Windows est le système d'exploitation ; les autres sont des logiciels de bureautique."],
    [["Go", "Mo", "Ko", "GHz"], 3, "Le GHz mesure la vitesse du processeur ; les autres mesurent une quantité de données."],
    [["Prise USB", "Prise HDMI", "Prise réseau", "Wi-Fi"], 3, "Le Wi-Fi fonctionne sans câble ; les autres sont des prises."],
    [["Unité centrale", "Écran", "Clavier", "Corbeille"], 3, "La Corbeille est dans Windows ; les autres sont des éléments matériels."]
  ],
  "windows": [
    [["Menu Démarrer", "Barre des tâches", "Bureau", "Clé USB"], 3, "La clé USB est un objet matériel ; les autres font partie de l'écran de Windows."],
    [["{Windows+D}", "{Windows+E}", "{Windows+L}", "{Ctrl+P}"], 3, "Ctrl + P imprime ; les autres raccourcis utilisent la touche Windows."],
    [["Réduire", "Agrandir", "Fermer", "Imprimer"], 3, "Imprimer n'est pas un bouton de la fenêtre ; les trois autres sont en haut à droite de chaque fenêtre."],
    [["Capture d'écran", "Snap Assist", "Bureaux virtuels", "Publipostage"], 3, "Le publipostage est une fonction de Word ; les autres sont des outils de Windows."],
    [["Paramètres", "Explorateur de fichiers", "Corbeille", "PowerPoint"], 3, "PowerPoint fait partie d'Office ; les autres sont des outils de Windows."],
    [["Mode sombre", "Fond d'écran", "Couleur d'accentuation", "Mise en forme conditionnelle"], 3, "La mise en forme conditionnelle est dans Excel ; les autres se règlent dans Paramètres > Personnalisation."],
    [["Dupliquer ces affichages", "Étendre ces affichages", "Afficher uniquement sur 1", "Justifier"], 3, "Justifier aligne un texte ; les autres sont des réglages du double écran."],
    [["{Windows+Maj+S}", "{Impr écran}", "{Windows+Maj+R}", "{Ctrl+S}"], 3, "Ctrl + S enregistre ; les autres lancent une capture d'écran."]
  ],
  "fichiers": [
    [[".docx", ".xlsx", ".pptx", ".mp3"], 3, ".mp3 est un fichier son ; les autres sont des documents Office."],
    [[".jpg", ".png", ".gif", ".pdf"], 3, ".pdf est un document ; les autres sont des images."],
    [[".mp4", ".avi", ".mkv", ".zip"], 3, ".zip est un dossier compressé ; les autres sont des vidéos."],
    [["Couper", "Copier", "Coller", "Renommer"], 3, "Renommer change le nom ; les trois autres passent par le presse-papiers."],
    [["Documents", "Images", "Téléchargements", "Word"], 3, "Word est un logiciel ; les autres sont des dossiers de Windows."],
    [["Nom", "Modifié le", "Type", "Couleur"], 3, "Il n'y a pas de colonne Couleur ; les autres sont des colonnes du mode Détails."],
    [["{Ctrl+C}", "{Ctrl+X}", "{Ctrl+V}", "{Ctrl+S}"], 3, "Ctrl + S enregistre ; les autres copient, coupent et collent."],
    [["Grandes icônes", "Liste", "Détails", "Plein écran"], 3, "Plein écran n'est pas un mode d'affichage de l'Explorateur."]
  ],
  "office-commun": [
    [["En-tête", "Pied de page", "Numéro de page", "Tableau croisé dynamique"], 3, "Le tableau croisé dynamique est un outil d'Excel ; les autres se placent en haut ou en bas des pages."],
    [[".dotx", ".xltx", ".potx", ".docx"], 3, ".docx est un document ; les autres sont des modèles."],
    [["{Ctrl+Z}", "{Ctrl+Y}", "{Ctrl+C}", "{Alt+F4}"], 3, "Alt + F4 ferme la fenêtre ; les autres servent pendant la saisie."],
    [["Fichier", "Accueil", "Insertion", "Démarrer"], 3, "Démarrer est le menu de Windows ; les autres sont des onglets du ruban."],
    [["Enregistrer", "Enregistrer sous", "Exporter en PDF", "Supprimer"], 3, "Supprimer efface ; les autres gardent le travail."],
    [["Word", "Excel", "PowerPoint", "Paint"], 3, "Paint n'appartient pas à la suite Office."],
    [["Annuler", "Rétablir", "Répéter", "Imprimer"], 3, "Imprimer n'agit pas sur la dernière action ; les autres oui."],
    [["Barre d'accès rapide", "Ruban", "Barre d'état", "Barre des tâches"], 3, "La barre des tâches est celle de Windows ; les autres sont dans les fenêtres d'Office."]
  ],
  "word": [
    [["Gras", "Italique", "Souligné", "Justifié"], 3, "Justifié est un alignement de paragraphe ; les autres sont des mises en forme de police."],
    [["À gauche", "Centré", "Justifié", "Exposant"], 3, "Exposant est dans le groupe Police ; les autres sont des alignements."],
    [["Titre 1", "Titre 2", "Normal", "Calibri"], 3, "Calibri est une police ; les autres sont des styles."],
    [["Puces", "Numérotation", "Liste à plusieurs niveaux", "Lettrine"], 3, "La lettrine est une grande première lettre ; les autres créent des listes."],
    [["Mode Page", "Mode Lecture", "Mode Plan", "Mode Diaporama"], 3, "Le diaporama est dans PowerPoint ; les autres sont des modes d'affichage de Word."],
    [["Tabulation gauche", "Tabulation centrée", "Tabulation décimale", "Tabulation colorée"], 3, "La tabulation colorée n'existe pas."],
    [["Carré", "Rapproché", "Derrière le texte", "Recto verso"], 3, "Recto verso est un réglage d'impression ; les autres sont des habillages d'image."],
    [["Publipostage", "Table des matières", "Styles", "Recopie incrémentée"], 3, "La recopie incrémentée est un outil d'Excel."]
  ],
  "excel": [
    [["SOMME", "MOYENNE", "MAX", "Gras"], 3, "Gras est une mise en forme ; les autres sont des fonctions de calcul."],
    [["A1", "B12", "$C$3", "D-4"], 3, "D-4 n'est pas une référence de cellule."],
    [["Histogramme", "Secteurs", "Courbes", "Puces"], 3, "Les puces sont dans Word ; les autres sont des graphiques."],
    [["Trier", "Filtrer", "Mise en forme conditionnelle", "Transition"], 3, "La transition est dans PowerPoint."],
    [["=SOMME(A1:A3)", "=A1+A2", "=MOYENNE(B1:B4)", "SOMME(A1:A3)"], 3, "Il manque le signe = : Excel l'affiche comme du texte."],
    [["Cellule", "Ligne", "Colonne", "Diapositive"], 3, "La diapositive est dans PowerPoint."],
    [["#DIV/0!", "#NOM?", "#REF!", "#OUI!"], 3, "#OUI! n'existe pas ; les autres sont de vraies erreurs d'Excel."],
    [["SI", "NB.SI", "SOMME.SI", "PUCE.SI"], 3, "PUCE.SI n'existe pas."]
  ],
  "powerpoint": [
    [["Fondu", "Poussée", "Rideaux", "Apparaître"], 3, "Apparaître est une animation ; les autres sont des transitions."],
    [["{F5}", "{Maj+F5}", "{Échap}", "{F12}"], 3, "F12 ouvre « Enregistrer sous » ; les autres servent pendant le diaporama."],
    [["Normal", "Trieuse de diapositives", "Mode Présentateur", "Mode Brouillon"], 3, "Le mode Brouillon est dans Word."],
    [["Thème", "Variantes", "Taille des diapositives", "Habillage du texte"], 3, "L'habillage du texte concerne les images dans Word ; les autres sont dans l'onglet Création."],
    [["SmartArt", "Tableau", "Graphique", "Fonction SI"], 3, "La fonction SI est dans Excel ; les autres s'insèrent dans une diapositive."],
    [[".pptx", ".potx", ".ppsx", ".xlsx"], 3, ".xlsx est un classeur Excel."],
    [["Titre", "Titre et contenu", "Deux contenus", "Paysage"], 3, "Paysage est une orientation ; les autres sont des dispositions de diapositives."],
    [["Notes", "Commentaires", "Minuteur", "Recopie"], 3, "La recopie est un outil d'Excel."]
  ],
  "internet": [
    [["Edge", "Chrome", "Firefox", "Outlook"], 3, "Outlook est une messagerie ; les autres sont des navigateurs."],
    [["Gmail", "Outlook", "Yahoo Mail", "Google Maps"], 3, "Google Maps est un plan ; les autres sont des messageries."],
    [["À", "Cc", "Cci", "Ctrl"], 3, "Ctrl est une touche ; les autres sont des champs de destinataires."],
    [["https://", "www.", ".fr", "@"], 3, "L'arobase @ sert aux adresses mail ; les autres aux adresses de sites."],
    [["Teams", "Zoom", "Meet", "Excel"], 3, "Excel est un tableur ; les autres servent aux réunions à distance."],
    [["Objet", "Pièce jointe", "Signature", "Barre des tâches"], 3, "La barre des tâches est dans Windows ; les autres font partie d'un mail."],
    [["Google", "Qwant", "Bing", "Wikipédia"], 3, "Wikipédia est une encyclopédie ; les autres sont des moteurs de recherche."],
    [["Bonjour Madame,", "Cordialement,", "Bien à vous,", "Bisous !"], 3, "« Bisous ! » ne convient pas dans un mail professionnel."]
  ],
  "bonnes-pratiques": [
    [["Majuscules", "Chiffres", "Symboles", "Date de naissance"], 3, "La date de naissance se devine facilement : à éviter dans un mot de passe."],
    [["Mises à jour", "Antivirus", "Sauvegarde", "Mot de passe 123456"], 3, "123456 est le mot de passe le plus piraté ; les autres protègent l'ordinateur."],
    [["Expéditeur inconnu", "Fautes d'orthographe", "Urgence inventée", "Adresse officielle vérifiée"], 3, "Une adresse vérifiée rassure ; les autres sont des signes de phishing."],
    [["Clé USB", "Disque externe", "Cloud", "Corbeille"], 3, "La Corbeille n'est pas une sauvegarde : elle se vide."],
    [["Éteindre l'écran", "Imprimer en recto-verso", "Trier ses mails", "Laisser l'ordinateur allumé la nuit"], 3, "Laisser l'ordinateur allumé gaspille de l'énergie."],
    [["Vouvoyer", "Relire avant d'envoyer", "Écrire en MAJUSCULES", "Mettre un objet clair"], 3, "Écrire en majuscules, c'est comme crier : à éviter."],
    [["Verrouiller son PC", "Fermer sa session", "Partager son mot de passe", "Changer ses mots de passe"], 2, "On ne partage jamais son mot de passe."],
    [["Vérifier la source", "Croiser les informations", "Regarder la date", "Croire le premier site"], 3, "Le premier résultat n'est pas toujours fiable : on vérifie."]
  ]
};

const VRAI_FAUX = {
  "ordinateur": [
    ["Le clavier est un périphérique d'entrée.", true, "Il envoie ce que l'on tape à l'ordinateur."],
    ["L'imprimante est un périphérique d'entrée.", false, "Elle sort les documents sur papier : c'est un périphérique de sortie."],
    ["La mémoire vive (RAM) garde les données quand on éteint l'ordinateur.", false, "Elle se vide à l'extinction : il faut enregistrer sur le disque."],
    ["Une clé USB est un périphérique de stockage.", true, "Elle garde les fichiers, même débranchée."],
    ["1 Go est plus grand que 1 Mo.", true, "1 Go vaut environ 1 000 Mo."],
    ["Le processeur est le « cerveau » de l'ordinateur.", true, "Il fait tous les calculs."],
    ["Windows est un logiciel de traitement de texte.", false, "C'est le système d'exploitation : il fait fonctionner l'ordinateur."],
    ["Le matériel (hardware), c'est ce que l'on peut toucher.", true, "Les logiciels (software), eux, ne se touchent pas."],
    ["Un écran tactile est à la fois un périphérique d'entrée et de sortie.", true, "Il affiche (sortie) et reçoit les touchers (entrée)."],
    ["Le Wi-Fi a besoin d'un câble pour se connecter.", false, "Le Wi-Fi est une connexion sans fil."]
  ],
  "windows": [
    ["{Windows+D} affiche le Bureau.", true, "Une deuxième fois, il fait revenir les fenêtres."],
    ["{Windows+L} verrouille le PC.", true, "Pratique quand on s'absente."],
    ["Sous Windows 11, le menu Démarrer est en haut de l'écran.", false, "Il est en bas, au milieu de la barre des tâches."],
    ["La touche Impr écran ouvre l'outil Capture d'écran.", true, "On choisit ensuite la zone à capturer."],
    ["Une capture d'écran doit toujours être enregistrée à la main.", false, "Elle est enregistrée toute seule dans Images > Captures d'écran."],
    ["Snap Assist range les fenêtres côte à côte.", true, "On glisse une fenêtre sur un bord de l'écran."],
    ["{Windows+E} ouvre l'Explorateur de fichiers.", true, "E comme Explorateur."],
    ["{Alt+F4} ferme la fenêtre active.", true, "Sur le Bureau, il propose d'éteindre l'ordinateur."],
    ["On peut brancher deux écrans sur un seul ordinateur.", true, "Paramètres > Système > Affichage pour les régler."],
    ["Un fichier supprimé du disque disparaît tout de suite.", false, "Il va d'abord dans la Corbeille : on peut le restaurer."]
  ],
  "fichiers": [
    ["L'extension .docx correspond à un document Word.", true, ".docx est le format de Word."],
    ["Renommer photo.jpg en photo.pdf la transforme en PDF.", false, "Changer l'extension ne transforme pas le fichier."],
    ["Un dossier peut contenir d'autres dossiers.", true, "Ce sont les sous-dossiers : c'est l'arborescence."],
    ["{F2} permet de renommer un fichier.", true, "Sélectionnez le fichier, puis F2."],
    ["Un fichier supprimé d'une clé USB va dans la Corbeille.", false, "Sur une clé USB, la suppression est définitive."],
    ["{Ctrl+X} puis {Ctrl+V} déplace un fichier.", true, "Couper puis coller : le fichier change de place."],
    ["Un fichier .zip est un dossier compressé.", true, "Clic droit > Extraire tout pour l'ouvrir."],
    ["Il vaut mieux éviter les accents et les espaces dans les noms de fichiers.", true, "Certains logiciels et sites les acceptent mal : préférez le tiret ou le tiret bas."],
    ["{Maj+Suppr} supprime sans passer par la Corbeille.", true, "Attention : on ne peut pas récupérer le fichier."],
    ["Le mode Détails affiche la date et la taille des fichiers.", true, "Il présente les fichiers en colonnes."]
  ],
  "office-commun": [
    ["{Ctrl+Z} annule la dernière action.", true, "Dans Word, Excel et PowerPoint."],
    ["Un modèle Word a l'extension .dotx.", true, "Il sert de base à de nouveaux documents."],
    ["L'en-tête apparaît en bas de chaque page.", false, "En haut ; en bas, c'est le pied de page."],
    ["Le numéro de page s'insère par l'onglet Insertion.", true, "Insertion > Numéro de page."],
    ["{Ctrl+S} enregistre le document.", true, "S comme Save (enregistrer en anglais)."],
    ["« Enregistrer sous » permet de choisir le nom et l'emplacement.", true, "Raccourci : F12."],
    ["Le ruban est exactement le même dans Word, Excel et PowerPoint.", false, "Certains onglets sont communs, d'autres sont propres à chaque logiciel."],
    ["On peut enregistrer un document Word en PDF.", true, "Fichier > Enregistrer sous > PDF."],
    ["{Ctrl+P} lance l'impression.", true, "P comme Print (imprimer en anglais)."],
    ["{Ctrl+Y} rétablit ce que l'on vient d'annuler.", true, "C'est l'inverse de Ctrl + Z."]
  ],
  "word": [
    ["{Ctrl+I} met le texte en italique.", true, "I comme italique."],
    ["Justifier aligne le texte sur les deux marges.", true, "Les lignes vont d'une marge à l'autre."],
    ["Une lettrine est une grande lettre au début d'un paragraphe.", true, "Insertion > Lettrine."],
    ["La table des matières se met à jour toute seule.", false, "Il faut cliquer sur « Mettre à jour la table »."],
    ["Les styles Titre 1 et Titre 2 servent à créer une table des matières.", true, "Word s'appuie sur les titres pour la construire."],
    ["Le publipostage envoie une même lettre personnalisée à plusieurs personnes.", true, "Avec une liste de destinataires (souvent un fichier Excel)."],
    ["Le mode Lecture permet de modifier le texte.", false, "Il sert à lire : les outils de modification sont désactivés."],
    ["L'exposant écrit le texte en petit, au-dessus de la ligne.", true, "Comme dans 1er ou m²."],
    ["{Ctrl+Entrée} insère un saut de page.", true, "Le texte suivant commence sur une nouvelle page."],
    ["Word souligne les fautes d'orthographe en vert.", false, "En rouge ; la grammaire est soulignée en bleu."]
  ],
  "excel": [
    ["Toute formule commence par le signe =.", true, "Sans =, Excel croit que c'est du texte."],
    ["=SOMME(A1:A3) additionne A1, A2 et A3.", true, "Les deux points veulent dire « jusqu'à »."],
    ["Le $ dans $A$1 bloque la cellule quand on recopie la formule.", true, "C'est une référence absolue."],
    ["#DIV/0! signifie qu'on a divisé par zéro.", true, "Vérifiez la cellule du diviseur."],
    ["Dans Excel, on multiplie avec la lettre x.", false, "On multiplie avec l'étoile *."],
    ["MAX donne la plus petite valeur.", false, "MAX donne la plus grande ; MIN la plus petite."],
    ["La poignée de recopie est en bas à droite de la cellule.", true, "Le petit carré vert, à tirer vers le bas ou à droite."],
    ["Un filtre supprime les lignes qu'on ne voit plus.", false, "Il les cache seulement : on les retrouve en effaçant le filtre."],
    ["Un graphique en secteurs montre les parts d'un total.", true, "Comme un camembert."],
    ["La cellule B3 est dans la colonne 3 et la ligne B.", false, "Colonne B (la lettre), ligne 3 (le chiffre)."]
  ],
  "powerpoint": [
    ["{F5} lance le diaporama depuis le début.", true, "Maj + F5 le lance depuis la diapositive actuelle."],
    ["Une transition s'applique à un titre ou à une image.", false, "La transition se joue entre deux diapositives ; sur un élément, c'est une animation."],
    ["{Ctrl+M} ajoute une nouvelle diapositive.", true, "Comme Accueil > Nouvelle diapositive."],
    ["Le masque des diapositives permet de mettre un logo sur toutes les diapositives.", true, "Affichage > Masque des diapositives."],
    ["{Échap} arrête le diaporama.", true, "On revient à l'écran de travail."],
    ["Le mode Présentateur montre les notes au public.", false, "Les notes ne s'affichent que sur l'écran de la personne qui présente."],
    ["Une présentation peut être enregistrée en PDF.", true, "Fichier > Exporter > Créer un document PDF."],
    ["Il faut mettre le plus de texte possible sur chaque diapositive.", false, "Peu de texte, des mots-clés : on développe à l'oral."],
    ["Le SmartArt sert à faire des schémas.", true, "Processus, cycles, organigrammes…"],
    ["{Maj+F5} lance le diaporama à partir de la diapositive actuelle.", true, "Pratique pour vérifier une seule diapositive."]
  ],
  "internet": [
    ["Cci envoie une copie sans que les autres destinataires le voient.", true, "Cci : copie carbone invisible."],
    ["Une adresse mail contient toujours le signe @.", true, "Par exemple prenom.nom@exemple.fr."],
    ["Un moteur de recherche et un navigateur, c'est la même chose.", false, "Le navigateur (Edge, Chrome) ouvre les sites ; le moteur (Google, Qwant) les cherche."],
    ["L'objet d'un mail doit résumer le message.", true, "Le destinataire sait tout de suite de quoi il s'agit."],
    ["« https » avec un cadenas indique une connexion chiffrée.", true, "C'est nécessaire, mais cela ne prouve pas que le site est honnête."],
    ["On peut joindre un fichier à un mail.", true, "Avec le trombone : la pièce jointe."],
    ["Écrire tout en majuscules dans un mail, c'est comme crier.", true, "C'est une règle de la nétiquette."],
    ["Wikipédia est un moteur de recherche.", false, "C'est une encyclopédie en ligne."],
    ["Teams et Zoom servent aux réunions à distance.", true, "Avec la vidéo, le son et le partage d'écran."],
    ["« Répondre à tous » envoie la réponse seulement à l'expéditeur.", false, "Il l'envoie à tous les destinataires du mail."]
  ],
  "bonnes-pratiques": [
    ["Un bon mot de passe fait au moins 12 caractères.", true, "Avec des majuscules, des chiffres et des symboles."],
    ["On peut utiliser le même mot de passe partout.", false, "Si un site est piraté, tous vos comptes le sont."],
    ["Une banque peut vous demander votre code par mail.", false, "Jamais : c'est du phishing."],
    ["Les mises à jour corrigent des failles de sécurité.", true, "Installez-les dès qu'elles sont proposées."],
    ["Il faut verrouiller son ordinateur quand on s'absente.", true, "Windows + L."],
    ["Le phishing cherche à voler vos informations.", true, "Mots de passe, codes bancaires…"],
    ["Une information trouvée sur Internet est toujours vraie.", false, "Il faut vérifier la source et croiser les informations."],
    ["Un mail avec une grosse pièce jointe consomme de l'énergie.", true, "Préférez un lien de partage pour les gros fichiers."],
    ["Il faut cliquer vite sur un lien « urgent » reçu par mail.", false, "L'urgence est une ruse des pirates : on vérifie d'abord."],
    ["Sauvegarder ses fichiers sur un disque externe protège contre leur perte.", true, "En cas de panne ou de vol de l'ordinateur."]
  ]
};

const MOTS_MELES = {
  "ordinateur": ["CLAVIER", "SOURIS", "ECRAN", "IMPRIMANTE", "SCANNER", "WEBCAM", "PROCESSEUR", "MEMOIRE", "DISQUE", "CASQUE"],
  "windows": ["BUREAU", "FENETRE", "DEMARRER", "CORBEILLE", "ICONE", "PARAMETRES", "CAPTURE", "SESSION", "RACCOURCI", "VERROUILLER"],
  "fichiers": ["DOSSIER", "FICHIER", "EXTENSION", "RENOMMER", "COPIER", "COLLER", "DEPLACER", "COMPRESSER", "EXPLORATEUR", "CORBEILLE"],
  "office-commun": ["RUBAN", "ONGLET", "MODELE", "ENTETE", "ANNULER", "ENREGISTRER", "IMPRIMER", "FICHIER", "INSERTION", "ACCUEIL"],
  "word": ["POLICE", "GRAS", "ITALIQUE", "JUSTIFIER", "STYLE", "LETTRINE", "TABULATION", "PUCES", "MARGE", "SOULIGNE"],
  "excel": ["CELLULE", "COLONNE", "LIGNE", "FORMULE", "SOMME", "MOYENNE", "GRAPHIQUE", "FILTRE", "TRIER", "CLASSEUR"],
  "powerpoint": ["DIAPOSITIVE", "TRANSITION", "ANIMATION", "THEME", "MASQUE", "DIAPORAMA", "SMARTART", "NOTES", "DISPOSITION", "IMAGE"],
  "internet": ["NAVIGATEUR", "MESSAGERIE", "OBJET", "SIGNATURE", "LIEN", "MOTEUR", "ADRESSE", "REPONDRE", "TRANSFERER", "SITE"],
  "bonnes-pratiques": ["PHISHING", "SAUVEGARDE", "ANTIVIRUS", "VERROUILLER", "NETIQUETTE", "SECURITE", "VIRUS", "CLOUD", "PIRATE", "MISEAJOUR"]
};
