/*
  LES SIMULATEURS DU LIVRET : petits Word, Excel, Explorateur, messagerie…
  Chacun s'utilise dans un cours avec { sim: "nom" }. Rien n'est envoyé sur Internet.
*/
const Simulations = (() => {
  const S = {};

  /* Suit une liste de missions et affiche où on en est. */
  function missions(liste, ctx, apres) {
    let i = 0;
    const zone = ctx.el("div", { class: "mission", role: "status" });
    const montre = () => {
      if (i < liste.length) {
        const t = liste[i].t || liste[i];
        zone.innerHTML = ctx.riche(`🎯 ${liste.length > 1 ? `Mission ${i + 1} / ${liste.length} : ` : "Mission : "}${t}`);
      } else {
        zone.className = "mission fini";
        zone.textContent = "🌟 Bravo, mission accomplie ! ⭐";
        ctx.reussi();
        if (apres) apres();
      }
    };
    montre();
    return {
      zone,
      get actuelle() { return liste[i]; },
      get index() { return i; },
      get finie() { return i >= liste.length; },
      suivante() { i++; montre(); }
    };
  }
  const memes = (a, b) => a.size === b.size && [...a].every(x => b.has(x));
  const retour = ctx => ctx.el("div", { class: "retour", role: "status" });
  function dire(z, classe, texte, ctx) { z.className = "retour " + classe; z.innerHTML = ctx.riche(texte); }

  /* ---------- Maquette d'une fenêtre : on explore puis on retrouve les zones ---------- */
  S.maquette = (r, o, ctx) => {
    const { el, melange } = ctx;
    const infos = el("div", { class: "maq-infos", role: "status", html: "Cliquez sur une zone pour découvrir à quoi elle sert." });
    let defi = null;
    const ratees = new Set();
    const mq = el("div", { class: "maq", style: `grid-template-columns:${o.colonnes};grid-template-rows:${o.lignes}` });
    const titre = el("div", { class: "mission", hidden: true, role: "status" });
    o.zones.forEach((z, i) => {
      const b = el("button", { class: "zone", type: "button", style: `grid-area:${z.aire}` });
      b.append(el("span", { html: z.nom }));
      b.addEventListener("click", () => {
        if (defi) {
          if (i === defi[0]) {
            b.classList.add("ok");
            b.firstChild.textContent = o.zones[i].nom;
            defi.shift();
            if (defi.length) montre(); else {
              defi = null;
              titre.className = "mission fini";
              titre.textContent = "🌟 Toutes les zones sont retrouvées ! ⭐";
              const detail = o.zones.map((z, n) => ({ q: z.nom, ok: !ratees.has(n), donne: ratees.has(n) ? "trouvée après une erreur" : "trouvée du premier coup" }));
              const score = detail.filter(x => x.ok).length;
              ctx.reussi({ type: "Retrouver les zones", score, total: o.zones.length, detail });
              infos.hidden = false;
              infos.replaceChildren(ctx.blocScore(score, o.zones.length));
              lancer.hidden = false;
              lancer.textContent = "Recommencer le défi";
            }
          } else {
            b.classList.add("ko");
            ratees.add(defi[0]);
            setTimeout(() => b.classList.remove("ko"), 600);
          }
          return;
        }
        [...mq.children].forEach(x => x.classList.remove("choisi"));
        b.classList.add("choisi");
        infos.innerHTML = ctx.riche(`<strong>${z.nom}</strong> : ${z.texte}`);
      });
      mq.append(b);
    });
    const noms = () => [...mq.children];
    function montre() { titre.innerHTML = ctx.riche(`🎯 Cliquez sur : <strong>${o.zones[defi[0]].nom}</strong>`); }
    const lancer = el("button", { class: "btn btn-petit", type: "button", onclick: () => {
      defi = melange(o.zones.map((z, i) => i));
      ratees.clear();
      noms().forEach((b, i) => {
        b.className = "zone";
        b.firstChild.textContent = "?";
      });
      titre.hidden = false;
      titre.className = "mission";
      infos.hidden = true;
      lancer.hidden = true;
      montre();
    } }, "🎯 Le défi : retrouver chaque zone");
    r.append(titre, mq, infos, el("div", { class: "barre-btn" }, lancer));
  };

  /* ---------- Modes d'affichage avec Windows + P ---------- */
  S.projection = (r, o, ctx) => {
    const { el } = ctx;
    const modes = [
      ["Écran du PC uniquement", "Seul l'écran principal reste actif.", ["allume", "eteint"], ["Écran 1", "Éteint"], false],
      ["Dupliquer", "Les deux écrans affichent la même image.", ["allume", "allume"], ["Même image", "Même image"], false],
      ["Étendre", "Les écrans forment un seul grand bureau.", ["allume gauche", "allume droite"], ["Grand bureau…", "…sur deux écrans"], true],
      ["Second écran uniquement", "Seul l'écran externe est utilisé.", ["eteint", "allume"], ["Éteint", "Écran 2"], false]
    ];
    const ecrans = el("div", { class: "ecrans" });
    const texte = el("p", { role: "status", style: "font-weight:700;text-align:center;margin:0" });
    const outils = el("div", { class: "sim-outils" }, el("span", { html: "{Windows+P} :" }));
    modes.forEach((m, i) => outils.append(el("button", { class: "outil", type: "button", onclick: () => choisir(i) }, m[0])));
    function choisir(i) {
      const m = modes[i];
      [...outils.querySelectorAll("button")].forEach((b, k) => b.setAttribute("aria-pressed", String(k === i)));
      ecrans.className = "ecrans" + (m[4] ? " colle" : "");
      ecrans.replaceChildren(el("div", { class: "mon " + m[2][0] }, m[3][0]), el("div", { class: "mon " + m[2][1] }, m[3][1]));
      texte.textContent = m[1];
    }
    outils.firstChild.innerHTML = ctx.riche("{Windows} + {P} :");
    choisir(0);
    r.append(outils, ecrans, texte);
  };

  /* ---------- Ancrer des fenêtres (Snap) ---------- */
  S.snap = (r, o, ctx) => {
    const { el } = ctx;
    const places = {
      "Moitié gauche": [0, 0, 50, 100], "Moitié droite": [50, 0, 50, 100], "Coin haut gauche": [0, 0, 50, 50], "Coin haut droit": [50, 0, 50, 50],
      "Coin bas gauche": [0, 50, 50, 50], "Coin bas droit": [50, 50, 50, 50], "Plein écran": [0, 0, 100, 100]
    };
    const fen = {
      Word: el("div", { class: "fen" }, "📄 Word"),
      Excel: el("div", { class: "fen" }, "📊 Excel")
    };
    const pos = { Word: null, Excel: null };
    const place = (n, p) => {
      const [x, y, w, h] = places[p];
      fen[n].style.cssText = `left:${x}%;top:${y}%;width:${w}%;height:${h}%`;
      pos[n] = p;
    };
    fen.Word.style.cssText = "left:9%;top:12%;width:42%;height:52%";
    fen.Excel.style.cssText = "left:36%;top:32%;width:42%;height:52%";
    let active = "Word";
    const m = missions([
      { t: "ancrez <strong>Word</strong> sur la moitié gauche de l'écran.", n: "Word", p: "Moitié gauche" },
      { t: "ancrez <strong>Excel</strong> sur la moitié droite.", n: "Excel", p: "Moitié droite" },
      { t: "passez <strong>Word</strong> dans le coin haut gauche.", n: "Word", p: "Coin haut gauche" }
    ], ctx);
    const choixF = el("div", { class: "sim-outils" }, el("span", { style: "font-weight:800" }, "Fenêtre :"));
    Object.keys(fen).forEach(n => choixF.append(el("button", { class: "outil", type: "button", "aria-pressed": String(n === active), "data-n": n, onclick: e => {
      active = n;
      choixF.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.n === n)));
    } }, n)));
    const dest = el("div", { class: "sim-outils" }, ...Object.keys(places).map(p => el("button", { class: "outil", type: "button", onclick: () => {
      place(active, p);
      const a = m.actuelle;
      if (a && a.n === active && a.p === p) m.suivante();
    } }, p)));
    r.append(m.zone, el("div", { class: "bureau-snap", role: "img", "aria-label": "Bureau avec les fenêtres Word et Excel" }, fen.Word, fen.Excel), el("div", { style: "height:10px" }), choixF, dest);
  };

  /* ---------- Sélection dans l'Explorateur : Maj et Ctrl pour de vrai ---------- */
  S.selection = (r, o, ctx) => {
    const { el } = ctx;
    const fichiers = ["Budget_2026.xlsx", "Compte_rendu.docx", "Facture_mars.pdf", "Lettre_client.docx", "Logo.png", "Photo_equipe.jpg", "Planning.xlsx", "Presentation.pptx"];
    const sel = new Set();
    let ancre = 0, ctrl = false, maj = false;
    const m = missions([
      { t: "sélectionnez seulement <strong>Facture_mars.pdf</strong> (un simple clic).", attendu: [2] },
      { t: "sélectionnez les fichiers qui se suivent, de <strong>Compte_rendu</strong> à <strong>Logo</strong> : clic sur le premier, {Maj} enfoncée, clic sur le dernier.", attendu: [1, 2, 3, 4] },
      { t: "sélectionnez <strong>Budget</strong>, <strong>Logo</strong> et <strong>Planning</strong>, qui ne se suivent pas : {Ctrl} enfoncée et un clic sur chacun.", attendu: [0, 4, 6] }
    ], ctx);
    const liste = el("div", { class: "expl" }, el("div", { class: "expl-tete" }, "📁 Documents > Formation"));
    const compte = el("p", { role: "status", style: "margin:7px 0 0;font-weight:700;font-size:.92rem" }, "0 élément sélectionné");
    const boutons = fichiers.map((f, i) => {
      const b = el("button", { class: "elem", type: "button", "aria-pressed": "false" }, el("span", { "aria-hidden": "true" }, "📄"), el("span", {}, f));
      b.addEventListener("click", e => {
        const avecMaj = e.shiftKey || maj, avecCtrl = e.ctrlKey || e.metaKey || ctrl;
        if (avecMaj) {
          sel.clear();
          for (let k = Math.min(ancre, i); k <= Math.max(ancre, i); k++) sel.add(k);
        } else if (avecCtrl) {
          sel.has(i) ? sel.delete(i) : sel.add(i);
          ancre = i;
        } else {
          sel.clear();
          sel.add(i);
          ancre = i;
        }
        maj_();
      });
      liste.append(b);
      return b;
    });
    function maj_() {
      boutons.forEach((b, i) => {
        b.classList.toggle("sel", sel.has(i));
        b.setAttribute("aria-pressed", String(sel.has(i)));
      });
      compte.textContent = sel.size > 1 ? `${sel.size} éléments sélectionnés` : `${sel.size} élément sélectionné`;
      const a = m.actuelle;
      if (a && memes(sel, new Set(a.attendu))) {
        m.suivante();
        sel.clear();
        setTimeout(maj_, 700);
      }
    }
    const tMaj = el("button", { class: "outil", type: "button", "aria-pressed": "false", onclick: () => { maj = !maj; ctrl = false; touches(); } }, "Maj enfoncée");
    const tCtrl = el("button", { class: "outil", type: "button", "aria-pressed": "false", onclick: () => { ctrl = !ctrl; maj = false; touches(); } }, "Ctrl enfoncée");
    function touches() { tMaj.setAttribute("aria-pressed", String(maj)); tCtrl.setAttribute("aria-pressed", String(ctrl)); }
    r.append(m.zone, liste, compte,
      el("p", { style: "margin:9px 0 5px;font-size:.92rem", html: "Utilisez les vraies touches de votre clavier. Sur tablette, ces boutons les remplacent :" }),
      el("div", { class: "sim-outils" }, tMaj, tCtrl));
  };

  /* ---------- Modes d'affichage de l'Explorateur ---------- */
  S.affichages = (r, o, ctx) => {
    const { el } = ctx;
    const f = [
      ["📁", "00-DIRECTION", "08/05/2026 15:50", "Dossier de fichiers", ""],
      ["📁", "01_RH_ET_SOCIAL", "08/05/2026 15:57", "Dossier de fichiers", ""],
      ["📊", "Budget_Agence_2026.xlsx", "12/05/2026 09:10", "Feuille Excel", "28 Ko"],
      ["📄", "Compte_rendu_mai.docx", "14/05/2026 11:02", "Document Word", "54 Ko"],
      ["🖼️", "Logo_Principal.png", "02/05/2026 16:40", "Image PNG", "212 Ko"],
      ["📕", "Facture_2026-05.pdf", "20/05/2026 08:30", "Document PDF", "96 Ko"]
    ];
    const vues = {
      "Grandes icônes": ["Des vignettes en grille. La taille se règle : très grandes, grandes, moyennes ou petites.", () => el("div", { class: "vues-icones grand" }, ...f.map(x => el("div", {}, el("b", {}, x[0]), x[1])))],
      "Petites icônes": ["La même grille, avec des icônes plus petites : plus de fichiers tiennent à l'écran.", () => el("div", { class: "vues-icones" }, ...f.map(x => el("div", {}, el("b", {}, x[0]), x[1])))],
      "Liste": ["Des colonnes compactes avec de petites icônes. Pratique pour parcourir beaucoup de fichiers.", () => el("div", { class: "vues-liste" }, ...f.map(x => el("div", {}, `${x[0]} ${x[1]}`)))],
      "Détails": ["Nom, date, type et taille en colonnes. Idéal pour trier et comparer les fichiers.", () => el("div", { class: "defile-x" }, el("table", { class: "mini-t" },
        el("thead", {}, el("tr", {}, ...["Nom", "Modifié le", "Type", "Taille"].map(t => el("th", {}, t)))),
        el("tbody", {}, ...f.map(x => el("tr", {}, el("td", {}, `${x[0]} ${x[1]}`), el("td", {}, x[2]), el("td", {}, x[3]), el("td", {}, x[4]))))))],
      "Mosaïques": ["Une icône moyenne avec le nom. Bon compromis entre lisibilité et densité d'information.", () => el("div", { class: "vues-mosa" }, ...f.map(x => el("div", {}, el("b", {}, x[0]), el("span", {}, x[1]))))],
      "Contenu": ["Chaque élément sur une ligne, avec des informations. Un aperçu rapide sans ouvrir le fichier.", () => el("div", { class: "vues-cont" }, ...f.map(x => el("div", {}, el("b", {}, x[0]), el("span", {}, x[1], el("small", {}, `${x[3]} · ${x[2]}`)))))]
    };
    const zone = el("div", { class: "expl" });
    const texte = el("p", { role: "status", style: "margin:8px 0 0;font-weight:700" });
    const outils = el("div", { class: "sim-outils" }, ...Object.keys(vues).map(n => el("button", { class: "outil", type: "button", "data-n": n, onclick: () => choisir(n) }, n)));
    function choisir(n) {
      outils.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.n === n)));
      zone.replaceChildren(el("div", { class: "expl-tete" }, "📁 ENTREPRISE_LUMINA_DESIGN"), vues[n][1]());
      texte.textContent = vues[n][0];
    }
    choisir("Grandes icônes");
    r.append(outils, zone, texte);
  };

  /* ---------- Arborescence : on ouvre les dossiers et le chemin s'écrit ---------- */
  S.arborescence = (r, o, ctx) => {
    const { el } = ctx;
    const arbre = { n: "Disque dur (C:)", i: "💽", e: [
      { n: "Programmes", i: "📁", e: [{ n: "Microsoft Office", i: "📁", e: [{ n: "WINWORD.EXE", i: "⚙️" }] }] },
      { n: "Utilisateurs", i: "📁", e: [{ n: "Documents", i: "📁", e: [
        { n: "Travail", i: "📁", e: [{ n: "Rapport_2024.docx", i: "📄" }, { n: "Budget_2024.xlsx", i: "📊" }] },
        { n: "Fichier.docx", i: "📄" }
      ] }, { n: "Images", i: "📁", e: [{ n: "Photo.jpg", i: "🖼️" }] }] }
    ] };
    const m = missions([
      { t: "ouvrez les dossiers pour trouver <strong>Rapport_2024.docx</strong>.", n: "Rapport_2024.docx" },
      { t: "trouvez maintenant <strong>Photo.jpg</strong>.", n: "Photo.jpg" }
    ], ctx);
    const chemin = el("div", { class: "expl-tete", role: "status" }, "C:\\");
    const ouverts = new Set(["Disque dur (C:)"]);
    let actif = null;
    const zone = el("div", { style: "padding:8px" });
    function rendu(noeud, parents) {
      const li = el("li");
      const cheminN = [...parents, noeud.n];
      const b = el("button", { type: "button", class: actif === noeud.n ? "sel" : "", "aria-expanded": noeud.e ? String(ouverts.has(noeud.n)) : null, onclick: () => {
        actif = noeud.n;
        if (noeud.e) ouverts.has(noeud.n) ? ouverts.delete(noeud.n) : ouverts.add(noeud.n);
        chemin.textContent = "C:\\" + cheminN.slice(1).join("\\");
        if (m.actuelle && m.actuelle.n === noeud.n) m.suivante();
        dessine();
      } }, el("span", { "aria-hidden": "true" }, noeud.e ? (ouverts.has(noeud.n) ? "📂" : noeud.i) : noeud.i), noeud.n);
      li.append(b);
      if (noeud.e && ouverts.has(noeud.n)) li.append(el("ul", { class: "arbre" }, ...noeud.e.map(x => rendu(x, cheminN))));
      return li;
    }
    function dessine() { zone.replaceChildren(el("ul", { class: "arbre racine" }, rendu(arbre, []))); }
    dessine();
    r.append(m.zone, el("div", { class: "expl" }, chemin, zone));
  };

  /* ---------- Déplacer ou copier : voir la différence ---------- */
  S.deplacer = (r, o, ctx) => {
    const { el } = ctx;
    let A = ["rapport.docx", "photo.jpg", "budget.xlsx"], B = [];
    let sel = null, presse = null, histo = [];
    const m = missions([
      { t: "<strong>copiez</strong> rapport.docx dans Archives : il doit exister aux deux endroits.", ok: () => A.includes("rapport.docx") && B.includes("rapport.docx") },
      { t: "<strong>déplacez</strong> photo.jpg dans Archives : il ne doit rester qu'à un seul endroit.", ok: () => !A.includes("photo.jpg") && B.includes("photo.jpg") }
    ], ctx);
    const info = retour(ctx);
    const boiteA = el("div", { class: "dossier-boite" }), boiteB = el("div", { class: "dossier-boite" });
    let dest = "A";
    function fichier(f, d) {
      return el("button", { class: "fichier-v" + (sel && sel.f === f && sel.d === d ? " sel" : "") + (presse && presse.type === "x" && presse.f === f && presse.d === d ? " coupe" : ""), type: "button", onclick: () => { sel = { f, d }; dessine(); } }, "📄 " + f);
    }
    function dessine() {
      boiteA.replaceChildren(el("h4", {}, "📁 Documents"), ...A.map(f => fichier(f, "A")));
      boiteB.replaceChildren(el("h4", {}, "📁 Archives"), ...B.map(f => fichier(f, "B")));
      if (!B.length) boiteB.append(el("small", {}, "(dossier vide)"));
    }
    const action = (type) => {
      if (!sel) return dire(info, "ko", "Sélectionnez d'abord un fichier.", ctx);
      presse = { type, f: sel.f, d: sel.d };
      dire(info, "info", type === "x" ? `{Ctrl+X} : ${sel.f} est coupé. Il attend d'être collé.` : `{Ctrl+C} : ${sel.f} est copié. L'original ne bouge pas.`, ctx);
      dessine();
    };
    const coller = () => {
      if (!presse) return dire(info, "ko", "Rien à coller : utilisez d'abord {Ctrl+C} ou {Ctrl+X}.", ctx);
      const cible = presse.d === "A" ? B : A, source = presse.d === "A" ? A : B;
      if (cible.includes(presse.f)) return dire(info, "ko", "Ce fichier est déjà dans ce dossier.", ctx);
      histo.push([A.slice(), B.slice()]);
      cible.push(presse.f);
      if (presse.type === "x") {
        source.splice(source.indexOf(presse.f), 1);
        dire(info, "info", `Déplacé : ${presse.f} n'existe plus qu'à un seul endroit.`, ctx);
      } else dire(info, "info", `Copié : ${presse.f} existe maintenant en deux exemplaires.`, ctx);
      presse = null; sel = null;
      if (m.actuelle && m.actuelle.ok()) m.suivante();
      dessine();
    };
    const outils = el("div", { class: "sim-outils" },
      el("button", { class: "outil", type: "button", onclick: () => action("c"), html: "{Ctrl+C} Copier" }),
      el("button", { class: "outil", type: "button", onclick: () => action("x"), html: "{Ctrl+X} Couper" }),
      el("button", { class: "outil", type: "button", onclick: coller, html: "{Ctrl+V} Coller dans l'autre dossier" }),
      el("button", { class: "outil", type: "button", onclick: () => {
        if (!histo.length) return dire(info, "ko", "Rien à annuler.", ctx);
        [A, B] = histo.pop();
        dire(info, "info", "{Ctrl+Z} : la dernière action est annulée.", ctx);
        dessine();
      }, html: "{Ctrl+Z} Annuler" }));
    dessine();
    r.append(m.zone, el("div", { class: "deux-dossiers" }, boiteA, boiteB), outils, info);
  };

  /* ---------- Nommer ses fichiers : les règles se vérifient en direct ---------- */
  S.nommage = (r, o, ctx) => {
    const { el } = ctx;
    const cas = [
      { nom: "rapport final.xlsx", ctx: "un rapport de ventes de mai 2024", ext: ".xlsx", ex: "Rapport_Ventes_2024-05.xlsx" },
      { nom: "mon cv copie.docx", ctx: "le CV de Jean Martin", ext: ".docx", ex: "CV_Martin_Jean.docx" },
      { nom: "facture été.pdf", ctx: "une facture du client Alpha, mai 2024", ext: ".pdf", ex: "Facture_ClientAlpha_2024-05.pdf" }
    ];
    const m = missions(cas.map(c => ({ t: `renommez « ${c.nom} » : c'est ${c.ctx}.`, c })), ctx, () => { saisie.disabled = true; valider.disabled = true; });
    const saisie = el("input", { type: "text", autocomplete: "off", spellcheck: "false", "aria-label": "Nouveau nom du fichier", style: "flex:1 1 220px", value: cas[0].nom });
    const regles = [
      ["Pas d'espace", v => !/\s/.test(v)],
      ["Pas d'accent", v => v === v.normalize("NFD").replace(/[̀-ͯ]/g, "") && !/[çœæ]/i.test(v)],
      ["Une structure claire : au moins deux parties reliées par _", (v, c) => v.replace(c.ext, "").split("_").filter(x => x.length > 1).length >= 2],
      ["L'extension est conservée", (v, c) => v.toLowerCase().endsWith(c.ext)],
      ["Pas de nom vague (nouveau, final, copie, document1)", v => !/(nouveau|final|copie|document\d*)/i.test(v)]
    ];
    const ul = el("ul", { class: "regles" });
    const info = retour(ctx);
    const verifie = () => {
      const c = m.actuelle && m.actuelle.c;
      if (!c) return false;
      const res = regles.map(([t, f]) => f(saisie.value.trim(), c));
      ul.replaceChildren(...regles.map(([t], i) => el("li", { class: res[i] ? "ok" : "ko" }, t)));
      return res.every(Boolean);
    };
    saisie.addEventListener("input", () => { verifie(); info.className = "retour"; info.textContent = ""; });
    const valider = el("button", { class: "btn btn-petit", type: "button" }, "Renommer ({F2})");
    valider.innerHTML = ctx.riche("Renommer {F2}");
    const envoi = () => {
      if (verifie()) {
        const c = m.actuelle.c;
        dire(info, "ok", `Parfait ! Autre exemple possible : ${c.ex}`, ctx);
        m.suivante();
        if (m.actuelle) { saisie.value = m.actuelle.c.nom; verifie(); }
      } else {
        const c = m.actuelle.c;
        dire(info, "ko", `Pas encore : regardez les règles en rouge. Exemple de modèle : Contenu_Contexte_Date${c.ext}`, ctx);
      }
    };
    valider.addEventListener("click", envoi);
    saisie.addEventListener("keydown", e => { if (e.key === "Enter") envoi(); });
    verifie();
    r.append(m.zone, el("div", { class: "sim-outils" }, saisie, valider), ul, info);
  };

  /* ---------- Word : sélectionner avec la marge ---------- */
  S["word-selection"] = (r, o, ctx) => {
    const { el } = ctx;
    const paras = [
      ["La bureautique regroupe les outils", "qui servent à produire des documents."],
      ["Word permet de rédiger des lettres", "et de mettre en forme des rapports."]
    ];
    const m = missions([
      { t: "sélectionnez une <strong>ligne entière</strong> : 1 clic dans la marge, à gauche du texte.", type: "ligne" },
      { t: "sélectionnez un <strong>paragraphe entier</strong> : double-clic dans la marge.", type: "para" },
      { t: "sélectionnez <strong>tout le document</strong> : triple-clic dans la marge.", type: "doc" },
      { t: "sélectionnez un seul <strong>mot</strong> : double-clic sur ce mot.", type: "mot" }
    ], ctx);
    const doc = el("div", { class: "doc" });
    const info = el("p", { role: "status", style: "margin:7px 0 0;font-weight:700;font-size:.95rem" }, "Rien n'est sélectionné.");
    const lignes = [];
    function efface() { doc.querySelectorAll(".sel").forEach(x => x.classList.remove("sel")); }
    function marque(type, nom) {
      info.textContent = "Sélectionné : " + nom;
      if (m.actuelle && m.actuelle.type === type) m.suivante();
    }
    function clicMarge(p, l, n) {
      efface();
      if (n >= 3) { lignes.forEach(x => x.t.classList.add("sel")); marque("doc", "tout le document"); }
      else if (n === 2) { lignes.filter(x => x.p === p).forEach(x => x.t.classList.add("sel")); marque("para", "le paragraphe"); }
      else { lignes.find(x => x.p === p && x.l === l).t.classList.add("sel"); marque("ligne", "la ligne"); }
    }
    paras.forEach((para, p) => {
      const bloc = el("div", { class: "doc-para" });
      para.forEach((txt, l) => {
        const t = el("div", { class: "doc-txt" });
        txt.split(" ").forEach((mot, i) => {
          const s = el("span", {}, mot);
          s.addEventListener("click", e => {
            if (e.detail === 2) { efface(); s.classList.add("sel"); marque("mot", `le mot « ${mot} »`); }
            else if (e.detail >= 3) { efface(); lignes.filter(x => x.p === p).forEach(x => x.t.classList.add("sel")); info.textContent = "Sélectionné : le paragraphe"; }
          });
          t.append(s, " ");
        });
        const mg = el("button", { class: "doc-marge", type: "button", "aria-label": `Marge, ligne ${l + 1} du paragraphe ${p + 1}` }, "⇗");
        mg.addEventListener("click", e => clicMarge(p, l, e.ctrlKey ? 3 : (e.detail || nbClavier)));
        lignes.push({ p, l, t });
        bloc.append(el("div", { class: "doc-ligne" }, mg, t));
      });
      doc.append(bloc);
    });
    let nbClavier = 1;
    const alt = el("div", { class: "sim-outils", style: "margin-top:9px" },
      el("span", { style: "font-size:.9rem;font-weight:700" }, "Sans souris, avec Tab puis Entrée dans la marge :"),
      ...[[1, "1 clic"], [2, "Double-clic"], [3, "Triple-clic"]].map(([n, t]) => el("button", { class: "outil btn-petit", type: "button", "aria-pressed": String(n === 1), "data-n": n, onclick: e => {
        nbClavier = n;
        alt.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.n === n)));
      } }, t)));
    r.append(m.zone, doc, info, alt);
  };

  /* ---------- Word : mettre en forme ---------- */
  S["word-forme"] = (r, o, ctx) => {
    const { el } = ctx;
    const lignes = [
      { t: "Compte rendu de réunion", g: false, i: false, s: false, taille: 12, al: "left" },
      { t: "La réunion s'est tenue lundi matin avec toute l'équipe du service.", g: false, i: false, s: false, taille: 12, al: "left" },
      { t: "Prochaine réunion : vendredi à 10 h.", g: false, i: false, s: false, taille: 12, al: "left" }
    ];
    let actif = 0;
    const m = missions([
      { t: "mettez le <strong>titre</strong> (1ʳᵉ ligne) en <strong>gras</strong>, <strong>taille 16</strong>.", ok: () => lignes[0].g && lignes[0].taille === 16 },
      { t: "<strong>centrez</strong> le titre.", ok: () => lignes[0].al === "center" },
      { t: "<strong>justifiez</strong> la 2ᵉ ligne.", ok: () => lignes[1].al === "justify" },
      { t: "mettez la dernière ligne en <strong>italique</strong>.", ok: () => lignes[2].i }
    ], ctx);
    const zone = el("div", { class: "doc lignes-f", style: "padding:8px" });
    function dessine() {
      zone.replaceChildren(...lignes.map((l, i) => el("button", { type: "button", class: i === actif ? "sel" : "", "aria-pressed": String(i === actif),
        style: `font-weight:${l.g ? 800 : 500};font-style:${l.i ? "italic" : "normal"};text-decoration:${l.s ? "underline" : "none"};font-size:${l.taille / 12}em;text-align:${l.al}`,
        onclick: () => { actif = i; dessine(); } }, l.t)));
    }
    const ch = fn => () => {
      fn(lignes[actif]);
      dessine();
      while (m.actuelle && m.actuelle.ok()) m.suivante();
    };
    const taille = el("select", { "aria-label": "Taille de police", onchange: e => ch(l => l.taille = +e.target.value)() }, ...[11, 12, 14, 16].map(n => el("option", { value: n, selected: n === 12 }, String(n))));
    const outils = el("div", { class: "sim-outils" },
      el("button", { class: "outil", type: "button", title: "Gras (Ctrl+G)", onclick: ch(l => l.g = !l.g) }, el("b", {}, "G")),
      el("button", { class: "outil", type: "button", title: "Italique (Ctrl+I)", onclick: ch(l => l.i = !l.i) }, el("i", {}, "I")),
      el("button", { class: "outil", type: "button", title: "Souligné (Ctrl+U)", onclick: ch(l => l.s = !l.s) }, el("u", {}, "S")),
      taille,
      ...[["left", "Gauche"], ["center", "Centré"], ["right", "Droite"], ["justify", "Justifié"]].map(([a, t]) => el("button", { class: "outil", type: "button", onclick: ch(l => l.al = a) }, t)));
    dessine();
    r.append(m.zone, outils, zone, el("p", { style: "margin:7px 0 0;font-size:.92rem", html: "Cliquez d'abord sur la ligne à modifier, puis sur un outil." }));
  };

  /* ---------- Word : les styles et la table des matières ---------- */
  S["word-styles"] = (r, o, ctx) => {
    const { el } = ctx;
    const lignes = [
      { t: "1. Présentation de la société", a: "T1", s: "N" },
      { t: "Alpha Services accompagne les PME depuis dix ans.", a: "N", s: "N" },
      { t: "1.1 Les chiffres clés", a: "T2", s: "N" },
      { t: "Le chiffre d'affaires a progressé en 2024.", a: "N", s: "N" },
      { t: "2. Les perspectives", a: "T1", s: "N" },
      { t: "2.1 Les nouveaux marchés", a: "T2", s: "N" }
    ];
    let actif = 0, couleur = "#17324d", tdm = false, perime = false;
    const noms = { T1: "Titre 1", T2: "Titre 2", N: "Normal" };
    const info = retour(ctx);
    const m = missions([
      { t: "appliquez <strong>Titre 1</strong> aux titres de parties, <strong>Titre 2</strong> aux sous-titres. Le reste reste en Normal.", ok: () => lignes.every(l => l.a === l.s) },
      { t: "changez la couleur du style <strong>Titre 1</strong> : tous les titres changent d'un coup.", ok: () => couleur !== "#17324d" },
      { t: "insérez la <strong>table des matières</strong> automatique (onglet Références).", ok: () => tdm },
      { t: "ajoutez une partie au document, puis <strong>mettez à jour</strong> la table.", ok: () => tdm && !perime && lignes.length > 6 }
    ], ctx);
    const zone = el("div", { class: "doc lignes-f", style: "padding:8px" });
    const table = el("div");
    function dessine() {
      zone.replaceChildren(...lignes.map((l, i) => el("button", { type: "button", class: (i === actif ? "sel " : "") + (l.s === "T1" ? "st-t1" : l.s === "T2" ? "st-t2" : ""), style: l.s === "T1" ? `color:${couleur}` : "", "aria-pressed": String(i === actif), onclick: () => { actif = i; dessine(); } }, l.t)));
      table.replaceChildren();
      if (tdm) {
        const titres = (table.dataset.ok ? JSON.parse(table.dataset.ok) : []);
        table.append(el("div", { class: "tdm" }, el("strong", {}, "Table des matières"), ...titres.map(([t, s]) => el("div", { class: s === "T2" ? "n2" : "" }, `${t} ........ ${titres.findIndex(x => x[0] === t) + 1}`)),
          perime ? el("p", { style: "margin:5px 0 0;color:#8c1d13;font-weight:800" }, "⚠ Le document a changé : la table n'est plus à jour.") : null));
      }
    }
    const fixeTdm = () => { table.dataset.ok = JSON.stringify(lignes.filter(l => l.s !== "N").map(l => [l.t, l.s])); };
    const verif = () => { while (m.actuelle && m.actuelle.ok()) m.suivante(); };
    const styles = el("div", { class: "sim-outils" }, ...Object.entries(noms).map(([k, n]) => el("button", { class: "outil", type: "button", onclick: () => { lignes[actif].s = k; dessine(); verif(); } }, n)));
    const autres = el("div", { class: "sim-outils" },
      el("button", { class: "outil", type: "button", onclick: () => { couleur = couleur === "#17324d" ? "#b42318" : couleur === "#b42318" ? "#0b7285" : "#b42318"; dessine(); verif(); } }, "🎨 Modifier le style Titre 1"),
      el("button", { class: "outil", type: "button", onclick: () => {
        if (!lignes.some(l => l.s === "T1")) return dire(info, "ko", "Word ne trouve aucun titre : appliquez d'abord les styles de titre.", ctx);
        tdm = true; perime = false; fixeTdm(); info.className = "retour"; info.textContent = ""; dessine(); verif();
      } }, "📑 Insérer la table des matières"),
      el("button", { class: "outil", type: "button", onclick: () => {
        if (lignes.length > 6) return dire(info, "info", "La partie 3 est déjà ajoutée.", ctx);
        lignes.push({ t: "3. La conclusion", a: "T1", s: "T1" });
        perime = tdm;
        dessine();
      } }, "➕ Ajouter une partie"),
      el("button", { class: "outil", type: "button", onclick: () => {
        if (!tdm) return dire(info, "ko", "Insérez d'abord la table des matières.", ctx);
        perime = false; fixeTdm(); dessine(); verif();
      } }, "🔄 Mettre à jour la table"));
    dessine();
    r.append(m.zone, el("p", { style: "margin:0 0 7px;font-size:.92rem" }, "Cliquez sur une ligne, puis sur un style :"), styles, zone, el("div", { style: "height:9px" }), autres, table, info);
  };

  /* ---------- Word : le publipostage ---------- */
  S.publipostage = (r, o, ctx) => {
    const { el } = ctx;
    const gens = [
      { Prénom: "Alice", Nom: "Durand", Ville: "Lyon" },
      { Prénom: "Karim", Nom: "Benali", Ville: "Lille" },
      { Prénom: "Marie", Nom: "Petit", Ville: "Nantes" }
    ];
    const ordre = ["Prénom", "Nom", "Ville"];
    let places = 0, apercu = false, i = 0, fusion = false;
    const m = missions([
      { t: "cliquez sur les champs dans l'ordre pour remplir la lettre : <strong>Prénom</strong>, <strong>Nom</strong>, <strong>Ville</strong>.", ok: () => places === 3 },
      { t: "activez <strong>Aperçu des résultats</strong> et regardez chaque destinataire.", ok: () => apercu },
      { t: "cliquez sur <strong>Terminer &amp; fusionner</strong>.", ok: () => fusion }
    ], ctx);
    const lettre = el("div", { class: "lettre" });
    const info = retour(ctx);
    const champ = (nom, p, g = gens[i]) => {
      if (p >= places) return el("span", { class: "champ-vide" }, "?");
      return apercu ? el("span", { class: "champ-v" }, g[nom]) : el("span", { class: "champ-f" }, `«${nom}»`);
    };
    const texte = g => [ "Bonjour ", champ("Prénom", 0, g), " ", champ("Nom", 1, g), ",", el("br"), "Vous êtes convoqué(e) à la réunion du 12 mars, à ", champ("Ville", 2, g), ".", el("br"), "Cordialement." ];
    const barre = el("div", { class: "sim-outils" });
    function dessine() {
      if (fusion) {
        lettre.className = "";
        lettre.replaceChildren(...gens.map(g => el("div", { class: "lettre", style: "margin-bottom:7px" }, ...texte(g))));
        barre.replaceChildren();
        info.className = "retour ok";
        info.textContent = "1 lettre type + 1 liste de 3 personnes = 3 courriers personnalisés.";
        return;
      }
      lettre.replaceChildren(...texte());
      barre.replaceChildren(
        ...ordre.map((n, k) => el("button", { class: "outil", type: "button", disabled: places > k, onclick: () => {
          if (k === places) { places++; info.className = "retour"; info.textContent = ""; }
          else dire(info, "ko", `Dans cette lettre, le champ suivant est «${ordre[places]}».`, ctx);
          verif();
        } }, `«${n}»`)),
        el("button", { class: "outil", type: "button", "aria-pressed": String(apercu), onclick: () => {
          if (places < 3) return dire(info, "ko", "Insérez d'abord tous les champs.", ctx);
          apercu = !apercu; verif();
        } }, "👁 Aperçu des résultats"),
        apercu ? el("button", { class: "outil", type: "button", "aria-label": "Destinataire précédent", onclick: () => { i = (i + gens.length - 1) % gens.length; dessine(); } }, "◀") : null,
        apercu ? el("span", { style: "font-weight:800" }, `${i + 1} / ${gens.length}`) : null,
        apercu ? el("button", { class: "outil", type: "button", "aria-label": "Destinataire suivant", onclick: () => { i = (i + 1) % gens.length; dessine(); } }, "▶") : null,
        el("button", { class: "outil", type: "button", onclick: () => {
          if (!apercu) return dire(info, "ko", "Toujours prévisualiser avant de fusionner !", ctx);
          fusion = true; verif();
        } }, "✅ Terminer & fusionner"));
    }
    function verif() { while (m.actuelle && m.actuelle.ok()) m.suivante(); dessine(); }
    const source = el("div", { class: "defile-x", style: "margin-bottom:9px" }, el("table", { class: "mini-t" },
      el("thead", {}, el("tr", {}, ...ordre.map(n => el("th", {}, n)))),
      el("tbody", {}, ...gens.map(g => el("tr", {}, ...ordre.map(n => el("td", {}, g[n])))))));
    dessine();
    r.append(m.zone, el("strong", {}, "📊 La source de données (Excel)"), source, barre, el("strong", {}, "📄 Le document principal (Word)"), lettre, info);
  };

  /* ---------- Excel : le calcul des formules ---------- */
  const LETTRES = "ABCDEFGHIJ";
  function evalue(source, cellule, noms = {}) {
    const txt = source.replace(/^=/, "");
    const reg = /\s*("(?:[^"])*"|\$?[A-Za-z]{1,2}\$?\d+|\$?[A-Za-z]:\$?[A-Za-z]|\d+(?:[.,]\d+)?|[A-Za-zÀ-ÿ_][A-Za-zÀ-ÿ_.0-9]*|<>|<=|>=|[-+*/()=<>;:%])/y;
    const jetons = [];
    let pos = 0;
    while (pos < txt.length) {
      reg.lastIndex = pos;
      const j = reg.exec(txt);
      if (!j) { if (!txt.slice(pos).trim()) break; throw "#NOM?"; }
      jetons.push(j[1]);
      pos = reg.lastIndex;
    }
    let k = 0;
    const voit = () => jetons[k];
    const prend = t => { if (jetons[k] === t) { k++; return true; } return false; };
    const nombre = v => {
      if (v === "" || v === null || v === undefined) return 0;
      if (typeof v === "number") return v;
      if (typeof v === "boolean") return v ? 1 : 0;
      if (Array.isArray(v)) return nombre(v[0]);
      const n = parseFloat(String(v).replace(",", "."));
      if (isNaN(n)) throw "#VALEUR!";
      return n;
    };
    const plage = (a, b) => {
      const cl = s => s.replace(/\$/g, "").toUpperCase();
      const [ca, la] = [cl(a).charCodeAt(0) - 65, parseInt(cl(a).slice(1))];
      const [cb, lb] = [cl(b).charCodeAt(0) - 65, parseInt(cl(b).slice(1))];
      const res = [];
      for (let c = Math.min(ca, cb); c <= Math.max(ca, cb); c++)
        for (let l = Math.min(la, lb); l <= Math.max(la, lb); l++) res.push(cellule(LETTRES[c] + l));
      return res;
    };
    const aplat = args => args.flat(Infinity);
    const nums = args => aplat(args).filter(x => typeof x === "number");
    const critere = c => {
      if (typeof c === "number") return x => x === c;
      const m = String(c).match(/^(<>|<=|>=|<|>|=)?(.*)$/);
      const op = m[1] || "=";
      const v = m[2];
      const n = parseFloat(v.replace(",", "."));
      if (!isNaN(n) && /^[\d.,\s]+$/.test(v)) {
        return x => typeof x === "number" && (op === ">" ? x > n : op === "<" ? x < n : op === ">=" ? x >= n : op === "<=" ? x <= n : op === "<>" ? x !== n : x === n);
      }
      const re = new RegExp("^" + v.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$", "i");
      return x => op === "<>" ? !re.test(String(x)) : re.test(String(x));
    };
    const fonctions = {
      SOMME: a => nums(a).reduce((s, x) => s + x, 0),
      MOYENNE: a => { const n = nums(a); if (!n.length) throw "#DIV/0!"; return n.reduce((s, x) => s + x, 0) / n.length; },
      MIN: a => Math.min(...nums(a)),
      MAX: a => Math.max(...nums(a)),
      NB: a => nums(a).length,
      NBVAL: a => aplat(a).filter(x => x !== "" && x !== null && x !== undefined).length,
      SI: a => a[0] ? a[1] : a[2],
      "NB.SI": a => { const t = critere(a[1]); return [].concat(a[0]).filter(t).length; },
      "SOMME.SI": a => {
        const t = critere(a[1]), p = [].concat(a[0]), s = a[2] ? [].concat(a[2]) : p;
        return p.reduce((tot, x, i) => tot + (t(x) && typeof s[i] === "number" ? s[i] : 0), 0);
      }
    };
    function compare() {
      let g = somme();
      while (["=", "<>", "<", ">", "<=", ">="].includes(voit())) {
        const op = jetons[k++], d = somme();
        const a = typeof g === "string" ? g.toLowerCase() : g === "" ? 0 : g;
        const b = typeof d === "string" ? d.toLowerCase() : d === "" ? 0 : d;
        g = op === "=" ? a === b : op === "<>" ? a !== b : op === "<" ? a < b : op === ">" ? a > b : op === "<=" ? a <= b : a >= b;
      }
      return g;
    }
    function somme() {
      let g = produit();
      while (voit() === "+" || voit() === "-") {
        const op = jetons[k++], d = produit();
        g = op === "+" ? nombre(g) + nombre(d) : nombre(g) - nombre(d);
      }
      return g;
    }
    function produit() {
      let g = unaire();
      while (voit() === "*" || voit() === "/") {
        const op = jetons[k++], d = unaire();
        if (op === "/" && nombre(d) === 0) throw "#DIV/0!";
        g = op === "*" ? nombre(g) * nombre(d) : nombre(g) / nombre(d);
      }
      return g;
    }
    function unaire() {
      if (prend("-")) return -nombre(unaire());
      if (prend("+")) return nombre(unaire());
      let v = atome();
      while (prend("%")) v = nombre(v) / 100;
      return v;
    }
    function atome() {
      const t = jetons[k++];
      if (t === undefined) throw "#N/A";
      if (t === "(") { const v = compare(); if (!prend(")")) throw "#NOM?"; return v; }
      if (t[0] === '"') return t.slice(1, -1);
      if (/^\d/.test(t)) return parseFloat(t.replace(",", "."));
      if (/^\$?[A-Za-z]:\$?[A-Za-z]$/.test(t)) {
        const c = t.replace(/\$/g, "").toUpperCase();
        return plage(c[0] + "1", c[2] + "12");
      }
      if (/^\$?[A-Za-z]{1,2}\$?\d+$/.test(t)) {
        if (prend(":")) return plage(t, jetons[k++] || "");
        return cellule(t.replace(/\$/g, "").toUpperCase());
      }
      const U = t.toUpperCase();
      if (voit() === "(") {
        k++;
        const f = fonctions[U];
        if (!f) throw "#NOM?";
        const args = [];
        if (!prend(")")) {
          do { args.push(prend(";") ? "" : compare()); } while (prend(";"));
          if (!prend(")")) throw "#NOM?";
        }
        return f(args);
      }
      const nom = Object.keys(noms).find(n => n.toUpperCase() === U);
      if (nom) { const [a, b] = noms[nom].split(":"); return b ? plage(a, b) : cellule(a); }
      if (U === "VRAI") return true;
      if (U === "FAUX") return false;
      throw "#NOM?";
    }
    const res = compare();
    if (k < jetons.length) throw "#NOM?";
    return Array.isArray(res) ? res[0] : res;
  }

  S.excel = (r, o, ctx) => {
    const { el } = ctx;
    const hauteur = o.donnees.length, largeur = Math.max(...o.donnees.map(l => l.length));
    const brut = {};
    o.donnees.forEach((l, y) => l.forEach((v, x) => { if (v !== "" && v !== null) brut[LETTRES[x] + (y + 1)] = v; }));
    const liste = o.missions || [];
    const m = liste.length ? missions(liste, ctx, () => { aide.hidden = true; vise = null; dessine(); }) : null;
    let actif = liste[0] ? liste[0].cellule : "A1", vise = liste[0] ? liste[0].cellule : null;
    function valeur(c, pile = new Set()) {
      const b = brut[c];
      if (b === undefined) return "";
      if (typeof b === "string" && b[0] === "=") {
        if (pile.has(c)) throw "#REF!";
        const p = new Set(pile).add(c);
        return evalue(b, x => valeur(x, p), o.noms);
      }
      return b;
    }
    const affiche = c => {
      try {
        const v = valeur(c);
        if (typeof v === "number") return Math.round(v * 100) / 100 + "";
        if (typeof v === "boolean") return v ? "VRAI" : "FAUX";
        return v;
      } catch (e) { return typeof e === "string" ? e : "#NOM?"; }
    };
    const nomZone = el("div", { class: "xl-nom", title: "Zone Nom" });
    const saisie = el("input", { type: "text", autocomplete: "off", spellcheck: "false", "aria-label": "Barre de formule" });
    const info = retour(ctx);
    const grille = el("div", { class: "xl" });
    const aide = el("button", { class: "btn btn-petit", type: "button", onclick: () => {
      if (m && m.actuelle) dire(info, "info", `Un indice : ${m.actuelle.aide || "Toute formule commence par ="}`, ctx);
    } }, "💡 Un indice");
    if (!m) aide.hidden = true;
    function dessine() {
      const tete = el("tr", {}, el("th", {}), ...Array.from({ length: largeur }, (_, x) => el("th", { scope: "col" }, LETTRES[x])));
      const corps = Array.from({ length: hauteur }, (_, y) => el("tr", {}, el("th", { scope: "row" }, String(y + 1)), ...Array.from({ length: largeur }, (_, x) => {
        const c = LETTRES[x] + (y + 1);
        const v = affiche(c);
        const estTexte = v !== "" && isNaN(parseFloat(v)) && v[0] !== "#";
        return el("td", { class: (c === actif ? "actif " : "") + (c === vise ? "vise " : "") + (estTexte ? "txt" : "") },
          el("button", { type: "button", "aria-label": `Cellule ${c}${v !== "" ? ", " + v : ""}`, onclick: () => choisir(c) }, v));
      })));
      grille.replaceChildren(el("table", {}, el("thead", {}, tete), el("tbody", {}, ...corps)));
      nomZone.textContent = actif;
      saisie.value = brut[actif] === undefined ? "" : brut[actif];
    }
    function choisir(c, focus = true) {
      actif = c;
      dessine();
      if (focus) saisie.focus({ preventScroll: true });
    }
    function valider() {
      const v = saisie.value.trim();
      if (v === "") delete brut[actif];
      else if (v[0] === "=") brut[actif] = v;
      else {
        const n = parseFloat(v.replace(",", "."));
        brut[actif] = /^-?[\d]+([.,]\d+)?$/.test(v) ? n : v;
        if (/^(somme|moyenne|min|max|nb|si)\b|\(/i.test(v)) dire(info, "ko", "Excel lit ceci comme du texte : toute formule commence par =", ctx);
      }
      const a = affiche(actif);
      if (a[0] === "#") {
        dire(info, "ko", a === "#NOM?" ? "#NOM? : Excel ne reconnaît pas un mot. Vérifiez l'orthographe, les parenthèses et les ; entre les éléments." : `${a} : le calcul est impossible. Vérifiez les cellules utilisées.`, ctx);
      } else if (v[0] === "=") { info.className = "retour"; info.textContent = ""; }
      if (m && m.actuelle) {
        const q = m.actuelle;
        let bon = false;
        try {
          const val = valeur(q.cellule);
          bon = String(brut[q.cellule])[0] === "=" && (typeof q.attendu === "number" ? Math.abs(val - q.attendu) < .01 : String(val).toLowerCase() === String(q.attendu).toLowerCase());
          if (bon && q.contient && !new RegExp(q.contient, "i").test(String(brut[q.cellule]))) bon = false;
        } catch {}
        if (bon) {
          dire(info, "ok", `Bravo ! ${q.cellule} affiche ${affiche(q.cellule)}.`, ctx);
          m.suivante();
          if (m.actuelle) { vise = m.actuelle.cellule; actif = vise; }
        } else if (actif === q.cellule && a[0] !== "#" && v) {
          dire(info, "ko", "Le résultat n'est pas encore celui attendu. Relisez la mission ou demandez un indice.", ctx);
        }
      }
      dessine();
    }
    saisie.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); valider(); } });
    dessine();
    if (m) r.append(m.zone);
    r.append(el("div", { class: "xl-barre" }, nomZone, el("span", { "aria-hidden": "true", style: "font-style:italic;font-weight:800;color:#107c41" }, "fx"), saisie,
      el("button", { class: "btn btn-petit", type: "button", onclick: valider }, "✓ Entrée")), grille, info, el("div", { class: "barre-btn" }, aide));
  };
  S.excel.evalue = evalue;

  /* ---------- Excel : la recopie incrémentée ---------- */
  S.recopie = (r, o, ctx) => {
    const { el } = ctx;
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin"];
    const series = {
      "Lundi": { d: ["Lundi"], n: i => jours[i % 7], c: () => "Lundi", t: "Les jours et les mois sont reconnus : Excel complète la série." },
      "Janvier": { d: ["Janvier"], n: i => mois[i % 6], c: () => "Janvier", t: "Les jours et les mois sont reconnus : Excel complète la série." },
      "1 puis 2": { d: [1, 2], n: i => i + 1, c: i => [1, 2][i % 2], t: "Avec 2 cellules sélectionnées, Excel détecte le pas (+1)." },
      "5 puis 10": { d: [5, 10], n: i => 5 * (i + 1), c: i => [5, 10][i % 2], t: "Avec 2 cellules sélectionnées, Excel détecte le pas (+5)." },
      "1 seul": { d: [1], n: () => 1, c: i => i + 1, t: "Un nombre seul est recopié à l'identique. Avec Ctrl enfoncée, Excel compte : 1, 2, 3…" },
      "=A1*B1": { d: ["=A1*B1"], n: i => `=A${i + 1}*B${i + 1}`, c: i => `=A${i + 1}*B${i + 1}`, t: "Les références relatives s'adaptent à chaque ligne." },
      "Total": { d: ["Total"], n: () => "Total", c: () => "Total", t: "Un texte simple est recopié sans incrémenter." }
    };
    let choix = "Lundi", nb = 1, ctrl = false;
    const zone = el("div", { class: "xl" }), texte = el("p", { role: "status", style: "font-weight:700;margin:8px 0 0" });
    const outils = el("div", { class: "sim-outils" }, ...Object.keys(series).map(n => el("button", { class: "outil", type: "button", "data-n": n, onclick: () => { choix = n; nb = series[n].d.length; dessine(); } }, n)));
    const bCtrl = el("button", { class: "outil", type: "button", "aria-pressed": "false", onclick: () => { ctrl = !ctrl; bCtrl.setAttribute("aria-pressed", String(ctrl)); dessine(); } }, "Ctrl enfoncée");
    function dessine() {
      const s = series[choix];
      outils.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.n === choix)));
      const lignes = [];
      for (let i = 0; i < 8; i++) {
        const v = i < s.d.length ? s.d[i] : i < nb ? (ctrl ? s.c(i) : s.n(i)) : "";
        lignes.push(el("tr", {}, el("th", { scope: "row" }, String(i + 1)), el("td", { class: (i === nb - 1 ? "actif" : "") + (typeof v === "string" ? " txt" : ""), style: i < s.d.length ? "background:#e9f5ee" : "" }, el("button", { type: "button", tabindex: "-1", "aria-hidden": "true" }, String(v)))));
      }
      zone.replaceChildren(el("table", {}, el("thead", {}, el("tr", {}, el("th", {}), el("th", { scope: "col" }, "A"))), el("tbody", {}, ...lignes)));
      texte.textContent = nb > s.d.length ? s.t : "Tirez la poignée pour voir ce qu'Excel propose.";
    }
    dessine();
    r.append(el("p", { style: "margin:0 0 6px;font-weight:800" }, "1. Choisissez un départ :"), outils,
      el("div", { class: "sim-outils" }, el("span", { style: "font-weight:800" }, "2. Tirez :"),
        el("button", { class: "btn btn-petit btn-fort", type: "button", onclick: () => { nb = Math.min(8, nb + 1); dessine(); } }, "⬇ Tirer la poignée"),
        bCtrl,
        el("button", { class: "btn btn-petit", type: "button", onclick: () => { nb = series[choix].d.length; dessine(); } }, "Effacer")),
      zone, texte);
  };

  /* ---------- Excel : références relatives et absolues ---------- */
  S.references = (r, o, ctx) => {
    const { el } = ctx;
    const prix = [100, 250, 80, 40];
    const formes = ["B1", "$B$1", "B$1", "$B1"];
    let f = 0, recopie = false;
    const m = missions([{ t: "calculez la TVA de toutes les lignes : trouvez l'écriture qui garde le taux fixe quand on recopie." }], ctx);
    const zone = el("div", { class: "xl" });
    const info = el("p", { role: "status", style: "font-weight:700;margin:8px 0 0" });
    const fige = () => formes[f].includes("$1");
    const refLigne = i => (fige() ? formes[f] : formes[f].replace("1", String(1 + i)));
    const bF4 = el("button", { class: "btn btn-petit btn-fort", type: "button", onclick: () => { f = (f + 1) % 4; recopie = false; dessine(); }, html: "Appuyer sur {F4}" });
    function dessine() {
      const lignes = prix.map((p, i) => {
        const montre = i === 0 || recopie;
        const fo = `=A${i + 3}*${refLigne(i)}`;
        const taux = i === 0 || fige() ? .2 : 0;
        return el("tr", {}, el("th", { scope: "row" }, String(i + 3)), el("td", {}, el("button", { type: "button", tabindex: "-1" }, String(p))),
          el("td", { class: "txt" }, el("button", { type: "button", tabindex: "-1" }, montre ? fo : "")),
          el("td", { style: montre && !taux ? "background:#fdeceb" : montre ? "background:#e2f6ea" : "" }, el("button", { type: "button", tabindex: "-1" }, montre ? String(p * taux) : "")));
      });
      zone.replaceChildren(el("table", {},
        el("thead", {}, el("tr", {}, el("th", {}), ...["A", "B", "C"].map(x => el("th", { scope: "col" }, x)))),
        el("tbody", {},
          el("tr", {}, el("th", { scope: "row" }, "1"), el("td", { class: "txt" }, el("button", { type: "button", tabindex: "-1" }, "Taux de TVA")), el("td", { style: "background:#fff3cf" }, el("button", { type: "button", tabindex: "-1" }, "20%")), el("td", {})),
          el("tr", {}, el("th", { scope: "row" }, "2"), ...["Prix", "Formule", "TVA"].map(x => el("td", { class: "txt" }, el("button", { type: "button", tabindex: "-1" }, x)))),
          ...lignes)));
      const types = { "B1": "relative : la ligne et la colonne changent quand on recopie", "$B$1": "absolue : rien ne bouge", "B$1": "mixte : seule la ligne 1 est figée", "$B1": "mixte : seule la colonne B est figée" };
      info.innerHTML = ctx.riche(`Taux écrit <code>${formes[f]}</code>, référence ${types[formes[f]]}.` + (recopie ? (fige() ? " Toutes les lignes utilisent bien B1. ✓" : " Le taux glisse vers des cellules vides : la TVA est fausse !") : ""));
    }
    dessine();
    r.append(m.zone, el("div", { class: "sim-outils" }, bF4,
      el("button", { class: "btn btn-petit", type: "button", onclick: () => { recopie = true; dessine(); if (fige() && !m.finie) m.suivante(); } }, "⬇ Recopier vers le bas")), zone, info);
  };

  /* ---------- Excel : trier et filtrer ---------- */
  S.trifiltre = (r, o, ctx) => {
    const { el } = ctx;
    const donnees = [["Dupont", "Nord", 1200], ["Martin", "Sud", 850], ["Bernard", "Nord", 430], ["Petit", "Est", 1500], ["Robert", "Sud", 990], ["Richard", "Est", 310], ["Durand", "Nord", 760], ["Moreau", "Sud", 1120]];
    let tri = null, sens = 1;
    const services = new Set(["Nord", "Sud", "Est"]);
    const m = missions([
      { t: "triez la colonne <strong>Nom</strong> de A à Z.", ok: () => tri === 0 && sens === 1 },
      { t: "triez les <strong>Ventes</strong> du plus grand au plus petit.", ok: () => tri === 2 && sens === -1 },
      { t: "filtrez pour n'afficher que la région <strong>Nord</strong>.", ok: () => services.size === 1 && services.has("Nord") }
    ], ctx);
    const zone = el("div", { class: "defile-x" });
    const info = el("p", { role: "status", style: "font-weight:700;margin:8px 0 0" });
    const verif = () => { while (m.actuelle && m.actuelle.ok()) m.suivante(); dessine(); };
    const noms = ["Nom", "Région", "Ventes"];
    function dessine() {
      const lignes = donnees.filter(l => services.has(l[1])).sort((a, b) => tri === null ? 0 : (tri === 2 ? a[2] - b[2] : a[tri].localeCompare(b[tri], "fr")) * sens);
      zone.replaceChildren(el("table", { class: "mini-t" },
        el("thead", {}, el("tr", {}, ...noms.map((n, i) => el("th", { class: i === 2 ? "num" : "", "aria-sort": tri === i ? (sens > 0 ? "ascending" : "descending") : null }, n + (tri === i ? (sens > 0 ? " ▲" : " ▼") : ""))))),
        el("tbody", {}, ...lignes.map(l => el("tr", {}, el("td", {}, l[0]), el("td", {}, l[1]), el("td", { class: "num" }, l[2] + " €"))))));
      info.textContent = `${lignes.length} lignes affichées sur ${donnees.length}.` + (lignes.length < donnees.length ? " Les autres sont masquées, pas supprimées." : "");
    }
    const bTri = (i, s, t) => el("button", { class: "outil", type: "button", onclick: () => { tri = i; sens = s; verif(); } }, t);
    dessine();
    r.append(m.zone,
      el("div", { class: "sim-outils" }, el("span", { style: "font-weight:800" }, "Trier :"), bTri(0, 1, "Nom A → Z"), bTri(0, -1, "Nom Z → A"), bTri(2, 1, "Ventes ↗ plus petit d'abord"), bTri(2, -1, "Ventes ↘ plus grand d'abord")),
      el("div", { class: "sim-outils" }, el("span", { style: "font-weight:800" }, "Filtrer la région :"), ...["Nord", "Sud", "Est"].map(s => el("label", { class: "champ" },
        el("input", { type: "checkbox", checked: true, onchange: e => { e.target.checked ? services.add(s) : services.delete(s); verif(); } }), s))),
      zone, info);
  };

  /* ---------- Excel : la mise en forme conditionnelle ---------- */
  S.mfc = (r, o, ctx) => {
    const { el } = ctx;
    const ventes = [["Lundi", 80], ["Mardi", 145], ["Mercredi", 60], ["Jeudi", 210], ["Vendredi", 120], ["Samedi", 95]];
    let mode = "Surbrillance", op = "sup", seuil = 150;
    const m = missions([{ t: "alertez sur les <strong>ventes inférieures à 100 €</strong> : règle « Inférieur à » et seuil à 100." }], ctx);
    const zone = el("div", { class: "defile-x" });
    const max = 210;
    const icone = v => v >= 140 ? "🟢" : v >= 90 ? "🟡" : "🔴";
    const nuance = v => { const t = (v - 60) / 150; return `rgb(${Math.round(226 - t * 170)},${Math.round(243 - t * 90)},${Math.round(246 - t * 60)})`; };
    function dessine() {
      zone.replaceChildren(el("table", { class: "mini-t" }, el("thead", {}, el("tr", {}, el("th", {}, "Jour"), el("th", {}, "Ventes"))),
        el("tbody", {}, ...ventes.map(([j, v]) => {
          const vrai = op === "inf" ? v < seuil : v > seuil;
          const style = mode === "Surbrillance" && vrai ? "background:#fdeceb;color:#8c1d13;font-weight:800" : mode === "Nuances" ? `background:${nuance(v)}` : "";
          const cont = [];
          if (mode === "Barres") cont.push(el("span", { class: "barre-donnee", style: `width:${v / max * 110}px` }));
          if (mode === "Icônes") cont.push(icone(v) + " ");
          cont.push(v + " €");
          return el("tr", {}, el("td", {}, j), el("td", { style }, ...cont));
        }))));
    }
    const nSeuil = el("output", {}, "");
    const curseur = el("input", { type: "range", min: 50, max: 220, step: 10, value: seuil, "aria-label": "Seuil en euros", oninput: e => { seuil = +e.target.value; nSeuil.textContent = seuil + " €"; verif(); } });
    nSeuil.textContent = seuil + " €";
    const selOp = el("select", { "aria-label": "Type de règle", onchange: e => { op = e.target.value; verif(); } }, el("option", { value: "sup" }, "Supérieur à…"), el("option", { value: "inf" }, "Inférieur à…"));
    const reglage = el("div", {}, el("div", { class: "sim-outils" }, selOp), el("div", { class: "curseur" }, el("span", {}, "Seuil de la règle"), nSeuil, curseur));
    const modes = el("div", { class: "sim-outils" }, ...["Surbrillance", "Barres", "Nuances", "Icônes"].map(n => el("button", { class: "outil", type: "button", "aria-pressed": String(n === mode), "data-n": n, onclick: () => {
      mode = n;
      modes.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.n === n)));
      reglage.hidden = n !== "Surbrillance";
      dessine();
    } }, n === "Barres" ? "Barres de données" : n === "Nuances" ? "Nuances de couleurs" : n === "Icônes" ? "Jeux d'icônes" : "Règle de surbrillance")));
    function verif() {
      if (m.actuelle && op === "inf" && seuil === 100) m.suivante();
      dessine();
    }
    dessine();
    r.append(m.zone, modes, reglage, zone);
  };

  /* ---------- Excel : le tableau croisé dynamique ---------- */
  S.tcd = (r, o, ctx) => {
    const { el } = ctx;
    const source = [
      ["Café", "Nord", "Janvier", 320], ["Café", "Sud", "Janvier", 210], ["Thé", "Nord", "Janvier", 150], ["Thé", "Sud", "Janvier", 90], ["Chocolat", "Nord", "Janvier", 400], ["Chocolat", "Sud", "Janvier", 260],
      ["Café", "Nord", "Février", 280], ["Café", "Sud", "Février", 240], ["Thé", "Nord", "Février", 170], ["Thé", "Sud", "Février", 120], ["Chocolat", "Nord", "Février", 350], ["Chocolat", "Sud", "Février", 310]
    ];
    const champs = ["Produit", "Région", "Mois"];
    let photo = source.map(l => l.slice());
    let cfg = { l: "Région", c: "", v: "Somme", f: "" };
    let change = false;
    const m = missions([
      { t: "analysez les ventes par produit et par mois : <strong>Lignes = Produit</strong>, <strong>Colonnes = Mois</strong>.", ok: () => cfg.l === "Produit" && cfg.c === "Mois" && cfg.v === "Somme" },
      { t: "ajoutez un filtre pour ne voir que la région <strong>Nord</strong>.", ok: () => cfg.f === "Nord" },
      { t: "cliquez sur <strong>Modifier la source</strong>, puis sur <strong>Actualiser</strong> pour voir le changement.", ok: () => change === "fait" }
    ], ctx);
    const zone = el("div", { class: "defile-x" });
    const info = el("p", { role: "status", style: "font-weight:700;margin:8px 0 0" });
    const calc = t => !t.length ? "" : cfg.v === "Somme" ? t.reduce((a, b) => a + b, 0) : cfg.v === "Moyenne" ? Math.round(t.reduce((a, b) => a + b, 0) / t.length) : cfg.v === "Nombre" ? t.length : Math.max(...t);
    function dessine() {
      const iL = champs.indexOf(cfg.l), iC = champs.indexOf(cfg.c);
      const lignes = photo.filter(x => !cfg.f || x[1] === cfg.f);
      const vL = [...new Set(lignes.map(x => x[iL]))];
      const vC = iC >= 0 ? [...new Set(lignes.map(x => x[iC]))] : [];
      const val = (a, b) => calc(lignes.filter(x => (a === null || x[iL] === a) && (b === null || x[iC] === b)).map(x => x[3]));
      zone.replaceChildren(el("table", { class: "mini-t" },
        el("thead", {}, el("tr", {}, el("th", {}, cfg.l), ...vC.map(c => el("th", { class: "num" }, c)), el("th", { class: "num" }, vC.length ? "Total" : `${cfg.v} des ventes`))),
        el("tbody", {}, ...vL.map(a => el("tr", {}, el("td", {}, a), ...vC.map(c => el("td", { class: "num" }, String(val(a, c)))), el("td", { class: "num tot" }, String(val(a, null)))))),
        el("tfoot", {}, el("tr", {}, el("td", {}, "Total général"), ...vC.map(c => el("td", { class: "num" }, String(val(null, c)))), el("td", { class: "num" }, String(val(null, null)))))));
    }
    const sel = (cle, nom, options) => el("label", { class: "champ" }, nom + " ", el("select", { onchange: e => {
      cfg[cle] = e.target.value;
      if (cfg.c === cfg.l) { cfg.c = ""; [...r.querySelectorAll("select")][1].value = ""; }
      verif();
    } }, ...options.map(([v, t]) => el("option", { value: v, selected: cfg[cle] === v }, t))));
    function verif() { while (m.actuelle && m.actuelle.ok()) m.suivante(); dessine(); }
    dessine();
    r.append(m.zone,
      el("div", { class: "sim-outils" },
        sel("l", "Lignes", champs.map(c => [c, c])),
        sel("c", "Colonnes", [["", "(aucune)"], ...champs.map(c => [c, c])]),
        sel("v", "Valeurs", ["Somme", "Moyenne", "Nombre", "Max"].map(c => [c, c])),
        sel("f", "Filtre", [["", "(toutes les régions)"], ["Nord", "Nord"], ["Sud", "Sud"]])),
      zone, info,
      el("div", { class: "barre-btn" },
        el("button", { class: "btn btn-petit", type: "button", onclick: () => {
          source[0][3] += 100;
          change = true;
          info.textContent = "La source a changé (Café, Nord, Janvier : +100 €). Le TCD, lui, n'a pas bougé.";
        } }, "✏️ Modifier la source"),
        el("button", { class: "btn btn-petit btn-fort", type: "button", onclick: () => {
          photo = source.map(l => l.slice());
          if (change) { change = "fait"; info.textContent = "Actualisé : le TCD a rechargé les données."; }
          else info.textContent = "Rien de nouveau dans la source pour le moment.";
          verif();
        } }, "🔄 Actualiser")));
  };

  /* ---------- Excel : le graphique suit les données ---------- */
  S.graphique = (r, o, ctx) => {
    const { el } = ctx;
    const d = [["Janvier", 1200], ["Février", 1350], ["Mars", 1000]];
    const parts = ["#0a7ea4", "#d9480f", "#6741d9"];
    let type = "Histogramme";
    const NS = "http://www.w3.org/2000/svg";
    const s = (t, a, txt) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); if (txt !== undefined) n.textContent = txt; return n; };
    const zone = el("div", { class: "graph" });
    const bulle = v => s("title", {}, `${v[0]} : ${v[1]} €`);
    function dessine() {
      const W = 460, H = 240, g = 46, b = 30, h = 14, max = Math.max(...d.map(x => x[1]), 100) * 1.12;
      const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": `${type} des ventes : ` + d.map(x => `${x[0]} ${x[1]} euros`).join(", ") });
      const y = v => H - b - (v / max) * (H - b - h);
      const pasX = (W - g - 10) / d.length;
      const encre = "#4b5c66";
      if (type !== "Camembert") {
        [0, .5, 1].forEach(t => {
          const v = Math.round(max * t / 100) * 100;
          svg.append(s("line", { x1: g, x2: W - 10, y1: y(v), y2: y(v), stroke: "#e6e6e1" }), s("text", { x: g - 6, y: y(v) + 4, "text-anchor": "end", "font-size": 11, fill: encre }, String(v)));
        });
        d.forEach((v, i) => svg.append(s("text", { x: g + pasX * (i + .5), y: H - 10, "text-anchor": "middle", "font-size": 12, fill: encre }, v[0])));
      }
      if (type === "Histogramme") {
        d.forEach((v, i) => {
          const l = Math.min(pasX * .5, 58), x = g + pasX * (i + .5) - l / 2, yy = y(v[1]), r0 = 4;
          const p = s("path", { d: `M${x},${y(0)}V${yy + r0}Q${x},${yy} ${x + r0},${yy}H${x + l - r0}Q${x + l},${yy} ${x + l},${yy + r0}V${y(0)}Z`, fill: parts[0] });
          p.append(bulle(v));
          svg.append(p);
        });
      } else if (type === "Courbe") {
        const pts = d.map((v, i) => [g + pasX * (i + .5), y(v[1])]);
        svg.append(s("polyline", { points: pts.map(p => p.join(",")).join(" "), fill: "none", stroke: parts[0], "stroke-width": 2 }));
        pts.forEach((p, i) => {
          const c = s("circle", { cx: p[0], cy: p[1], r: 5, fill: parts[0], stroke: "#fff", "stroke-width": 2 });
          c.append(bulle(d[i]));
          svg.append(c);
        });
      } else {
        const tot = d.reduce((a, x) => a + x[1], 0) || 1;
        let a = -Math.PI / 2;
        const cx = 150, cy = H / 2, R = 96;
        d.forEach((v, i) => {
          const fin = a + v[1] / tot * Math.PI * 2;
          const grand = fin - a > Math.PI ? 1 : 0;
          const p = s("path", { d: `M${cx},${cy}L${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}A${R},${R} 0 ${grand} 1 ${cx + R * Math.cos(fin)},${cy + R * Math.sin(fin)}Z`, fill: parts[i], stroke: "#fff", "stroke-width": 2 });
          p.append(bulle(v));
          svg.append(p);
          const ly = 62 + i * 42;
          svg.append(s("rect", { x: 290, y: ly - 11, width: 12, height: 12, rx: 3, fill: parts[i] }), s("text", { x: 309, y: ly, "font-size": 14, fill: "#1b2a33" }, `${v[0]} : ${Math.round(v[1] / tot * 100)} %`));
          a = fin;
        });
      }
      zone.replaceChildren(svg);
    }
    const types = el("div", { class: "sim-outils" }, ...["Histogramme", "Courbe", "Camembert"].map(n => el("button", { class: "outil", type: "button", "aria-pressed": String(n === type), "data-n": n, onclick: () => {
      type = n;
      types.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.n === n)));
      dessine();
    } }, n)));
    const table = el("table", { class: "mini-t" }, el("thead", {}, el("tr", {}, el("th", {}, "Mois"), el("th", {}, "Ventes (modifiables)"))),
      el("tbody", {}, ...d.map((v, i) => el("tr", {}, el("td", {}, v[0]), el("td", {}, el("input", { type: "number", min: 0, step: 50, value: v[1], "aria-label": `Ventes de ${v[0]}`, style: "width:110px", oninput: e => { d[i][1] = Math.max(0, +e.target.value || 0); dessine(); } }))))));
    dessine();
    r.append(types, zone, el("div", { class: "defile-x", style: "margin-top:9px" }, table),
      el("p", { style: "margin:7px 0 0;font-size:.92rem;font-weight:700" }, "Changez un chiffre : le graphique se met à jour tout seul."));
  };

  /* ---------- PowerPoint : présenter au clavier ---------- */
  S.diaporama = (r, o, ctx) => {
    const { el } = ctx;
    const diapos = [
      { t: "Notre projet", l: ["Présentation à l'équipe"], d: "#e7f0fb" },
      { t: "Le contexte", l: ["Pourquoi ce projet", "Pour qui", "Quand"], d: "#fff3cf" },
      { t: "Trois idées clés", l: ["Une idée par diapositive", "Peu de texte", "Un visuel fort"], d: "#e2f6ea" },
      { t: "Le planning", l: ["Janvier : préparation", "Mars : lancement"], d: "#fdeceb" },
      { t: "Merci !", l: ["Vos questions ?"], d: "#f0e8fb" }
    ];
    let i = 0, vus = 1, ecran = "", tape = "", quitte = false;
    const m = missions([
      { t: "cliquez dans la diapositive, puis passez à la suivante avec {→} ou {Espace}.", ok: () => i >= 1 },
      { t: "allez directement à la diapositive 4 : tapez {4} puis {Entrée}.", ok: () => i === 3 && !ecran },
      { t: "faites une pause discrète : écran noir avec {B}.", ok: () => ecran === "b" },
      { t: "quittez le diaporama avec {Échap}.", ok: () => quitte }
    ], ctx);
    const scene = el("div", { class: "scene", tabindex: "0", role: "application", "aria-label": "Diaporama : utilisez le clavier" });
    const info = el("p", { role: "status", style: "font-weight:700;margin:8px 0 0;font-size:.95rem" });
    const verif = () => { while (m.actuelle && m.actuelle.ok()) m.suivante(); };
    function dessine() {
      if (quitte) {
        scene.replaceChildren(el("div", { class: "scene-blanc" }, "Fin du diaporama. Cliquez ici pour le relancer."));
        info.textContent = "";
        return;
      }
      const d = diapos[i];
      const vue = el("div", { class: "diapo", style: `--diapo:${d.d}` }, el("h4", {}, d.t), el("ul", {}, ...d.l.slice(0, vus).map(x => el("li", {}, x))));
      scene.replaceChildren(vue);
      if (ecran === "b") scene.append(el("div", { class: "scene-noir" }, "Écran noir : appuyez sur B pour revenir"));
      if (ecran === "w") scene.append(el("div", { class: "scene-blanc" }, "Écran blanc : appuyez sur W pour revenir"));
      info.textContent = `Diapositive ${i + 1} / ${diapos.length}` + (vus < d.l.length ? " · l'animation suivante attend un clic" : "") + (tape ? ` · numéro tapé : ${tape}` : "");
    }
    function avance() {
      const d = diapos[i];
      if (vus < d.l.length) vus++;
      else if (i < diapos.length - 1) { i++; vus = 1; }
    }
    function recule() { if (i > 0) { i--; vus = diapos[i].l.length; } }
    const action = t => {
      if (quitte) { quitte = false; i = 0; vus = 1; dessine(); return; }
      if (ecran && t !== "b" && t !== "w" && t !== "esc") { ecran = ""; dessine(); return; }
      if (t === "next") { avance(); }
      if (t === "prev") recule();
      if (t === "b") ecran = ecran === "b" ? "" : "b";
      if (t === "w") ecran = ecran === "w" ? "" : "w";
      if (t === "esc") { quitte = true; ecran = ""; }
      verif();
      dessine();
    };
    scene.addEventListener("click", () => { scene.focus({ preventScroll: true }); action("next"); });
    scene.addEventListener("keydown", e => {
      const k = e.key;
      if (/^\d$/.test(k)) { tape += k; dessine(); e.preventDefault(); return; }
      if (k === "Enter" && tape) {
        const n = parseInt(tape);
        tape = "";
        if (n >= 1 && n <= diapos.length) { i = n - 1; vus = diapos[i].l.length; ecran = ""; }
        verif(); dessine(); e.preventDefault();
        return;
      }
      const map = { ArrowRight: "next", Enter: "next", " ": "next", ArrowLeft: "prev", Backspace: "prev", b: "b", B: "b", w: "w", W: "w", Escape: "esc" };
      if (map[k]) { e.preventDefault(); e.stopPropagation(); action(map[k]); }
    });
    dessine();
    const b = (t, a) => el("button", { class: "outil", type: "button", html: t, onclick: () => { action(a); } });
    r.append(m.zone, scene, info,
      el("div", { class: "sim-outils", style: "margin-top:9px" }, b("{←} Précédente", "prev"), b("{→} Suivante", "next"), b("{B} Noir", "b"), b("{W} Blanc", "w"), b("{Échap} Quitter", "esc"),
        el("button", { class: "outil", type: "button", html: "{4} {Entrée}", onclick: () => { if (quitte) return; ecran = ""; i = 3; vus = diapos[3].l.length; verif(); dessine(); } })));
  };

  /* ---------- PowerPoint : le masque change toutes les diapositives ---------- */
  S.masque = (r, o, ctx) => {
    const { el } = ctx;
    const titres = ["Titre", "Sommaire", "Contexte", "Résultats", "Conclusion"];
    let fond = "#ffffff", texte = "#1b2a33", logo = false, police = "inherit";
    const m = missions([
      { t: "dans le masque, ajoutez le <strong>logo</strong>.", ok: () => logo },
      { t: "choisissez une <strong>couleur de fond</strong> : toutes les diapositives changent d'un seul coup.", ok: () => fond !== "#ffffff" }
    ], ctx);
    const zone = el("div", { class: "vignettes" });
    function dessine() {
      zone.replaceChildren(...titres.map(t => el("div", { class: "vignette", style: `background:${fond};color:${texte};font-family:${police}` }, logo ? el("em", { "aria-hidden": "true" }, "🦋") : null, t, el("i"), el("i"), el("i"))));
    }
    const verif = () => { while (m.actuelle && m.actuelle.ok()) m.suivante(); dessine(); };
    dessine();
    r.append(m.zone, el("div", { class: "sim-outils" },
      el("span", { style: "font-weight:800" }, "Masque :"),
      el("button", { class: "outil", type: "button", onclick: () => { logo = !logo; verif(); } }, "🦋 Logo"),
      ...[["#ffffff", "#1b2a33", "Blanc"], ["#17324d", "#ffffff", "Bleu nuit"], ["#e2f6ea", "#14523a", "Vert doux"], ["#fff3cf", "#5b4300", "Soleil"]].map(([f, t, n]) => el("button", { class: "outil", type: "button", onclick: () => { fond = f; texte = t; verif(); } }, n)),
      el("button", { class: "outil", type: "button", onclick: () => { police = police === "inherit" ? "Georgia, serif" : "inherit"; dessine(); } }, "Police globale")),
      zone);
  };

  /* ---------- Messagerie : qui voit quoi avec À, Cc et Cci ---------- */
  S.cci = (r, o, ctx) => {
    const { el } = ctx;
    const place = { Alice: "À", Bruno: "Cc", Chloé: "Cci" };
    const zone = el("div", {});
    const info = el("p", { role: "status", style: "font-weight:700;margin:8px 0 0" });
    const outils = el("div", { class: "gens" }, el("span", { style: "font-weight:800;align-self:center" }, "Voir le message reçu par :"), ...Object.keys(place).map(n => el("button", { class: "outil", type: "button", "data-n": n, onclick: () => choisir(n) }, `${n} (${place[n]})`)));
    const textes = {
      Alice: "Alice est la destinataire principale : le message la concerne directement. Elle voit Bruno, mais pas Chloé.",
      Bruno: "Bruno est en copie : il est simplement informé. Lui non plus ne voit pas Chloé.",
      Chloé: "Chloé est en copie cachée : elle voit tout le monde, mais personne ne sait qu'elle a reçu le message."
    };
    function choisir(n) {
      outils.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.n === n)));
      zone.replaceChildren(el("div", { class: "mail" },
        el("div", { class: "mail-l" }, el("b", {}, "De :"), "Vous"),
        el("div", { class: "mail-l" }, el("b", {}, "À :"), "Alice"),
        el("div", { class: "mail-l" }, el("b", {}, "Cc :"), "Bruno"),
        n === "Chloé" ? el("div", { class: "mail-l", style: "background:#fff3cf" }, el("b", {}, "Cci :"), "Chloé (visible par elle seule)") : null,
        el("div", { class: "mail-l" }, el("b", {}, "Objet :"), "Réunion de lundi")));
      info.textContent = textes[n];
    }
    choisir("Alice");
    r.append(outils, zone, info);
  };

  /* ---------- Sécurité : repérer les pièges d'un faux message ---------- */
  S.phishing = (r, o, ctx) => {
    const { el } = ctx;
    const pieges = 4;
    let trouves = 0;
    const info = retour(ctx);
    const etat = el("div", { class: "mission", role: "status" }, `🎯 Mission : cliquez sur les ${pieges} signes d'alerte de ce message.`);
    const ind = (texte, ok, expl) => {
      const b = el("button", { class: "indice", type: "button" }, texte);
      b.addEventListener("click", () => {
        if (b.dataset.vu) return;
        b.dataset.vu = "1";
        if (ok) {
          b.classList.add("ok");
          trouves++;
          dire(info, "ok", `${expl} (${trouves} / ${pieges})`, ctx);
          if (trouves === pieges) {
            etat.className = "mission fini";
            etat.textContent = "🌟 Tous les pièges sont démasqués ! ⭐";
            ctx.reussi();
            dire(info, "ok", "Le réflexe d'or : ne cliquez jamais. En cas de doute, tapez vous-même l'adresse du site officiel dans le navigateur.", ctx);
          }
        } else {
          b.classList.add("ras");
          dire(info, "info", expl, ctx);
        }
      });
      return b;
    };
    r.append(etat, el("div", { class: "mail" },
      el("div", { class: "mail-l" }, el("b", {}, "De :"), ind("service-client@ma-banqque-secure.xyz", true, "Expéditeur suspect : l'adresse est inconnue ou légèrement modifiée.")),
      el("div", { class: "mail-l" }, el("b", {}, "Objet :"), ind("Votre relevé mensuel", false, "Rien de suspect dans cet objet pris seul.")),
      el("div", { class: "mail-c" },
        el("p", { style: "margin:0 0 8px" }, ind("Bonjour,", false, "Une formule de politesse banale : ce n'est pas un signe d'alerte.")),
        el("p", { style: "margin:0 0 8px" }, ind("Votre compte sera suspendu dans 24 heures. Agissez immédiatement !", true, "Ton urgent ou menaçant : on veut vous faire agir sans réfléchir.")),
        el("p", { style: "margin:0 0 8px" }, ind("Nous avon detecté une activitée anormal sur votre compte.", true, "Des fautes d'orthographe flagrantes.")),
        el("p", { style: "margin:0 0 8px" }, "Connectez-vous ici : ", ind("www.ma-banque.fr", true, "Lien incohérent : le texte affiche ma-banque.fr, mais le lien mène ailleurs. Passez la souris sans cliquer pour vérifier.")),
        el("p", { style: "margin:0" }, ind("Le service client", false, "Une signature ordinaire : ce n'est pas ce qui trahit ce message.")))),
      info);
  };

  /* ---------- Sécurité : tester la solidité d'un mot de passe (rien n'est gardé) ---------- */
  S.motdepasse = (r, o, ctx) => {
    const { el } = ctx;
    const regles = [
      ["Au moins 12 caractères", v => v.length >= 12],
      ["Des majuscules", v => /[A-ZÀ-Ý]/.test(v)],
      ["Des minuscules", v => /[a-zà-ÿ]/.test(v)],
      ["Des chiffres", v => /\d/.test(v)],
      ["Des caractères spéciaux (@, #, !…)", v => /[^A-Za-zÀ-ÿ0-9\s]/.test(v)]
    ];
    const ul = el("ul", { class: "regles" });
    const jauge = el("i", { style: "width:0" });
    const etat = el("div", { class: "mission", role: "status" }, "🎯 Mission : inventez un mot de passe qui respecte les 5 règles.");
    const champ = el("input", { type: "text", autocomplete: "off", spellcheck: "false", style: "width:100%", "aria-label": "Mot de passe à tester", oninput: e => maj(e.target.value) });
    function maj(v) {
      const res = regles.map(([t, f]) => f(v));
      const n = res.filter(Boolean).length;
      ul.replaceChildren(...regles.map(([t], i) => el("li", { class: res[i] ? "ok" : "" }, t)));
      jauge.style.width = n / 5 * 100 + "%";
      jauge.style.background = n < 3 ? "#b42318" : n < 5 ? "#c98a00" : "#1a7f4b";
      if (n === 5) {
        etat.className = "mission fini";
        etat.textContent = "🌟 Solide ! ⭐ Ne l'utilisez pas pour de vrai : il a été tapé pour l'exercice.";
        ctx.reussi();
      }
    }
    maj("");
    r.append(etat, champ, el("div", { class: "force", "aria-hidden": "true" }, jauge), ul,
      el("p", { style: "margin:9px 0 0;font-size:.92rem;font-weight:700" }, "⚠️ N'écrivez jamais ici un vrai mot de passe. Rien n'est enregistré, mais c'est une bonne habitude."));
  };

  /* ---------- Écologie : calculer son empreinte de la semaine ---------- */
  S.co2 = (r, o, ctx) => {
    const { el } = ctx;
    const usages = [
      ["E-mails sans pièce jointe", 0.3, 100, 5, 40, "par semaine"],
      ["E-mails avec pièce jointe de 1 Mo", 19, 50, 1, 5, "par semaine"],
      ["Heures de visioconférence", 575, 20, 1, 2, "h par semaine"],
      ["Heures de streaming vidéo HD", 36, 40, 1, 5, "h par semaine"],
      ["Heures de navigation web", 20, 40, 1, 10, "h par semaine"],
      ["Requêtes à une IA générative", 7, 100, 5, 10, "par semaine"]
    ];
    const vals = usages.map(u => u[4]);
    const total = el("div", { class: "total-co2", role: "status" });
    const lignes = usages.map((u, i) => {
      const out = el("output", {}, "");
      const c = el("div", { class: "curseur" }, el("span", {}, u[0]), out,
        el("input", { type: "range", min: 0, max: u[2], step: u[3], value: vals[i], "aria-label": u[0], oninput: e => { vals[i] = +e.target.value; maj(); } }));
      c.dataset.i = i;
      c.sortie = out;
      return c;
    });
    function maj() {
      lignes.forEach((c, i) => { c.sortie.textContent = `${vals[i]} ${usages[i][5]}`; });
      const g = vals.reduce((s, v, i) => s + v * usages[i][1], 0);
      const t = g >= 1000 ? `${(g / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} kg` : `${Math.round(g)} g`;
      const parts = usages.map((u, i) => [u[0], vals[i] * u[1]]).sort((a, b) => b[1] - a[1]);
      total.textContent = `🌍 Environ ${t} de CO₂ par semaine. Le poste le plus lourd : ${parts[0][1] ? parts[0][0].toLowerCase() : "aucun"}.`;
    }
    maj();
    r.append(...lignes, total, el("p", { style: "margin:8px 0 0;font-size:.9rem", html: "Ordres de grandeur du livret. Pour la visioconférence, le calcul prend le milieu de la fourchette (150 à 1 000 g par heure)." }));
  };

  /* ---------- Mémo : une liste qu'on filtre et qu'on cherche ---------- */
  S.memo = (r, o, ctx) => {
    const { el } = ctx;
    const groupes = o.groupes || [];
    let groupe = "", mot = "";
    const zone = el("div", { class: "memo-liste" });
    const compte = el("p", { role: "status", style: "margin:7px 0;font-weight:800;font-size:.92rem" });
    const norm = t => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    function dessine() {
      const q = norm(mot);
      const res = o.lignes.filter(l => (!groupe || l[2] === groupe) && norm(l[0] + " " + l[1]).includes(q));
      compte.textContent = `${res.length} résultat${res.length > 1 ? "s" : ""}`;
      zone.replaceChildren(...res.map(l => el("div", { class: "memo-ligne" }, el("strong", { html: l[0] }), el("span", { html: l[1] }))));
    }
    const filtres = el("div", { class: "sim-outils" }, ...["", ...groupes].map(g => el("button", { class: "outil", type: "button", "aria-pressed": String(g === groupe), "data-g": g, onclick: () => {
      groupe = g;
      filtres.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.g === g)));
      dessine();
    } }, g || "Tout")));
    const champ = el("input", { type: "text", autocomplete: "off", placeholder: o.placeholder || "Chercher…", "aria-label": "Chercher dans la liste", style: "width:100%;margin-bottom:9px", oninput: e => { mot = e.target.value; dessine(); } });
    dessine();
    r.append(champ);
    if (groupes.length) r.append(filtres);
    r.append(compte, zone);
  };

  /* ---------- Chasse aux fautes : cliquer sur chaque mot mal écrit ---------- */
  // Dans le texte, [[faute|correction]] signale un mot à corriger.
  S.fautes = (r, o, ctx) => {
    const { el } = ctx;
    const textes = o.textes;
    const faits = new Set();
    const bilans = {};
    let actif = 0;
    const barre = el("div", { class: "niveaux" });
    const zone = el("div");
    function dessine() {
      const x = textes[actif];
      const morceaux = x.texte.split(/(\[\[[^\]]+\]\])/);
      const total = morceaux.filter(m => m.startsWith("[[")).length;
      let trouves = 0, faux = 0;
      const motsFaux = [];
      const info = el("div", { class: "retour", role: "status" });
      const etat = el("div", { class: "mission", role: "status" });
      const maj = () => { etat.textContent = `🎯 ${x.titre} : ${total - trouves} faute${total - trouves > 1 ? "s" : ""} à trouver. Cliquez sur les mots mal écrits.`; };
      const corps = el("div", { class: "fautes-texte" });
      morceaux.forEach(m => {
        if (m.startsWith("[[")) {
          const [mauvais, bon] = m.slice(2, -2).split("|");
          const b = el("button", { type: "button", "data-faute": "1" }, mauvais);
          b.addEventListener("click", () => {
            if (b.classList.contains("corrige")) return;
            b.classList.add("corrige");
            b.textContent = bon;
            trouves++;
            info.className = "retour ok";
            info.textContent = `« ${mauvais} » s'écrit « ${bon} ».`;
            maj();
            if (trouves === total) {
              etat.className = "mission fini";
              etat.textContent = faux ? `🌟 Toutes les fautes sont trouvées, avec ${faux} clic${faux > 1 ? "s" : ""} en trop. ⭐` : "🌟 Toutes les fautes sont trouvées, sans erreur ! ⭐";
              faits.add(actif);
              dessineBarre();
              const detail = morceaux.filter(z => z.startsWith("[[")).map(z => {
                const [a, b2] = z.slice(2, -2).split("|");
                return { q: `« ${a} » s'écrit « ${b2} »`, ok: true };
              }).concat(motsFaux.map(z => ({ q: `« ${z} » était correct`, ok: false, donne: "cliqué par erreur" })));
              bilans[actif] = { score: total, total: total + faux, detail };
              zone.append(ctx.blocScore(total, total + faux));
              const liste = ctx.listeCorrection(detail, "📋 Les corrections de ce texte");
              if (liste) zone.append(liste);
              if (faits.size === textes.length) {
                const tout = Object.values(bilans);
                ctx.reussi({ type: "Chasse aux fautes", score: tout.reduce((s, x) => s + x.score, 0), total: tout.reduce((s, x) => s + x.total, 0), detail: tout.flatMap(x => x.detail) });
              }
            }
          });
          corps.append(b);
        } else {
          m.split(/(\s+)/).forEach(mot => {
            if (!mot.trim()) { corps.append(mot); return; }
            const b = el("button", { type: "button" }, mot);
            b.addEventListener("click", () => {
              faux++;
              if (!motsFaux.includes(mot)) motsFaux.push(mot);
              b.classList.add("non");
              setTimeout(() => b.classList.remove("non"), 500);
              info.className = "retour ko";
              info.textContent = `« ${mot} » est correct.`;
            });
            corps.append(b);
          });
        }
      });
      maj();
      zone.replaceChildren(etat, corps, info);
    }
    function dessineBarre() {
      barre.replaceChildren(...textes.map((x, i) => el("button", { class: "outil", type: "button", "aria-pressed": String(i === actif), onclick: () => { actif = i; dessineBarre(); dessine(); } }, (faits.has(i) ? "✓ " : "") + x.titre)));
    }
    dessineBarre();
    dessine();
    r.append(barre, zone);
  };

  /* ---------- Positionnement : quelques questions par module, puis les priorités ---------- */
  // Les réponses sont communes avec les quiz de positionnement des modules : rien n'est demandé deux fois.
  S.positionnement = (r, o, ctx) => {
    const { el, melange } = ctx;
    const liste = o.modules.flatMap(m => m.questions.map(q => ({ ...q, m })));
    const reponseDe = q => ctx.positionnement.lire().reponses[q.q];
    const deja = liste.filter(reponseDe).length;
    const pose = () => {
      const i = liste.findIndex(q => !reponseDe(q));
      if (i < 0) return bilan();
      const q = liste[i];
      const choix = el("div", { class: "choix" });
      [...melange(q.r.map((t, k) => ({ t, k }))), { t: "Je ne sais pas", k: -1 }].forEach(({ t, k }) => {
        choix.append(el("button", { class: "rep", type: "button", "data-k": k, html: t, onclick: () => { ctx.positionnement.noter(q.q, k, t); pose(); } }));
      });
      r.replaceChildren(
        el("div", { class: "jeu-titre" }, el("span", {}, q.m.icone + " " + q.m.titre), el("small", {}, "Question " + (i + 1) + " / " + liste.length)),
        el("div", { class: "jauge-pos", "aria-hidden": "true" }, el("i", { style: "width:" + (i / liste.length * 100) + "%" })),
        deja && i < liste.length ? el("p", { class: "conseil-final" }, "✓ " + deja + " réponse" + (deja > 1 ? "s" : "") + " déjà donnée" + (deja > 1 ? "s" : "") + " dans les quiz des modules : elles sont reprises.") : "",
        el("p", { class: "question", html: q.q }), choix);
    };
    const bilan = () => {
      const reponses = liste.map(q => {
        const x = reponseDe(q);
        return { q: q.m.icone + " " + q.q, donne: x.donne, bonne: q.r[0], ok: x.k === 0 };
      });
      const score = reponses.filter(x => x.ok).length;
      const note = m => m.questions.filter(q => { const x = reponseDe(q); return x && x.k === 0; }).length;
      if (!ctx.memoire.lire()) {
        ctx.reussi({ type: "Positionnement", score, total: liste.length, detail: reponses });
        ctx.memoire.garder({ fait: 1 });
        o.modules.forEach(m => { if (!ctx.positionnement.lire().modules[m.cle]) ctx.positionnement.module(m.cle, note(m), m.questions.length); });
      }
      const tri = [...o.modules].sort((a, b) => note(a) / a.questions.length - note(b) / b.questions.length);
      const niveau = p => p < .5 ? ["🔴", "À travailler en priorité"] : p < 1 ? ["🟡", "À consolider"] : ["🟢", "Déjà à l'aise"];
      r.replaceChildren(
        el("div", { class: "jeu-titre" }, el("span", {}, "✓ Vos priorités")),
        el("p", {}, "Commencez par le haut de la liste. Ce n'est pas une note : ce quiz sert seulement à vous orienter."),
        ctx.blocScore(score, liste.length),
        el("div", { class: "priorites" }, ...tri.map(m => {
          const n = note(m), t = m.questions.length, [pastille, texte] = niveau(n / t);
          return el("div", { class: "priorite" },
            el("div", {}, el("strong", {}, m.icone + " " + m.titre), el("small", {}, pastille + " " + texte + " · " + n + " / " + t)),
            n === t
              ? el("a", { class: "btn btn-petit", href: "../index.html#/quiz-" + m.cle, target: "_top" }, "Voir les quiz")
              : el("a", { class: "btn btn-petit btn-fort", href: "../index.html#/" + m.cours, target: "_top" }, "Aller au cours"));
        })),
        ctx.listeCorrection(reponses) || "",
        el("div", { class: "barre-btn" }, el("button", { class: "btn btn-petit", type: "button", onclick: () => {
          const p = ctx.positionnement.lire();
          liste.forEach(q => { delete p.reponses[q.q]; });
          o.modules.forEach(m => { delete p.modules[m.cle]; });
          ctx.positionnement.ecrire(p);
          ctx.memoire.oublier();
          pose();
        } }, "Recommencer")));
    };
    pose();
  };

  return S;
})();
