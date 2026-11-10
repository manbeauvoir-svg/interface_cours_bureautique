/*
  LES JEUX ET ÉVALUATIONS PAR THÈME : quiz express, vrai ou faux, trouve l'intrus, mots mêlés, évaluation.
  Chaque page déclare, juste avant ce fichier :
    <script>const PAGE = { mode: "express", theme: "word" };</script>
  mode : express, vrai-faux, intrus, mots-meles ou evaluation ; theme : un thème de BANQUE, ou "tout" pour l'évaluation générale.
  Le contenu vient de banque-questions.js (questions des quiz) et de jeux-themes.js (intrus, vrai ou faux, mots mêlés).
*/
(() => {
  const $ = s => document.querySelector(s);
  const melange = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // Pour la correction : « {Ctrl+P} » devient « Ctrl + P », sans balises.
  const net = t => String(t ?? "").replace(/\{([^{}]+)\}/g, (m, s) => s.split("+").map(k => k.trim()).join(" + ")).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const riche = t => String(t).replace(/\{([^{}]+)\}/g, (m, s) => s.split("+").map(k => `<kbd>${k.trim()}</kbd>`).join(" + ")).replace(/`([^`]+)`/g, "<code>$1</code>");
  const el = (tag, attrs = {}, ...enfants) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "html") n.innerHTML = riche(v);
      else if (k === "class") n.className = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    }
    enfants.flat().forEach(e => e != null && n.append(e));
    return n;
  };
  const tous = PAGE.theme === "tout";
  const theme = tous ? { id: "tout", titre: "Toutes les thématiques", icone: "🎓" } : BANQUE.find(t => t.id === PAGE.theme);
  const MODES = {
    express: { titre: "Quiz express", icone: "⚡", type: "Quiz", intro: "10 questions tirées au hasard : elles changent à chaque partie. La correction s'affiche tout de suite." },
    "vrai-faux": { titre: "Vrai ou faux ?", icone: "✅", type: "Jeu", intro: "Une affirmation s'affiche : vraie ou fausse ? L'explication suit chaque réponse." },
    intrus: { titre: "Trouve l'intrus", icone: "🕵️", type: "Jeu", intro: "Quatre propositions : une seule n'a rien à faire là. Laquelle ?" },
    "mots-meles": { titre: "Mots mêlés", icone: "🔠", type: "Jeu", intro: "Retrouvez les mots cachés dans la grille : cliquez sur la première lettre, puis sur la dernière. Les mots se lisent de gauche à droite, de haut en bas ou en diagonale." },
    evaluation: { titre: "Évaluation", icone: "🎓", type: "Évaluation", intro: "Répondez à toutes les questions : la correction et votre score s'affichent à la fin. L'évaluation est réussie à 80 %." }
  };
  const mode = MODES[PAGE.mode];
  const nomTheme = theme.titre;
  document.title = `${mode.titre} : ${nomTheme}`;
  const zone = el("main", { class: "jx" });
  document.body.append(zone);

  // Lien vers l'écran du cours à revoir (le cours s'ouvre à cet endroit).
  const lienRevoir = (cours, revoir) => el("a", { class: "jx-revoir", href: "../index.html#/" + cours, target: "_top",
    onclick: () => { try { sessionStorage.setItem("cours-bureautique:livret:aller", revoir); } catch {} } }, "📖 Revoir : " + revoir);
  const chrono = () => { const d = Date.now(); return () => Math.round((Date.now() - d) / 1000); };
  const entete = (extra) => el("header", { class: "jx-tete" },
    el("div", { class: "jx-titre" }, el("span", { class: "jx-ico", "aria-hidden": "true" }, mode.icone), el("div", {}, el("small", {}, nomTheme), el("h1", {}, mode.titre))),
    extra || null);
  const barre = (i, n) => el("div", { class: "jx-barre", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": n, "aria-valuenow": i }, el("i", { style: `width:${i / n * 100}%` }));
  const fin = (score, total, detail, unite, apres) => {
    const res = el("div", {});
    const rejouer = el("button", { class: "jx-btn fort", type: "button", onclick: demarrer }, PAGE.mode === "evaluation" ? "Repasser l'évaluation" : "🔄 Rejouer");
    zone.replaceChildren(entete(), apres || "", res, el("div", { class: "jx-actions" }, rejouer));
    ResultatActivite.terminer({ zone: res, titre: `${mode.titre} : ${nomTheme}`, type: mode.type, score, total, detail, unite });
  };

  /* ---------- Quiz express et évaluation : les questions de la banque ---------- */
  function tirage(n) {
    if (!tous) return melange(theme.questions).slice(0, n).map(q => ({ ...q, cours: theme.cours }));
    // Évaluation générale : 4 questions par thème
    return melange(BANQUE.flatMap(t => melange(t.questions).slice(0, 4).map(q => ({ ...q, cours: t.cours, theme: t.titre }))));
  }
  function questions(evaluation) {
    const qs = tirage(evaluation ? 20 : 10), reponses = [];
    const temps = chrono();
    let i = 0;
    const suivante = () => {
      if (i >= qs.length) return terminer();
      const q = qs[i];
      const choix = melange(q.r.map((t, k) => ({ t, k })));
      const retour = el("div", { class: "jx-retour", role: "status" });
      const suite = el("div", { class: "jx-actions" });
      const boutons = choix.map(({ t, k }) => el("button", { class: "jx-rep", type: "button", html: t, onclick: () => {
        reponses[i] = { k, t };
        if (evaluation) { i++; return suivante(); }
        boutons.forEach(b => { b.disabled = true; if (b.dataset.k === "0") b.classList.add("ok"); else if (b === boutons.find(x => x.dataset.k === String(k))) b.classList.add("ko"); });
        retour.className = "jx-retour " + (k === 0 ? "ok" : "ko");
        retour.innerHTML = riche((k === 0 ? "✓ Bonne réponse ! " : "✗ Pas tout à fait. La bonne réponse est en vert. ") + (q.e || ""));
        if (k !== 0 && q.revoir) retour.append(" ", lienRevoir(q.cours, q.revoir));
        suite.append(el("button", { class: "jx-btn fort", type: "button", onclick: () => { i++; suivante(); } }, i < qs.length - 1 ? "Question suivante →" : "Voir mon score"));
        suite.querySelector("button").focus();
      } }));
      boutons.forEach((b, n) => b.dataset.k = choix[n].k);
      zone.replaceChildren(entete(el("span", { class: "jx-compte" }, `Question ${i + 1} / ${qs.length}`)), barre(i, qs.length),
        q.theme ? el("p", { class: "jx-theme" }, q.theme) : "",
        el("p", { class: "jx-question", html: q.q }), el("div", { class: "jx-choix" }, boutons), retour, suite);
      boutons[0].focus();
    };
    const terminer = () => {
      const detail = qs.map((q, n) => ({ q: net(q.q), ok: reponses[n].k === 0, donne: net(reponses[n].t), bonne: net(q.r[0]), e: net(q.e) }));
      const score = detail.filter(x => x.ok).length;
      let apres = null;
      if (evaluation) {
        const ok = score / qs.length >= .8;
        const aRevoir = [...new Map(qs.filter((q, n) => reponses[n].k !== 0 && q.revoir).map(q => [q.cours + q.revoir, q])).values()];
        apres = el("section", { class: "jx-bilan" },
          el("p", { class: "jx-retour " + (ok ? "ok" : "ko") }, ok ? "🏅 Évaluation réussie : au moins 80 % de bonnes réponses." : "Évaluation pas encore réussie : il faut au moins 80 % de bonnes réponses."),
          el("p", {}, `Temps : ${Math.floor(temps() / 60)} min ${String(temps() % 60).padStart(2, "0")} s.`),
          aRevoir.length ? el("div", {}, el("h2", {}, "📖 À revoir dans les cours"), el("div", { class: "jx-liens" }, aRevoir.map(q => lienRevoir(q.cours, q.revoir)))) : "");
      }
      fin(score, qs.length, detail, null, apres);
    };
    suivante();
  }

  /* ---------- Vrai ou faux ---------- */
  function vraiFaux() {
    const liste = melange(VRAI_FAUX[theme.id]).slice(0, 10), detail = [];
    let i = 0;
    const suivante = () => {
      if (i >= liste.length) return fin(detail.filter(x => x.ok).length, liste.length, detail);
      const [texte, vrai, pourquoi] = liste[i];
      const retour = el("div", { class: "jx-retour", role: "status" });
      const suite = el("div", { class: "jx-actions" });
      const repondre = (v, b) => {
        const ok = v === vrai;
        detail.push({ q: texte.replace(/\{([^{}]+)\}/g, "$1"), ok, donne: v ? "Vrai" : "Faux", bonne: vrai ? "Vrai" : "Faux", e: pourquoi });
        boutons.forEach(x => x.disabled = true);
        b.classList.add(ok ? "ok" : "ko");
        retour.className = "jx-retour " + (ok ? "ok" : "ko");
        retour.innerHTML = riche((ok ? "✓ Bien vu ! " : `✗ Non, c'est ${vrai ? "vrai" : "faux"}. `) + pourquoi);
        suite.append(el("button", { class: "jx-btn fort", type: "button", onclick: () => { i++; suivante(); } }, i < liste.length - 1 ? "Suivante →" : "Voir mon score"));
        suite.querySelector("button").focus();
      };
      const boutons = [el("button", { class: "jx-vf vrai", type: "button", onclick: e => repondre(true, e.currentTarget) }, "👍 Vrai"),
                       el("button", { class: "jx-vf faux", type: "button", onclick: e => repondre(false, e.currentTarget) }, "👎 Faux")];
      zone.replaceChildren(entete(el("span", { class: "jx-compte" }, `${i + 1} / ${liste.length}`)), barre(i, liste.length),
        el("p", { class: "jx-question grand", html: texte }), el("div", { class: "jx-vfs" }, boutons), retour, suite);
    };
    suivante();
  }

  /* ---------- Trouve l'intrus ---------- */
  function intrus() {
    const liste = melange(INTRUS[theme.id]), detail = [];
    let i = 0;
    const suivante = () => {
      if (i >= liste.length) return fin(detail.filter(x => x.ok).length, liste.length, detail, "intrus trouvés");
      const [items, bon, pourquoi] = liste[i];
      const retour = el("div", { class: "jx-retour", role: "status" });
      const suite = el("div", { class: "jx-actions" });
      const ordre = melange(items.map((t, k) => ({ t, k })));
      const boutons = ordre.map(({ t, k }) => el("button", { class: "jx-carte", type: "button", html: t, onclick: e => {
        const ok = k === bon;
        detail.push({ q: items.join(" · ").replace(/\{([^{}]+)\}/g, "$1"), ok, donne: t.replace(/\{([^{}]+)\}/g, "$1"), bonne: items[bon].replace(/\{([^{}]+)\}/g, "$1"), e: pourquoi });
        boutons.forEach((b, n) => { b.disabled = true; if (ordre[n].k === bon) b.classList.add("ok"); });
        if (!ok) e.currentTarget.classList.add("ko");
        retour.className = "jx-retour " + (ok ? "ok" : "ko");
        retour.innerHTML = riche((ok ? "✓ Bravo, c'est l'intrus ! " : "✗ Non, l'intrus est en vert. ") + pourquoi);
        suite.append(el("button", { class: "jx-btn fort", type: "button", onclick: () => { i++; suivante(); } }, i < liste.length - 1 ? "Suivant →" : "Voir mon score"));
        suite.querySelector("button").focus();
      } }));
      zone.replaceChildren(entete(el("span", { class: "jx-compte" }, `${i + 1} / ${liste.length}`)), barre(i, liste.length),
        el("p", { class: "jx-question" }, "Lequel n'a rien à faire avec les autres ?"), el("div", { class: "jx-cartes" }, boutons), retour, suite);
    };
    suivante();
  }

  /* ---------- Mots mêlés ---------- */
  function motsMeles() {
    const mots = MOTS_MELES[theme.id], N = 12;
    let grille, places;
    // Place chaque mot : de gauche à droite, de haut en bas ou en diagonale, sans écraser une autre lettre.
    for (let essai = 0; essai < 200; essai++) {
      grille = Array.from({ length: N }, () => Array(N).fill(""));
      places = [];
      const ok = melange(mots).sort((a, b) => b.length - a.length).every(m => {
        for (let t = 0; t < 300; t++) {
          const [dx, dy] = [[1, 0], [0, 1], [1, 1]][Math.floor(Math.random() * 3)];
          const x = Math.floor(Math.random() * (N - (dx ? m.length - 1 : 0))), y = Math.floor(Math.random() * (N - (dy ? m.length - 1 : 0)));
          if ([...m].every((c, k) => !grille[y + k * dy][x + k * dx] || grille[y + k * dy][x + k * dx] === c)) {
            [...m].forEach((c, k) => grille[y + k * dy][x + k * dx] = c);
            places.push({ m, x, y, dx, dy });
            return true;
          }
        }
        return false;
      });
      if (ok) break;
    }
    const lettres = "ABCDEFGHIJLMNOPRSTUV";
    grille.forEach(l => l.forEach((c, k) => { if (!c) l[k] = lettres[Math.floor(Math.random() * lettres.length)]; }));
    const trouves = new Set(), temps = chrono();
    let premier = null;
    const cases = grille.map((l, y) => l.map((c, x) => el("button", { class: "jx-l", type: "button", "aria-label": `Lettre ${c}, ligne ${y + 1}, colonne ${x + 1}`, onclick: () => clic(x, y) }, c)));
    const liste = el("ul", { class: "jx-mots" }, mots.map(m => el("li", { "data-m": m }, m)));
    const retour = el("p", { class: "jx-retour", role: "status" });
    const finir = el("button", { class: "jx-btn", type: "button", onclick: () => terminer(true) }, "Je donne ma langue au chat");
    zone.replaceChildren(entete(el("span", { class: "jx-compte" }, `0 / ${mots.length} mots`)), el("div", { class: "jx-mm" },
      el("div", { class: "jx-grille", style: `grid-template-columns:repeat(${N},1fr)` }, cases.flat()), el("div", {}, el("h2", {}, "Les mots à trouver"), liste)), retour, el("div", { class: "jx-actions" }, finir));
    function clic(x, y) {
      if (!premier) { premier = { x, y }; cases[y][x].classList.add("choisi"); retour.textContent = "Cliquez maintenant sur la dernière lettre du mot."; return; }
      cases[premier.y][premier.x].classList.remove("choisi");
      const p = places.find(p => !trouves.has(p.m) && ((p.x === premier.x && p.y === premier.y && p.x + (p.m.length - 1) * p.dx === x && p.y + (p.m.length - 1) * p.dy === y) ||
        (p.x === x && p.y === y && p.x + (p.m.length - 1) * p.dx === premier.x && p.y + (p.m.length - 1) * p.dy === premier.y)));
      premier = null;
      if (!p) { retour.className = "jx-retour ko"; retour.textContent = "Ce n'est pas un mot de la liste. Essayez encore !"; return; }
      marquer(p, "trouve");
      trouves.add(p.m);
      liste.querySelector(`[data-m="${p.m}"]`).classList.add("ok");
      retour.className = "jx-retour ok"; retour.textContent = `✓ ${p.m} trouvé !`;
      zone.querySelector(".jx-compte").textContent = `${trouves.size} / ${mots.length} mots`;
      if (trouves.size === mots.length) terminer(false);
    }
    function marquer(p, cls) { [...p.m].forEach((c, k) => cases[p.y + k * p.dy][p.x + k * p.dx].classList.add(cls)); }
    function terminer(abandon) {
      places.filter(p => !trouves.has(p.m)).forEach(p => marquer(p, "montre"));
      cases.flat().forEach(c => c.disabled = true);
      finir.remove();
      const detail = mots.map(m => ({ q: m, ok: trouves.has(m), donne: trouves.has(m) ? "trouvé" : "pas trouvé" }));
      const res = el("div", {});
      zone.append(res, el("div", { class: "jx-actions" }, el("button", { class: "jx-btn fort", type: "button", onclick: demarrer }, "🔄 Nouvelle grille")));
      retour.className = "jx-retour " + (abandon ? "ko" : "ok");
      retour.textContent = abandon ? "Les mots qui manquaient sont surlignés en orange." : `🎉 Tous les mots trouvés en ${Math.floor(temps() / 60)} min ${String(temps() % 60).padStart(2, "0")} s !`;
      ResultatActivite.terminer({ zone: res, titre: `${mode.titre} : ${nomTheme}`, type: mode.type, score: trouves.size, total: mots.length, detail, unite: "mots trouvés" });
    }
  }

  function demarrer() {
    if (PAGE.mode === "express") questions(false);
    else if (PAGE.mode === "evaluation") questions(true);
    else if (PAGE.mode === "vrai-faux") vraiFaux();
    else if (PAGE.mode === "intrus") intrus();
    else motsMeles();
    window.scrollTo(0, 0);
  }
  // L'écran d'accueil du jeu
  const nb = PAGE.mode === "evaluation" ? (tous ? BANQUE.length * 4 : 20) : PAGE.mode === "express" ? 10 : PAGE.mode === "vrai-faux" ? 10 : PAGE.mode === "intrus" ? INTRUS[theme.id].length : MOTS_MELES[theme.id].length;
  zone.append(entete(), el("p", { class: "jx-intro" }, mode.intro),
    PAGE.mode === "evaluation" ? el("p", { class: "jx-intro" }, `${nb} questions${tous ? ", 4 par thématique" : ", tirées au hasard dans les quiz du module"}. Prenez votre temps.`) : "",
    el("div", { class: "jx-actions" }, el("button", { class: "jx-btn fort", type: "button", onclick: demarrer }, PAGE.mode === "evaluation" ? "Commencer l'évaluation" : "Commencer")));
})();
