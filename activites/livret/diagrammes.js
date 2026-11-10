/*
  LES DIAGRAMMES À COMPLÉTER : une interface dessinée, des numéros posés sur ses zones,
  et des étiquettes à attribuer à chaque numéro.
  Chaque page déclare, juste avant ce fichier : <script>const PAGE = { diagramme: "word" };</script>
  Les zones : [numéro, gauche en %, haut en %, l'étiquette juste, une aide affichée après la correction]
*/
const DIAGRAMMES = (() => {
  const ruban = (couleur, onglets, groupes) => `
    <div class="d-onglets">${onglets.map((o, i) => `<span class="${i === 1 ? "actif" : ""}" style="${i === 1 ? `color:${couleur};border-color:${couleur}` : ""}">${o}</span>`).join("")}</div>
    <div class="d-ruban">${groupes.map(([nom, contenu]) => `<div class="d-groupe"><div class="d-gcont">${contenu}</div><small>${nom}</small></div>`).join("")}</div>`;
  const titre = (fond, texte, rapide = true) => `<div class="d-titre" style="background:${fond}">${rapide ? '<span class="d-rapide">💾 ↶ ↷</span>' : "<span></span>"}<span>${texte}</span><span class="d-fen">—&nbsp;&nbsp;▢&nbsp;&nbsp;✕</span></div>`;
  return {
    bureau: {
      titre: "Le Bureau de Windows 11", icone: "🪟",
      html: `<div class="d-ecran d-bureau">
        <div class="d-icones-bureau"><div>🗑️<small>Corbeille</small></div><div>💻<small>Ce PC</small></div><div>📁<small>Formation</small></div></div>
        <div class="d-barre-taches">
          <div class="d-centre"><span class="d-win">⊞</span><span class="d-rech">🔍 Rechercher</span><span>📁</span><span>🌐</span><span class="d-w">W</span></div>
          <div class="d-notif"><span>˄</span><span>📶</span><span>🔊</span><span class="d-heure">14:32<br>10/11/2026</span></div>
        </div></div>`,
      zones: [[1, 6, 14, "Les icônes du Bureau", "Elles ouvrent un dossier, un logiciel ou la Corbeille."], [2, 55, 42, "Le fond d'écran", "Il se change dans Paramètres > Personnalisation."],
        [3, 18, 95, "La barre des tâches", "La bande tout en bas de l'écran."], [4, 33, 95, "Le bouton Démarrer", "Il ouvre le menu Démarrer."],
        [5, 41, 88, "La zone de recherche", "Pour trouver un logiciel ou un fichier."], [6, 58, 88, "Les applications ouvertes ou épinglées", "Un clic les ouvre ou les affiche."],
        [7, 87, 88, "La zone de notification", "Wi-Fi, son, batterie, notifications."], [8, 93, 95, "La date et l'heure", "Un clic ouvre le calendrier."]]
    },
    explorateur: {
      titre: "L'Explorateur de fichiers", icone: "📁",
      html: `<div class="d-ecran d-fenetre">
        <div class="d-titre d-titre-ex"><span class="d-tab">📁 Documents&nbsp;&nbsp;✕</span><span>+</span><span class="d-fen">—&nbsp;&nbsp;▢&nbsp;&nbsp;✕</span></div>
        <div class="d-nav"><span class="d-fleches">← → ↑ ⟳</span><span class="d-adr">💻 &gt; Ce PC &gt; Documents</span><span class="d-rech2">🔍 Rechercher</span></div>
        <div class="d-cmd">⊕ Nouveau&nbsp;&nbsp; ✂ ⧉ 📋 ✎ 🗑&nbsp;&nbsp; ⇅ Trier&nbsp;&nbsp; ☰ Afficher&nbsp;&nbsp; ···</div>
        <div class="d-corps">
          <div class="d-volet"><div>🏠 Accueil</div><div>🖼️ Galerie</div><div>🖥️ Bureau</div><div>⬇️ Téléchargements</div><div class="sel">📄 Documents</div><div>🖼️ Images</div><div>💻 Ce PC</div></div>
          <div class="d-contenu"><div class="d-cols"><span>Nom</span><span>Modifié le</span><span>Type</span><span>Taille</span></div>
            ${[["📁 Factures", "02/11/2026", "Dossier", ""], ["📁 Formation", "05/11/2026", "Dossier", ""], ["📄 CV.docx", "06/11/2026", "Document Word", "24 Ko"], ["📊 Budget.xlsx", "07/11/2026", "Feuille Excel", "12 Ko"], ["📕 Attestation.pdf", "08/11/2026", "Document PDF", "88 Ko"], ["🖼️ Photo.jpg", "09/11/2026", "Fichier JPG", "1,2 Mo"]].map(l => `<div class="d-ligne">${l.map(c => `<span>${c}</span>`).join("")}</div>`).join("")}
            <div class="d-defil"><i></i></div></div>
        </div>
        <div class="d-etat">6 éléments</div></div>`,
      zones: [[1, 9, 4, "L'onglet du dossier ouvert", "Comme dans un navigateur, on peut ouvrir plusieurs onglets."], [2, 93, 4, "Les boutons Réduire, Agrandir et Fermer", "En haut à droite de chaque fenêtre."],
        [3, 6, 13, "Les boutons Précédent et Suivant", "Pour revenir au dossier d'avant."], [4, 30, 13, "La barre d'adresse", "Elle montre le chemin du dossier."],
        [5, 80, 13, "La zone de recherche", "Elle cherche dans le dossier ouvert."], [6, 40, 22, "La barre de commandes", "Nouveau, couper, copier, coller, renommer, trier, afficher."],
        [7, 10, 52, "Le volet de navigation", "Les raccourcis vers les dossiers et les disques."], [8, 58, 24.5, "Les en-têtes de colonnes", "Un clic trie les fichiers par nom, date, type ou taille."],
        [9, 55, 62, "La zone d'affichage", "Le contenu du dossier : fichiers et sous-dossiers."], [10, 98, 55, "La barre de défilement", "Elle fait monter ou descendre le contenu."],
        [11, 6, 97.5, "La barre d'état", "Le nombre d'éléments du dossier."]]
    },
    word: {
      titre: "La fenêtre de Word", icone: "📄",
      html: `<div class="d-ecran d-fenetre">${titre("#2b579a", "Document1 - Word")}
        ${ruban("#2b579a", ["Fichier", "Accueil", "Insertion", "Création", "Mise en page", "Références", "Publipostage", "Révision", "Affichage"],
          [["Presse-papiers", "📋 ✂ ⧉"], ["Police", "<span class='d-champ'>Calibri</span><span class='d-champ'>11</span> <b>G</b> <i>I</i> <u>S</u> <b style='color:#c00'>A</b>"], ["Paragraphe", "☰ ≡ ⫶ ¶"], ["Styles", "<span class='d-style'>AaBb Normal</span><span class='d-style'>AaBb Titre 1</span>"]])}
        <div class="d-zone-doc"><div class="d-regle-h">${Array.from({ length: 15 }, (_, i) => `<span>${i + 1}</span>`).join("")}</div><div class="d-regle-v"></div><div class="d-page"><b>Lettre de motivation</b><p>Madame, Monsieur,</p><p>Actuellement en formation, je souhaite rejoindre votre équipe…<span class="d-curseur"></span></p></div><div class="d-defil"><i></i></div></div>
        <div class="d-etat"><span>Page 1 sur 1&nbsp;&nbsp;&nbsp;125 mots&nbsp;&nbsp;&nbsp;Français (France)</span><span>📖 ▣ 🌐&nbsp;&nbsp; − ━━●━━ + 100 %</span></div></div>`,
      zones: [[1, 5, 4, "La barre d'accès rapide", "Enregistrer, annuler, rétablir en un clic."], [2, 50, 4, "La barre de titre", "Elle donne le nom du document."],
        [3, 22, 11, "Les onglets du ruban", "Fichier, Accueil, Insertion…"], [4, 85, 20, "Le ruban", "Tous les outils, rangés par groupes."],
        [5, 20, 19, "Le groupe Police", "Police, taille, gras, italique, souligné, couleur."], [6, ".d-regle-h", null, "La règle", "Pour régler les retraits et les tabulations."],
        [7, 50, 60, "La zone de saisie (la page)", "C'est là qu'on écrit le texte."], [8, 98, 60, "La barre de défilement", "Elle fait monter ou descendre la page."],
        [9, 12, 97.5, "La barre d'état", "Le numéro de la page, le nombre de mots, la langue."], [10, 92, 97.5, "Le zoom", "Il agrandit ou réduit l'affichage, sans changer le document."]]
    },
    excel: {
      titre: "La fenêtre d'Excel", icone: "📊",
      html: `<div class="d-ecran d-fenetre">${titre("#107c41", "Budget.xlsx - Excel")}
        ${ruban("#107c41", ["Fichier", "Accueil", "Insertion", "Mise en page", "Formules", "Données", "Révision", "Affichage"],
          [["Presse-papiers", "📋 ✂"], ["Police", "<span class='d-champ'>Aptos</span><b>G</b> <i>I</i>"], ["Alignement", "≡ ⧈"], ["Nombre", "€ % 000"], ["Styles", "▦ Mise en forme conditionnelle"]])}
        <div class="d-formule"><span class="d-nom">B3</span><span class="d-fx">✕ ✓ <i>fx</i></span><span class="d-saisie">=SOMME(B1:B2)</span></div>
        <div class="d-grille">
          <div class="d-g-ligne d-g-tete"><span></span>${"ABCDEFG".split("").map(c => `<span>${c}</span>`).join("")}</div>
          ${[["Loyer", "650"], ["Courses", "320"], ["Total", "970"], ["", ""], ["", ""], ["", ""], ["", ""]].map((l, i) => `<div class="d-g-ligne"><span class="d-g-num">${i + 1}</span><span>${l[0]}</span><span class="${i === 2 ? "d-active" : ""}">${l[1]}</span>${"<span></span>".repeat(5)}</div>`).join("")}
          <div class="d-defil"><i></i></div>
        </div>
        <div class="d-feuilles"><span class="actif">Feuil1</span><span>Feuil2</span><span>⊕</span><span class="d-defil-h"><i></i></span></div>
        <div class="d-etat"><span>Prêt</span><span>Somme : 970&nbsp;&nbsp; ▦ ▣&nbsp; − ━━●━━ + 100 %</span></div></div>`,
      zones: [[1, 22, 11, "Les onglets du ruban", "Accueil, Insertion, Formules, Données…"], [2, 85, 20, "Le ruban", "Tous les outils, rangés par groupes."],
        [3, 4, 28, "La zone Nom", "Elle donne l'adresse de la cellule sélectionnée."], [4, 40, 28, "La barre de formule", "Elle montre le contenu ou la formule de la cellule."],
        [5, 50, 33, "Les en-têtes de colonnes (lettres)", "A, B, C… : un clic sélectionne toute la colonne."], [6, 2, 60, "Les numéros de lignes", "1, 2, 3… : un clic sélectionne toute la ligne."],
        [7, 25, 52, "La cellule active", "Encadrée en vert : c'est elle qui reçoit la saisie."], [8, 98, 60, "La barre de défilement", "Elle fait défiler les lignes."],
        [9, 14, 92.7, "Les onglets des feuilles", "Un classeur peut contenir plusieurs feuilles."], [10, 6, 97.6, "La barre d'état", "Prêt, Saisie, et des calculs rapides sur la sélection."]]
    },
    powerpoint: {
      titre: "La fenêtre de PowerPoint", icone: "🎞️",
      html: `<div class="d-ecran d-fenetre">${titre("#c43e1c", "Présentation1 - PowerPoint")}
        ${ruban("#c43e1c", ["Fichier", "Accueil", "Insertion", "Création", "Transitions", "Animations", "Diaporama", "Révision", "Affichage"],
          [["Presse-papiers", "📋 ✂"], ["Diapositives", "➕ Nouvelle diapositive"], ["Police", "<b>G</b> <i>I</i> <u>S</u>"], ["Paragraphe", "☰ ≡"], ["Dessin", "◯ ▭ △"]])}
        <div class="d-ppt">
          <div class="d-miniatures"><div class="sel"><b>1</b><i></i></div><div><b>2</b><i></i></div><div><b>3</b><i></i></div></div>
          <div class="d-diapo-zone"><div class="d-diapo"><div class="d-place titre">Cliquez pour ajouter un titre</div><div class="d-place">Cliquez pour ajouter un sous-titre</div></div>
            <div class="d-notes">Cliquez pour ajouter des notes</div></div>
        </div>
        <div class="d-etat"><span>Diapositive 1 sur 3&nbsp;&nbsp;&nbsp;Français (France)</span><span>📝 Notes&nbsp; ▣ ⊞ 📖 <b class="d-show">▶︎</b>&nbsp; − ━━●━━ + 70 %</span></div></div>`,
      zones: [[1, 25, 11, "Les onglets du ruban", "Accueil, Insertion, Transitions, Animations…"], [2, 85, 20, "Le ruban", "Tous les outils, rangés par groupes."],
        [3, 8, 55, "Le volet des miniatures", "Toutes les diapositives en petit, pour s'y déplacer et les réorganiser."], [4, 56, 40, "La diapositive en cours", "La zone de travail : on y écrit et on y place les images."],
        [5, 56, 51, "La zone de titre", "Un clic dedans pour écrire le titre."], [6, 56, 86, "La zone des notes", "Ce que l'on veut dire à l'oral : le public ne la voit pas."],
        [7, 8, 97.6, "La barre d'état", "Le numéro de la diapositive affichée."], [8, 87.2, 97.6, "Le bouton Diaporama", "Il lance la présentation en plein écran."], [9, 93.5, 97.6, "Le zoom", "Il agrandit ou réduit l'affichage."]]
    },
    web: {
      titre: "Une page web dans le navigateur", icone: "🌐",
      html: `<div class="d-ecran d-fenetre d-web">
        <div class="d-titre d-titre-ex"><span class="d-tab">📚 Médiathèque - Accueil&nbsp;&nbsp;✕</span><span>+</span><span class="d-fen">—&nbsp;&nbsp;▢&nbsp;&nbsp;✕</span></div>
        <div class="d-nav"><span class="d-fleches">← → ⟳</span><span class="d-adr">🔒 https://www.mediatheque-exemple.fr/accueil</span><span class="d-fav">☆&nbsp;&nbsp; ···</span></div>
        <div class="d-favoris">⭐ Actualités&nbsp;&nbsp;&nbsp; ⭐ Météo&nbsp;&nbsp;&nbsp; ⭐ Messagerie</div>
        <div class="d-page-web">
          <div class="d-site-tete"><b>📚 Médiathèque</b><span class="d-menu">Accueil&nbsp;&nbsp; Catalogue&nbsp;&nbsp; Horaires&nbsp;&nbsp; Contact</span><span class="d-rech3">🔍 Chercher un livre</span></div>
          <div class="d-site-corps"><h4>Bienvenue à la médiathèque</h4><p>Plus de 20 000 livres, films et jeux à emprunter gratuitement. <a>Voir les horaires d'ouverture</a></p><div class="d-image">🖼️</div></div>
          <div class="d-site-pied">Mentions légales · Accessibilité · Contact</div>
          <div class="d-defil"><i></i></div>
        </div></div>`,
      zones: [[1, 12, 4, "L'onglet de la page", "On peut ouvrir plusieurs pages en même temps, dans plusieurs onglets."], [2, 3.2, 16.5, "Les boutons Précédent et Suivant", "Pour revenir à la page d'avant."],
        [3, 7.9, 16.5, "Le bouton Actualiser", "Il recharge la page."], [4, 35, 13, "La barre d'adresse", "On y tape l'adresse d'un site."],
        [5, 13, 16.5, "Le cadenas : connexion sécurisée", "La connexion est chiffrée (https)."], [6, 94, 15, "Ajouter aux favoris", "L'étoile garde l'adresse de la page."],
        [7, 20, 20, "La barre des favoris", "Les sites enregistrés, à portée de clic."], [8, 38, 30, "Le menu du site", "Les grandes rubriques du site."],
        [9, 85, 30, "La zone de recherche du site", "Elle cherche dans ce site seulement."], [10, 60, 44, "Un lien", "Souligné ou en couleur : un clic ouvre une autre page."],
        [11, 98, 60, "La barre de défilement", "Elle fait défiler la page."], [12, 45, 93, "Le pied de page", "Mentions légales, contact : en bas de chaque page."]]
    }
  };
})();

(() => {
  const D = DIAGRAMMES[PAGE.diagramme];
  const el = (tag, attrs = {}, ...enfants) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) { if (v == null || v === false) continue; if (k === "html") n.innerHTML = v; else if (k === "class") n.className = v; else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v); }
    enfants.flat().forEach(e => e != null && n.append(e));
    return n;
  };
  const melange = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  document.title = "Diagramme : " + D.titre;
  const zone = el("main", { class: "dg" });
  document.body.append(zone);

  function partie() {
    const choix = {}; // numéro -> étiquette
    let numero = null, etiquette = null, corrige = false;
    const schema = el("div", { class: "dg-schema", html: D.html });
    const marques = D.zones.map(([n, x, y]) => {
      const b = el("button", { class: "dg-num", type: "button", style: typeof x === "number" ? `left:${x}%;top:${y}%` : "", "aria-label": `Zone ${n}`, onclick: () => clicNumero(n) }, String(n));
      schema.append(b);
      return b;
    });
    // Les numéros posés sur un élément du dessin (sélecteur) suivent sa place, quelle que soit la largeur de l'écran.
    const placer = () => D.zones.forEach(([, x], i) => {
      if (typeof x === "number") return;
      const cible = schema.querySelector(x), a = schema.getBoundingClientRect(), c = cible.getBoundingClientRect();
      marques[i].style.left = ((c.left + c.width * .6 - a.left) / a.width * 100) + "%";
      marques[i].style.top = ((c.top + c.height / 2 - a.top) / a.height * 100) + "%";
    });
    requestAnimationFrame(placer);
    window.addEventListener("resize", placer);
    const etiquettes = el("div", { class: "dg-etiquettes", role: "group", "aria-label": "Les étiquettes" },
      melange(D.zones).map(([, , , nom]) => el("button", { class: "dg-eti", type: "button", "data-nom": nom, onclick: e => clicEtiquette(nom, e.currentTarget) }, nom)));
    const liste = el("ol", { class: "dg-liste" }, D.zones.map(([n]) => el("li", {}, el("button", { class: "dg-ligne", type: "button", "data-n": n, onclick: () => clicNumero(n) },
      el("b", {}, String(n)), el("span", {}, "—")))));
    const retour = el("p", { class: "dg-retour", role: "status" }, "Cliquez sur une étiquette, puis sur le numéro de la zone qui lui correspond.");
    const verifier = el("button", { class: "dg-btn fort", type: "button", disabled: true, onclick: corriger }, "Vérifier");
    const res = el("div", {});
    zone.replaceChildren(
      el("header", { class: "dg-tete" }, el("span", { class: "dg-ico", "aria-hidden": "true" }, D.icone), el("div", {}, el("small", {}, "Diagramme à compléter"), el("h1", {}, D.titre))),
      schema, retour, el("h2", {}, "Les étiquettes"), etiquettes,
      el("h2", {}, "Mes réponses"), liste, el("div", { class: "dg-actions" }, verifier, el("button", { class: "dg-btn", type: "button", onclick: partie }, "Tout effacer")), res);

    function surligner() {
      etiquettes.querySelectorAll(".dg-eti").forEach(b => { b.classList.toggle("choisie", b.dataset.nom === etiquette); b.classList.toggle("placee", Object.values(choix).includes(b.dataset.nom)); });
      marques.forEach((m, i) => { const n = D.zones[i][0]; m.classList.toggle("choisi", n === numero); m.classList.toggle("rempli", !!choix[n]); });
      liste.querySelectorAll(".dg-ligne").forEach(l => { const n = +l.dataset.n; l.classList.toggle("choisi", n === numero); l.querySelector("span").textContent = choix[n] || "—"; });
      verifier.disabled = Object.keys(choix).length < D.zones.length;
    }
    function placer(n, nom) {
      for (const k in choix) if (choix[k] === nom) delete choix[k];   // une étiquette ne sert qu'une fois
      choix[n] = nom; numero = null; etiquette = null;
      retour.textContent = Object.keys(choix).length < D.zones.length ? `Zone ${n} : ${nom}. Continuez !` : "Toutes les zones ont une étiquette : cliquez sur Vérifier.";
      surligner();
    }
    function clicEtiquette(nom) { if (corrige) return; if (numero) return placer(numero, nom); etiquette = etiquette === nom ? null : nom; retour.textContent = etiquette ? `« ${nom} » : cliquez maintenant sur le bon numéro.` : ""; surligner(); }
    function clicNumero(n) { if (corrige) return; if (etiquette) return placer(n, etiquette); numero = numero === n ? null : n; retour.textContent = numero ? `Zone ${n} : cliquez maintenant sur la bonne étiquette.` : ""; surligner(); }
    function corriger() {
      corrige = true;
      const detail = D.zones.map(([n, , , nom, aide]) => ({ q: `Zone ${n}`, ok: choix[n] === nom, donne: choix[n] || "rien", bonne: nom, e: aide }));
      D.zones.forEach(([n, , , nom], i) => {
        const ok = choix[n] === nom;
        marques[i].classList.add(ok ? "ok" : "ko");
        const l = liste.querySelector(`[data-n="${n}"]`);
        l.classList.add(ok ? "ok" : "ko");
        if (!ok) l.querySelector("span").innerHTML = `<s>${choix[n]}</s> → ${nom}`;
      });
      [...etiquettes.children, ...marques].forEach(b => b.disabled = true);
      verifier.remove();
      const score = detail.filter(x => x.ok).length;
      retour.textContent = score === D.zones.length ? "🌟 Tout est juste !" : "Les zones en rouge sont corrigées dans la liste.";
      ResultatActivite.terminer({ zone: res, titre: "Diagramme : " + D.titre, type: "Exercice", score, total: D.zones.length, detail, unite: "zones bien nommées" });
    }
  }
  partie();
})();
