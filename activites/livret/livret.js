/*
  LE MOTEUR DU LIVRET : il affiche les modules écran par écran.
  Pas besoin d'y toucher pour modifier un cours : le texte se trouve dans les fichiers
  « livret-....html » du dossier activites (le mode d'emploi est dans LISEZMOI.md).
*/
const Livret = (() => {
  const CLE = "cours-bureautique:livret:";
  const calme = matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Outils ---------- */
  // {Ctrl+S} devient des touches de clavier, `=SOMME(A1)` devient une formule.
  function riche(t) {
    return String(t)
      .replace(/\{([^{}]+)\}/g, (m, s) => s.split("+").map(k => `<kbd>${k.trim()}</kbd>`).join(" + "))
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  }
  function el(balise, attributs = {}, ...enfants) {
    const n = document.createElement(balise);
    for (const [k, v] of Object.entries(attributs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === "html") n.innerHTML = riche(v);
      else if (k === "class") n.className = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    n.append(...enfants.filter(e => e !== null && e !== undefined));
    return n;
  }
  const melange = t => {
    const c = t.slice();
    for (let i = c.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [c[i], c[j]] = [c[j], c[i]];
    }
    return c;
  };
  // replaceChildren écrirait « null » à l'écran : on retire les morceaux absents.
  const remplir = (zone, ...morceaux) => zone.replaceChildren(...morceaux.filter(Boolean));
  const egal = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

  /* ---------- Module en cours ---------- */
  let M, etat, racine, numEtape = 0, numEcran = 0, retourVers = null, surEcran = false;

  const vide = () => ({ etoiles: {}, faites: {}, taches: {}, dernier: 0, temps: {}, passages: {}, resultats: {}, debutExo: {}, enCours: {}, memo: {} });
  function lire() {
    try { return Object.assign(vide(), JSON.parse(localStorage.getItem(CLE + M.id))); }
    catch { return vide(); }
  }
  function ecrire() {
    try { localStorage.setItem(CLE + M.id, JSON.stringify(etat)); } catch {}
  }

  const nbEtoiles = b =>
    b.quiz ? b.quiz.length :
    (b.trier || b.associer || b.ordre || b.defi || b.exo) ? 1 :
    (b.sim && !b.libre) ? 1 : 0;
  const totalEtape = e => e.ecrans.reduce((s, ec) => s + ec.b.reduce((t, b) => t + nbEtoiles(b), 0), 0);
  const totalModule = () => M.etapes.reduce((s, e) => s + totalEtape(e), 0);
  const gagnees = (prefixe = "") => Object.keys(etat.etoiles).filter(k => k.startsWith(prefixe)).length;

  function gagne(cle) {
    if (etat.etoiles[cle]) return;
    etat.etoiles[cle] = 1;
    ecrire();
    const c = document.querySelector(".etoiles");
    if (c) {
      c.textContent = "⭐ " + gagnees();
      c.classList.remove("pop");
      void c.offsetWidth;
      c.classList.add("pop");
    }
  }

  /* ---------- Suivi : temps par étape et résultat de chaque exercice ou jeu ---------- */
  const PAUSE_MAX = 10 * 60 * 1000;   // au-delà de 10 minutes sans changement, le poste est considéré comme inoccupé
  let etapeChrono = null, chrono = 0;
  function pointer(nouvelle) {
    const maintenant = Date.now();
    if (etapeChrono !== null && chrono) {
      etat.temps[etapeChrono] = (etat.temps[etapeChrono] || 0) + Math.min(maintenant - chrono, PAUSE_MAX);
      ecrire();
    }
    etapeChrono = nouvelle;
    chrono = maintenant;
  }
  const pourcent = (s, t) => t ? Math.round(s / t * 100) : 0;
  // Le pourcentage de réussite, avec une jauge.
  function blocScore(score, total, unite) {
    const p = pourcent(score, total);
    return el("div", { class: "score-bloc", role: "status" },
      el("strong", {}, `${p} %`),
      el("div", { class: "score-texte" }, el("span", {}, unite ? `${score} / ${total} ${unite}` : `${score} / ${total} bonne${score > 1 ? "s" : ""} réponse${score > 1 ? "s" : ""}`),
        el("div", { class: "score-jauge" }, el("i", { style: `width:${p}%;background:${p >= 80 ? "var(--vert)" : p >= 50 ? "var(--soleil-bord)" : "var(--rouge)"}` }))));
  }
  // Question par question : ce qui a été répondu et ce qu'il fallait répondre.
  function listeCorrection(detail, titre) {
    if (!detail || !detail.length) return null;
    const fautes = detail.filter(x => !x.ok).length;
    return el("details", { class: "correction", open: fautes > 0 },
      el("summary", {}, titre || (fautes ? `📋 Voir mes réponses : ${fautes} à revoir` : "📋 Voir mes réponses")),
      el("ul", {}, ...detail.map(x => el("li", { class: x.ok ? "ok" : "ko" },
        el("strong", { html: (x.ok ? "✓ " : "✗ ") + x.q }),
        x.donne ? el("span", { html: "Votre réponse : " + x.donne }) : null,
        !x.ok && x.bonne ? el("span", { class: "bonne", html: "Bonne réponse : " + x.bonne }) : null,
        !x.ok && x.e ? el("small", { html: x.e }) : null))));
  }
  // En revenant sur un écran : le dernier résultat reste visible au-dessus du jeu.
  function dernierResultat(cle) {
    const r = etat.resultats[cle];
    if (!r || !r.detail) return null;
    return el("details", { class: "correction dernier" },
      el("summary", {}, `Dernier résultat : ${pourcent(r.dernier, r.total)} % · meilleur : ${pourcent(r.meilleur, r.total)} % · voir mes réponses`),
      el("ul", {}, ...r.detail.map(x => el("li", { class: x.ok ? "ok" : "ko" },
        el("strong", { html: (x.ok ? "✓ " : "✗ ") + x.q }),
        x.donne ? el("span", { html: "Votre réponse : " + x.donne }) : null,
        !x.ok && x.bonne ? el("span", { class: "bonne", html: "Bonne réponse : " + x.bonne }) : null))));
  }
  // La réussite moyenne d'une étape, ou du module si aucun préfixe n'est donné.
  function reussite(prefixe = "") {
    const liste = Object.entries(etat.resultats).filter(([k]) => k.startsWith(prefixe)).map(([, r]) => r);
    if (!liste.length) return null;
    return Math.round(liste.reduce((s, r) => s + pourcent(r.meilleur, r.total), 0) / liste.length);
  }
  function noterResultat(cle, type, titre, score, total, debut, detail) {
    const duree = debut ? Math.min(Date.now() - debut, 4 * 3600 * 1000) : 0;
    const r = etat.resultats[cle] || { type, titre, etape: M.etapes[numEtape].titre, essais: 0, meilleur: 0, total, temps: 0 };
    r.essais++;
    r.dernier = score;
    r.meilleur = Math.max(r.meilleur, score);
    r.total = total;
    r.temps += duree;
    r.dernierTemps = duree;
    r.date = new Date().toISOString();
    if (detail) r.detail = detail;
    etat.resultats[cle] = r;
    // Sur une page de quiz, finir le quiz suffit pour cocher l'étape.
    if (M.cours || M.id === "quiz-positionnement") etat.faites[numEtape] = etat.faites[numEtape] || 1;
    ecrire();
  }

  /* ---------- Retours personnalisés : revoir une notion, s'entraîner autrement ---------- */
  function aller(titre) {
    for (let e = 0; e < M.etapes.length; e++) {
      const c = M.etapes[e].ecrans.findIndex(x => x.t === titre);
      if (c >= 0) {
        retourVers = retourVers || { e: numEtape, c: numEcran };
        ouvrir(e, c);
        return;
      }
    }
  }
  // Le positionnement est commun à tout le site : une réponse donnée quelque part n'est plus redemandée ailleurs.
  const CLE_POS = "cours-bureautique:positionnement";
  function lirePos() {
    try { return Object.assign({ reponses: {}, modules: {} }, JSON.parse(localStorage.getItem(CLE_POS))); }
    catch { return { reponses: {}, modules: {} }; }
  }
  function ecrirePos(p) {
    try { localStorage.setItem(CLE_POS, JSON.stringify(p)); } catch {}
  }
  function noterPos(texte, k, donne) {
    const p = lirePos();
    p.reponses[texte] = { k, donne };
    ecrirePos(p);
  }
  function noterPosModule(cle, n, t) {
    const p = lirePos();
    p.modules[cle] = { n, t };
    ecrirePos(p);
  }
  function memoriserAller(cible, vers) {
    try {
      if (cible) sessionStorage.setItem(CLE + "aller", cible);
      if (vers) pousserRetour(vers);
    } catch {}
  }
  // On garde l'endroit quitté pour y revenir : le bouton de retour est dans la barre du site.
  const lirePile = () => { try { return JSON.parse(sessionStorage.getItem(CLE + "pile")) || []; } catch { return []; } };
  function pousserRetour(vers) {
    const pile = lirePile();
    pile.push({
      de: etat.meta.fichier,
      vers,
      e: surEcran ? numEtape : null,
      c: surEcran ? numEcran : null,
      texte: M.cours ? "↩ Retour au quiz" : M.numero ? "↩ Retour à la leçon" : "↩ Retour"
    });
    ecrirePile(pile);
  }
  // Ouvert depuis un dossier, le site et ses pages ne partagent pas leur mémoire : on prévient aussi la barre du site.
  function ecrirePile(pile) {
    try { sessionStorage.setItem(CLE + "pile", JSON.stringify(pile)); } catch {}
    try { if (parent !== window) parent.postMessage({ type: "cours-pile", pile }, "*"); } catch {}
  }
  // Le même retour, proposé à la fin d'un quiz ou d'un exercice.
  function boutonRetour() {
    const pile = lirePile();
    const haut = pile[pile.length - 1];
    if (!haut || haut.vers !== etat.meta.fichier) return null;
    return el("a", { class: "btn btn-fort", href: "../index.html#/" + haut.de, target: "_top", onclick: () => {
      pile.pop();
      ecrirePile(pile);
      try { if (haut.e !== null) sessionStorage.setItem(CLE + "position", JSON.stringify({ e: haut.e, c: haut.c })); } catch {}
    } }, haut.texte);
  }
  function aides(cles) {
    const zone = el("div", { class: "aides" });
    [...new Set(cles)].forEach(v => {
      const n = M.notions && M.notions[v];
      if (!n) return;
      if (n.va && M.cours) zone.append(el("a", { class: "btn btn-petit", href: "../index.html#/" + M.cours, target: "_top", onclick: () => memoriserAller(n.va, M.cours), html: "📖 Revoir : " + n.titre }));
      else if (n.va) zone.append(el("button", { class: "btn btn-petit", type: "button", onclick: () => aller(n.va), html: "📖 Revoir : " + n.titre }));
      if (n.jeu) zone.append(el("a", { class: "btn btn-petit", href: "../index.html#/" + n.jeu.fichier, target: "_top", onclick: () => memoriserAller(null, n.jeu.fichier), html: "🎮 S'entraîner : " + n.jeu.titre }));
    });
    return zone.children.length ? zone : null;
  }
  function plusLoin() {
    return M.plus ? el("div", { class: "aides" }, el("a", { class: "btn btn-petit", href: "../index.html#/" + M.plus.fichier, target: "_top", onclick: () => memoriserAller(null, M.plus.fichier), html: "🚀 Pour aller plus loin : " + M.plus.titre })) : null;
  }

  /* ---------- Accueil du module ---------- */
  // Combien de questions du positionnement de cette étape ont déjà une réponse, ici ou dans le quiz général ?
  function etatPositionnement(e) {
    const b = e.ecrans.flatMap(c => c.b).find(x => x.depart);
    if (!b) return null;
    const r = lirePos().reponses;
    return { n: b.quiz.filter(q => r[q.q]).length, t: b.quiz.length };
  }
  // Le résultat du quiz final de ce module, enregistré par sa page de quiz.
  function resultatFinal() {
    if (!M.quizPage) return null;
    try {
      const q = JSON.parse(localStorage.getItem(CLE + M.quizPage));
      return q ? Object.values(q.resultats || {}).find(r => r.type === "Quiz final") || null : null;
    } catch { return null; }
  }
  // Depuis une page de quiz : où en est le stagiaire dans le cours ?
  function avancementCours() {
    if (!M.cours) return null;
    try {
      const c = JSON.parse(localStorage.getItem(CLE + M.id.replace(/^quiz-/, "")));
      return c && c.meta ? { faites: Object.keys(c.faites || {}).length, total: c.meta.etapes } : { faites: 0, total: 0 };
    } catch { return null; }
  }

  // Un long module se découpe en parties : de grandes tuiles d'abord, la liste des étapes ensuite.
  let partie = -1;
  function partiesDuModule() {
    let debut = 0;
    const liste = (M.parties || []).map(p => {
      const bornes = { ...p, debut, fin: debut + p.etapes };
      debut = bornes.fin;
      return bornes;
    });
    return debut === M.etapes.length ? liste : [];   // un découpage incomplet : on garde la liste simple
  }
  function reussitePartie(p) {
    const liste = Object.entries(etat.resultats).filter(([k]) => +k.split(".")[0] >= p.debut && +k.split(".")[0] < p.fin).map(([, r]) => r);
    return liste.length ? Math.round(liste.reduce((s, r) => s + pourcent(r.meilleur, r.total), 0) / liste.length) : null;
  }
  function tuilesParties(parties, ici) {
    return el("nav", { class: "parties", "aria-label": "Les parties du module" }, ...parties.map((p, k) => {
      const nb = M.etapes.filter((e, i) => i >= p.debut && i < p.fin && etat.faites[i]).length;
      const total = p.fin - p.debut;
      const score = reussitePartie(p);
      const finie = nb === total;
      const enCours = ici >= p.debut && ici < p.fin;
      return el("button", {
        class: "partie" + (finie ? " fait" : "") + (enCours ? " ici" : ""),
        type: "button",
        onclick: () => { partie = k; accueil(); }
      },
        el("span", { class: "partie-icone", "aria-hidden": "true" }, p.icone || "📘"),
        el("strong", {}, p.titre),
        p.intro ? el("span", { class: "partie-intro" }, p.intro) : null,
        el("span", { class: "partie-etat" }, `${finie ? "✓ " : ""}${nb} / ${total} étape${total > 1 ? "s" : ""}${score !== null ? ` · 🎯 ${score} %` : ""}${enCours ? " · À vous ▶" : ""}`));
    }));
  }

  function accueil() {
    arreterVoix();
    pointer(null);
    retourVers = null;
    surEcran = false;
    const total = totalModule();
    const n = gagnees();
    const faites = M.etapes.filter((e, i) => etat.faites[i]).length;
    const fini = faites === M.etapes.length;
    const pct = M.etapes.length ? faites / M.etapes.length * 100 : 0;
    const parties = partiesDuModule();
    const p = parties[partie];

    const heros = p ? el("header", { class: "heros heros-partie" }, el("div", { class: "heros-in" },
      el("div", { class: "heros-icone", "aria-hidden": "true" }, p.icone || M.icone),
      el("small", {}, `${M.titre} · partie ${partie + 1} / ${parties.length}`),
      el("h1", {}, p.titre)
    )) : el("header", { class: "heros" }, el("div", { class: "heros-in" },
      el("div", { class: "heros-icone", "aria-hidden": "true" }, M.icone),
      el("small", {}, M.numero ? `MODULE ${M.numero}` : (M.etiquette || "MÉMO")),
      el("h1", { html: M.titre }),
      el("p", { html: M.accroche }),
      el("div", { class: "bilan" },
        el("span", {}, `${faites} / ${M.etapes.length} étapes`),
        el("div", { class: "jauge", role: "img", "aria-label": `${Math.round(pct)} % des étapes terminées` }, el("i", { style: `width:${pct}%` })),
        total ? el("span", {}, `⭐ ${n} / ${total}`) : null,
        reussite() !== null ? el("span", {}, `🎯 ${reussite()} % de réussite`) : null)
    ));

    const page = el("main", { class: "page" });
    if (fini && !p) page.append(badge(total, n));

    const liste = el("ol", { class: "chemin" });
    const ici = M.etapes.findIndex((e, i) => !etat.faites[i]);
    M.etapes.forEach((e, i) => {
      if (p && (i < p.debut || i >= p.fin)) return;
      const pos = etatPositionnement(e);
      const fait = etat.faites[i] || (pos && pos.n === pos.t);
      const t = totalEtape(e);
      liste.append(el("li", {}, el("button", {
        class: "arret" + (fait ? " fait" : "") + (i === ici ? " ici" : ""),
        type: "button",
        onclick: () => ouvrir(i, 0)
      },
        el("span", { class: "arret-num" }, fait ? "✓" : String(i + 1)),
        el("span", {}, el("strong", {}, e.icone ? `${e.icone} ${e.titre}` : e.titre), e.resume ? el("small", {}, e.resume) : null),
        el("span", { class: "arret-etat" }, pos && pos.n === pos.t && !etat.faites[i] ? "✓ Déjà fait" : fait ? (reussite(i + ".") !== null ? `🎯 ${reussite(i + ".")} % · ⭐ ${gagnees(i + ".")} / ${t}` : t ? `⭐ ${gagnees(i + ".")} / ${t}` : "Terminé") : reussite(i + ".") !== null ? `🎯 ${reussite(i + ".")} %` : pos && pos.n ? `✓ ${pos.n} / ${pos.t} déjà faites` : i === ici ? "À vous ▶" : "")
      )));
    });
    const barreAccueil = el("div", { class: "barre-btn", style: "margin:0 0 18px" });
    if (p) barreAccueil.append(el("button", { class: "btn", type: "button", onclick: () => { partie = -1; accueil(); } }, "← Toutes les parties"));
    else if (!fini && etat.passages[etat.dernier] && !M.cours) {
      const titreEtape = M.etapes[etat.dernier] ? M.etapes[etat.dernier].titre : "";
      if (titreEtape) barreAccueil.append(el("button", { class: "btn btn-fort", type: "button", onclick: () => ouvrir(etat.dernier, Math.min(etat.dernierEcran || 0, M.etapes[etat.dernier].ecrans.length - 1)) }, `▶ Reprendre : ${titreEtape}`));
    }
    if (M.quizPage) {
      const q = (cible, texte, fort) => el("a", { class: "btn" + (fort ? " btn-fort" : ""), href: "../index.html#/" + M.quizPage, target: "_top", onclick: () => memoriserAller(cible, M.quizPage) }, texte);
      const finalQ = resultatFinal();
      const valide = finalQ && finalQ.meilleur / finalQ.total >= .8;
      if (!p) barreAccueil.append(q("Quiz de positionnement", (() => {
          const fait = lirePos().modules[M.quizPage.replace(/^quiz-/, "")];
          return fait ? `✓ Quiz de positionnement : ${pourcent(fait.n, fait.t)} %` : "🧭 Quiz de positionnement : mes priorités";
        })()));
      barreAccueil.append(q("Quiz final", valide ? `🏅 Quiz final validé : ${finalQ.meilleur} / ${finalQ.total}` : finalQ ? `🏁 Quiz final : meilleur score ${finalQ.meilleur} / ${finalQ.total}` : "🏁 Quiz final du module", fini && !valide));
    }
    if (barreAccueil.children.length) page.append(barreAccueil);
    if (M.cours) {
      // Sur une page de quiz, le quiz final se trouve sans faire défiler toute la liste.
      const iFinal = M.etapes.findIndex(e => e.titre === "Quiz final");
      page.append(el("div", { class: "barre-btn", style: "margin:0 0 18px" },
        el("button", { class: "btn btn-fort", type: "button", onclick: () => ouvrir(iFinal, 0) }, "🏁 Aller au quiz final"),
        el("a", { class: "btn", href: "../index.html#/" + M.cours, target: "_top" }, "📚 Retour au cours")));
    }
    page.append(parties.length && !p ? tuilesParties(parties, ici) : liste);
    if (p && parties[partie + 1]) {
      const finie = M.etapes.every((e, i) => i < p.debut || i >= p.fin || etat.faites[i]);
      page.append(el("div", { class: "barre-btn" },
        el("button", { class: "btn" + (finie ? " btn-fort" : ""), type: "button", onclick: () => { partie++; accueil(); } }, `Partie suivante : ${parties[partie + 1].titre} →`)));
    } else if (M.suite) page.append(el("div", { class: "barre-btn" },
      el("a", { class: "btn" + (fini ? " btn-fort" : ""), href: "../index.html#/" + M.suite.fichier, target: "_top" }, `Module suivant : ${M.suite.titre} →`)));

    racine.replaceChildren(heros, page);
    window.scrollTo(0, 0);
  }

  function badge(total, n) {
    const part = total ? n / total : 1;
    const [icone, nom] = part >= .85 ? ["🥇", "Badge or"] : part >= .5 ? ["🥈", "Badge argent"] : ["🥉", "Badge bronze"];
    return el("div", { class: "badge" },
      el("b", { "aria-hidden": "true" }, icone),
      el("div", {},
        el("h2", {}, `${nom} : module terminé !`),
        el("p", {}, part >= .85 ? "Bravo, vous maîtrisez ce module." : "Vous pouvez refaire les étapes pour gagner les étoiles qui manquent.")));
  }

  /* ---------- Une étape, écran par écran ---------- */
  function ouvrir(i, j) {
    if (etapeChrono !== i) etat.passages[i] = (etat.passages[i] || 0) + 1;
    partie = partiesDuModule().findIndex(p => i >= p.debut && i < p.fin);
    pointer(i);
    numEtape = i;
    numEcran = j;
    surEcran = true;
    etat.dernier = i;
    etat.dernierEcran = j;
    ecrire();
    dessiner();
  }

  function dessiner() {
    arreterVoix();
    const e = M.etapes[numEtape];
    const ec = e.ecrans[numEcran];
    const n = e.ecrans.length;

    const haut = el("div", { class: "haut" },
      el("button", { class: "haut-btn", type: "button", onclick: accueil, "aria-label": "Revenir à la liste des étapes" }, "☰ Étapes"),
      el("div", { class: "haut-titre" }, e.titre),
      gagnees() || totalModule() ? el("div", { class: "etoiles", title: "Étoiles gagnées" }, "⭐ " + gagnees()) : null,
      "speechSynthesis" in window ? el("button", { class: "haut-btn voix", type: "button", "aria-pressed": "false", title: "Écouter cet écran", onclick: basculerVoix },
        "🔊", el("span", { class: "invisible" }, "Écouter cet écran")) : null,
      el("button", { class: "haut-btn", type: "button", title: "Agrandir le texte", "aria-pressed": String(document.documentElement.classList.contains("grand")), onclick: basculerTaille }, "A+"));

    const avance = el("div", { class: "avance", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": n, "aria-valuenow": numEcran + 1, "aria-label": "Avancement de l'étape" },
      el("i", { style: `width:${(numEcran + 1) / n * 100}%` }));

    const ecran = el("main", { class: "ecran" });
    const titre = el("h2", { tabindex: "-1", html: ec.t });
    ecran.append(titre);
    ec.b.forEach((b, k) => ecran.append(bloc(b, `${numEtape}.${numEcran}.${k}`)));

    const bas = el("nav", { class: "bas", "aria-label": "Changer d'écran" },
      el("button", { class: "btn", type: "button", disabled: numEcran === 0, onclick: () => ouvrir(numEtape, numEcran - 1) }, "← Précédent"),
      el("span", { class: "compteur" }, `${numEcran + 1} / ${n}`),
      numEcran < n - 1
        ? el("button", { class: "btn btn-fort", type: "button", onclick: () => ouvrir(numEtape, numEcran + 1) }, "Suivant →")
        : el("button", { class: "btn btn-fort", type: "button", onclick: finEtape }, "Terminer ✓"));

    const bande = retourVers ? el("div", { class: "bande-retour" }, el("button", { class: "btn btn-petit btn-fort", type: "button", onclick: () => {
      const r = retourVers;
      retourVers = null;
      ouvrir(r.e, r.c);
    } }, "↩ Revenir à l'exercice")) : null;
    racine.replaceChildren(...[haut, avance, bande, ecran, bas].filter(Boolean));
    window.scrollTo(0, 0);
    titre.focus({ preventScroll: true });
  }

  function finEtape() {
    arreterVoix();
    pointer(null);
    retourVers = null;
    surEcran = false;
    etat.faites[numEtape] = (etat.faites[numEtape] || 0) + 1;
    ecrire();
    const e = M.etapes[numEtape];
    const t = totalEtape(e);
    const n = gagnees(numEtape + ".");
    const suivante = M.etapes[numEtape + 1];
    const fini = M.etapes.every((x, i) => etat.faites[i]);

    const zone = el("main", { class: "ecran fete" },
      el("div", { class: "gros", "aria-hidden": "true" }, fini ? "🏆" : t && n === t ? "🌟" : "🎉"),
      el("h2", { tabindex: "-1" }, fini ? "Module terminé, bravo !" : "Étape terminée !"),
      reussite(numEtape + ".") !== null ? el("p", { class: "question" }, `🎯 ${reussite(numEtape + ".")} % de réussite dans cette étape`) : null,
      t ? el("p", {}, `${n} étoile${n > 1 ? "s" : ""} sur ${t} dans cette étape.`) : null,
      fini ? badge(totalModule(), gagnees()) : null,
      el("div", { class: "barre-btn" },
        suivante ? el("button", { class: "btn btn-fort", type: "button", onclick: () => ouvrir(numEtape + 1, 0) }, `Étape suivante : ${suivante.titre} →`) : null,
        fini && M.quizPage ? el("a", { class: "btn btn-fort", href: "../index.html#/" + M.quizPage, target: "_top", onclick: () => memoriserAller("Quiz final", M.quizPage) }, "🏁 Passer le quiz final") : null,
        fini && M.suite ? el("a", { class: "btn" + (M.quizPage ? "" : " btn-fort"), href: "../index.html#/" + M.suite.fichier, target: "_top" }, `Module suivant : ${M.suite.titre} →`) : null,
        boutonRetour(),
        el("button", { class: "btn", type: "button", onclick: accueil }, "Liste des étapes"),
        t && n < t ? el("button", { class: "btn", type: "button", onclick: () => ouvrir(numEtape, 0) }, "Refaire l'étape") : null));
    racine.replaceChildren(zone);
    window.scrollTo(0, 0);
    if (!calme.matches) confettis(fini ? 70 : 28);
  }

  function confettis(nb) {
    const couleurs = ["#ffc83d", "#ff6b6b", "#4dabf7", "#51cf66", "#cc5de8"];
    for (let i = 0; i < nb; i++) {
      const c = el("span", { class: "confetti", "aria-hidden": "true",
        style: `left:${Math.random() * 100}vw;background:${couleurs[i % 5]};animation-delay:${Math.random() * .5}s` });
      c.addEventListener("animationend", () => c.remove());
      document.body.append(c);
    }
  }

  /* ---------- Écouter et agrandir ---------- */
  function arreterVoix() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    const b = document.querySelector(".voix");
    if (b) b.setAttribute("aria-pressed", "false");
  }
  function basculerVoix(ev) {
    const bouton = ev.currentTarget;
    if (speechSynthesis.speaking) { arreterVoix(); return; }
    // Les simulations et les jeux se font à l'écran : on lit le cours, un morceau de texte à la fois.
    const morceaux = [...document.querySelectorAll(".ecran :is(h2, h3, p, li, th, td, .encadre span, .encadre .titre, .qqc strong, .qqc span, .carte-r strong, .carte-r span, .tache span)")]
      .filter(n => !n.closest(".sim, .jeu, .figure"))
      .map(n => n.textContent.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    const phrases = morceaux.flatMap(m => m.match(/[^.!?]+[.!?]*/g) || []);
    if (!phrases.length) return;
    bouton.setAttribute("aria-pressed", "true");
    phrases.forEach((p, i) => {
      const u = new SpeechSynthesisUtterance(p.trim());
      u.lang = "fr-FR";
      u.rate = .95;
      if (i === phrases.length - 1) u.onend = () => bouton.setAttribute("aria-pressed", "false");
      speechSynthesis.speak(u);
    });
  }
  function basculerTaille(ev) {
    const grand = document.documentElement.classList.toggle("grand");
    ev.currentTarget.setAttribute("aria-pressed", String(grand));
    try { localStorage.setItem(CLE + "grand", grand ? "1" : ""); } catch {}
  }

  /* ---------- Les blocs de contenu ---------- */
  function bloc(b, cle) {
    const zone = el("div", { class: "bloc" });
    if (b.p) zone.append(...[].concat(b.p).map(t => el("p", { html: t })));
    else if (b.h) zone.append(el("h3", { html: b.h }));
    else if (b.liste) zone.append(listeSimple(b.liste));
    else if (b.astuce) zone.append(encadre("astuce", "💡", b.astuce));
    else if (b.attention) zone.append(encadre("attention", "⚠️", b.attention));
    else if (b.retenir) zone.append(encadre("retenir", "📌", b.retenir, "À retenir"));
    else if (b.note) zone.append(encadre("note", "📝", b.note));
    else if (b.img) return figure(b);
    else if (b.cartes) zone.append(cartes(b.cartes));
    else if (b.onglets) zone.append(onglets(b.onglets));
    else if (b.pas) zone.append(pasAPas(b.pas, b.progressif));
    else if (b.table) zone.append(tableau(b.table));
    else if (b.qqc) zone.append(qqc(b.qqc));
    else if (b.quiz) zone.append(quiz(b, cle));
    else if (b.trier) zone.append(...[dernierResultat(cle), trier(b.trier, cle)].filter(Boolean));
    else if (b.associer) zone.append(...[dernierResultat(cle), associer(b, cle)].filter(Boolean));
    else if (b.ordre) zone.append(...[dernierResultat(cle), ordre(b, cle)].filter(Boolean));
    else if (b.defi) zone.append(defi(b.defi, cle));
    else if (b.activite) zone.append(lienActivite(b.activite));
    else if (b.video) zone.append(lienVideo(b.video));
    else if (b.revele) zone.append(revele(b.revele));
    else if (b.exo) zone.append(exercice(b.exo, cle));
    else if (b.fiche) zone.append(fiche(b.fiche));
    else if (b.sim) {
      const sim = el("div", { class: "sim" });
      const lancer = typeof Simulations !== "undefined" && Simulations[b.sim];
      const debut = Date.now();
      const titreSim = ec => (M.etapes[numEtape].titre);
      if (lancer) lancer(sim, b, {
        reussi: (r = {}) => { gagne(cle + ".s"); noterResultat(cle, r.type || "Simulateur", M.etapes[numEtape].titre, r.score ?? 1, r.total ?? 1, debut, r.detail); },
        el, riche, melange, blocScore, listeCorrection,
        positionnement: { lire: lirePos, ecrire: ecrirePos, noter: noterPos, module: noterPosModule },
        memoire: { lire: () => etat.memo[cle], garder: v => { etat.memo[cle] = v; ecrire(); }, oublier: () => { delete etat.memo[cle]; ecrire(); } }
      });
      else sim.textContent = "Simulation indisponible : " + b.sim;
      zone.append(sim);
    }
    return zone;
  }

  const listeSimple = t => el("ul", { class: "liste" }, ...t.map(x => el("li", { html: x })));

  function contenu(c) {
    // Un texte, une liste ou plusieurs blocs : on accepte les trois.
    if (typeof c === "string") return el("div", { html: c });
    if (Array.isArray(c)) return listeSimple(c);
    return bloc(c, "x");
  }

  function encadre(type, icone, texte, titre) {
    return el("div", { class: "encadre " + type },
      el("b", { "aria-hidden": "true" }, icone),
      el("div", {}, titre ? el("strong", { class: "titre" }, titre) : null,
        Array.isArray(texte) ? listeSimple(texte) : el("span", { html: texte })));
  }

  function figure(b) {
    const img = el("img", { src: "livret/images/" + b.img + ".webp", alt: b.alt || "", loading: "lazy", decoding: "async" });
    const bouton = el("button", { type: "button", title: "Agrandir l'image", onclick: () => zoom(img) }, img);
    return el("figure", { class: "figure" }, bouton, b.leg ? el("figcaption", { html: b.leg }) : null);
  }
  function zoom(img) {
    const retour = document.activeElement;
    const z = el("button", { class: "zoom", type: "button", "aria-label": "Fermer l'image", onclick: () => { z.remove(); retour && retour.focus(); } },
      el("img", { src: img.src, alt: img.alt }));
    document.body.append(z);
    z.focus();
    z.addEventListener("keydown", e => { if (e.key === "Escape") z.click(); });
  }

  function cartes(t) {
    return el("div", {},
      el("div", { class: "cartes" }, ...t.map(([recto, verso]) => {
        const c = el("button", { class: "carte-r", type: "button", "aria-expanded": "false" },
          el("strong", { html: recto }), el("small", {}, "Retourner la carte ↻"));
        c.addEventListener("click", () => {
          const vue = c.classList.toggle("vue");
          c.setAttribute("aria-expanded", String(vue));
          c.replaceChildren(el("strong", { html: recto }), vue ? el("span", { html: verso }) : el("small", {}, "Retourner la carte ↻"));
        });
        return c;
      })));
  }

  function onglets(t) {
    const corps = el("div", { class: "onglet-corps", role: "tabpanel" });
    const tete = el("div", { class: "onglets-tete", role: "tablist" });
    const choisir = i => {
      [...tete.children].forEach((b, k) => b.setAttribute("aria-selected", String(k === i)));
      corps.replaceChildren(contenu(t[i][1]));
    };
    t.forEach(([nom], i) => tete.append(el("button", { class: "onglet", type: "button", role: "tab", onclick: () => choisir(i), html: nom })));
    choisir(0);
    return el("div", {}, tete, corps);
  }

  function pasAPas(t, progressif = true) {
    const ol = el("ol", { class: "pas" });
    if (!progressif || t.length < 3) {
      t.forEach(x => ol.append(el("li", { html: x })));
      return ol;
    }
    let n = 0;
    const suite = el("button", { class: "btn btn-petit", type: "button" }, "Étape suivante ↓");
    const avance = () => {
      ol.append(el("li", { html: t[n++] }));
      if (n >= t.length) tout.remove();
    };
    suite.addEventListener("click", avance);
    const toutVoir = el("button", { class: "btn btn-petit", type: "button", onclick: () => { while (n < t.length) ol.append(el("li", { html: t[n++] })); tout.remove(); } }, "Tout afficher");
    const tout = el("div", { class: "barre-btn" }, suite, toutVoir);
    avance();
    return el("div", {}, ol, tout);
  }

  function tableau({ tete, lignes }) {
    return el("div", { class: "tableau-wrap" }, el("table", { class: "tableau" },
      el("thead", {}, el("tr", {}, ...tete.map(x => el("th", { scope: "col", html: x })))),
      el("tbody", {}, ...lignes.map(l => el("tr", {}, ...l.map(x => el("td", { html: x })))))));
  }

  function qqc({ quoi, pourquoi, comment, retenir }) {
    const d = (t, x) => el("div", {}, el("strong", {}, t), el("span", { html: x }));
    const n = el("div", {}, el("div", { class: "qqc" }, d("QUOI ?", quoi), d("POURQUOI ?", pourquoi), d("COMMENT ?", comment)));
    if (retenir) {
      n.append(el("div", { style: "height:11px" }), encadre("retenir", "📌", retenir, "À retenir"));
    }
    return n;
  }

  function revele({ bouton, contenu: c }) {
    const zone = el("div", {});
    const b = el("button", { class: "btn", type: "button", onclick: () => { zone.replaceChildren(...[].concat(c).map(x => bloc(x, "x"))); } }, bouton);
    zone.append(b);
    return zone;
  }

  function lienActivite({ fichier, titre, texte, icone, etape }) {
    return el("a", { class: "lien-act", href: "../index.html#/" + fichier, target: "_top", onclick: () => memoriserAller(etape, fichier) },
      el("b", { "aria-hidden": "true" }, icone || "🎯"),
      el("span", {}, el("strong", { html: titre }), texte ? el("small", { html: texte }) : null));
  }
  function lienVideo({ url, titre }) {
    return el("a", { class: "lien-act", href: url, target: "_blank", rel: "noopener" },
      el("b", { "aria-hidden": "true" }, "🎬"),
      el("span", {}, el("strong", { html: titre }), el("small", {}, "La vidéo s'ouvre dans un nouvel onglet.")));
  }

  /* ---------- Quiz : une question à la fois, réponses mélangées ---------- */
  function quiz(b, cle) {
    const qs = b.quiz;
    const jeu = el("div", { class: "jeu" });
    const titreQuiz = b.titre ? b.titre : M.etapes[numEtape].titre;
    // Le quiz en cours reste en mémoire : on peut le quitter pour revoir une notion et le reprendre.
    let partie = etat.enCours[cle] || null;
    let i = partie ? partie.i : 0;
    const nouvellePartie = () => { partie = { i: 0, rep: [], reprises: 0, debut: Date.now() }; i = 0; sauver(); };
    // Positionnement : on reprend ce qui a déjà été répondu, puis on pose le reste.
    function demarrerPositionnement() {
      nouvellePartie();
      const deja = lirePos().reponses;
      qs.forEach((q, n) => {
        const r = deja[q.q];
        if (!r) return;
        partie.rep[n] = { k: r.k, donne: r.donne };
        partie.reprises++;
        if (r.k === 0) gagne(`${cle}.q${n}`);
      });
      const libre = qs.findIndex((q, n) => !partie.rep[n]);
      if (libre < 0) { terminer(); return; }
      i = libre;
      sauver();
      question();
    }
    const noteReprise = () => b.depart && partie && partie.reprises
      ? el("p", { class: "conseil-final" }, `✓ ${partie.reprises} question${partie.reprises > 1 ? "s" : ""} déjà faite${partie.reprises > 1 ? "s" : ""} dans le quiz de positionnement général : vos réponses sont reprises.`)
      : null;
    const sauver = () => { partie.i = i; etat.enCours[cle] = partie; ecrire(); };
    const entete = () => el("div", { class: "jeu-titre" }, el("span", { html: b.titre || "Quiz" }), el("small", {}, qs.length > 1 ? `Question ${i + 1} / ${qs.length}` : ""));

    function question() {
      if (!partie) nouvellePartie();
      const q = qs[i];
      const dejaRepondu = partie.rep[i];
      const retour = el("div", { class: "retour", role: "status" });
      const choix = el("div", { class: "choix" });
      const suite = el("div", { class: "barre-btn" });
      const reponses = melange(q.r.map((t, k) => ({ t, k })));
      if (b.depart) reponses.push({ t: "Je ne sais pas", k: -1 });
      const montrer = k => {
        choix.querySelectorAll(".rep").forEach(x => {
          x.disabled = true;
          if (x.dataset.k === "0") x.classList.add("ok");
          else if (x.dataset.k === String(k)) x.classList.add("ko");
        });
        if (k === 0) {
          retour.className = "retour ok";
          retour.innerHTML = riche("Bonne réponse ! ⭐" + (q.e ? " " + q.e : ""));
        } else {
          retour.className = "retour ko";
          retour.innerHTML = riche("Pas tout à fait. La bonne réponse est en vert." + (q.e ? " " + q.e : ""));
          // Pendant le quiz de positionnement, les priorités sont données à la fin, toutes ensemble.
          const aide = q.v && !b.depart ? aides([q.v]) : null;
          if (aide) suite.append(aide);
        }
        suite.append(el("button", { class: "btn btn-petit", type: "button", onclick: () => {
          i++;
          if (i < qs.length) { sauver(); question(); } else terminer();
        } }, i < qs.length - 1 ? "Question suivante →" : "Voir mon score"));
      };
      reponses.forEach(({ t, k }) => {
        choix.append(el("button", { class: "rep", type: "button", "data-k": k, html: t, onclick: () => {
          partie.rep[i] = { k, donne: t };
          if (b.depart) noterPos(q.q, k, t);
          if (k === 0) gagne(`${cle}.q${i}`);
          sauver();
          montrer(k);
        } }));
      });
      remplir(jeu, entete(), noteReprise(), conseilFinal(), el("p", { class: "question", html: q.q }), choix, retour, suite);
      if (dejaRepondu) montrer(dejaRepondu.k);
    }
    // Le quiz final reste ouvert à tout moment, avec un conseil si le cours n'est pas terminé.
    function conseilFinal() {
      if (!b.final || i > 0) return null;
      const a = avancementCours();
      if (!a || (a.total && a.faites >= a.total)) return null;
      return el("p", { class: "conseil-final", html: a.total
        ? `💡 Vous avez terminé ${a.faites} étape${a.faites > 1 ? "s" : ""} sur ${a.total} du cours. Ce quiz est conseillé à la fin, mais vous pouvez le passer dès maintenant et le refaire autant de fois que vous voulez.`
        : "💡 Ce quiz est conseillé à la fin du cours, mais vous pouvez le passer dès maintenant et le refaire autant de fois que vous voulez." });
    }
    function terminer() {
      const detail = qs.map((q, n) => {
        const r = partie.rep[n] || { k: -1, donne: "Je ne sais pas" };
        return { q: q.q, donne: r.donne, bonne: q.r[0], ok: r.k === 0, e: q.e, v: q.v };
      });
      const score = detail.filter(x => x.ok).length;
      noterResultat(cle, b.depart ? "Quiz de positionnement" : b.final ? "Quiz final" : "Quiz", titreQuiz, score, qs.length, partie.debut, detail);
      delete etat.enCours[cle];
      partie = null;
      ecrire();
      if (b.depart) noterPosModule(M.id.replace(/^quiz-/, ""), score, qs.length);
      resultat();
    }
    function resultat() {
      const r = etat.resultats[cle];
      const detail = r.detail;
      const score = r.dernier;
      const part = score / qs.length;
      const rates = detail.filter(x => !x.ok && x.v).map(x => x.v);
      const valide = b.final && part >= .8;
      const conseils = rates.length ? aides(rates) : plusLoin();
      remplir(jeu,
        el("div", { class: "jeu-titre" }, el("span", { html: b.titre || "Quiz" }), r.essais > 1 ? el("small", {}, `Essai n° ${r.essais} · meilleur score : ${pourcent(r.meilleur, r.total)} %`) : null),
        blocScore(score, qs.length),
        el("p", { class: "question" }, `${part === 1 ? "🌟 Sans faute !" : part >= .6 ? "👏 Bien joué !" : "💪 Revoyez ces notions et réessayez."}${b.depart ? " C'est votre point de départ." : ""}`),
        b.final ? el("p", { class: valide ? "retour ok" : "retour ko" }, valide ? "🏅 Module validé : vous avez au moins 80 % de bonnes réponses." : "Module pas encore validé : il faut au moins 80 % de bonnes réponses.") : null,
        rates.length && conseils ? el("p", { style: "margin:12px 0 6px;font-weight:800" }, b.depart ? "🎯 À travailler en priorité :" : "Pour progresser sur ce que vous avez manqué :") : null,
        b.depart && !rates.length ? el("p", { class: "retour ok" }, "Vous semblez déjà à l'aise : allez directement au quiz final, ou piochez dans le module ce qui vous intéresse.") : null,
        conseils,
        el("div", { class: "barre-btn" }, boutonRetour(), el("button", { class: "btn btn-petit", type: "button", onclick: () => { nouvellePartie(); question(); } }, b.final && !valide ? "Repasser le quiz final" : "Recommencer")),
        listeCorrection(detail));
    }
    // En revenant : le quiz en cours reprend, un quiz terminé montre son résultat et ses réponses.
    if (partie) question();
    else if (etat.resultats[cle] && etat.resultats[cle].detail) resultat();
    else if (b.depart) demarrerPositionnement();
    else question();
    return jeu;
  }

  /* ---------- Trier : une carte à la fois, à ranger dans le bon bac ---------- */
  function trier({ titre, consigne, bacs, items, v }, cle) {
    const jeu = el("div", { class: "jeu" });
    const ranges = bacs.map(() => []);
    let pile, erreurs, debut, essais;

    function depart() {
      debut = Date.now();
      essais = {};
      pile = melange(items);
      erreurs = 0;
      ranges.forEach(r => r.length = 0);
      suivant();
    }
    function suivant() {
      if (!pile.length) return fini();
      const [texte, bon, pourquoi] = pile[0];
      const retour = el("div", { class: "retour", role: "status" });
      const carte = el("div", { class: "pile", html: texte });
      remplir(jeu, tete(), carte,
        el("div", { class: "bacs" }, ...bacs.map((nom, k) => el("button", { class: "bac", type: "button", html: nom, onclick: () => {
          if (k === bon) {
            pile.shift();
            ranges[k].push(texte);
            suivant();
          } else {
            erreurs++;
            (essais[texte] = essais[texte] || []).push(nom);
            carte.classList.remove("secoue");
            void carte.offsetWidth;
            carte.classList.add("secoue");
            retour.className = "retour ko";
            retour.innerHTML = riche(pourquoi || "Ce n'est pas le bon endroit. Essayez encore !");
          }
        } }))),
        retour, vuRange());
    }
    const tete = () => el("div", {},
      el("div", { class: "jeu-titre" }, el("span", { html: titre || "Le tri" }), el("small", {}, `${items.length - pile.length} / ${items.length}`)),
      consigne ? el("p", { html: consigne, style: "margin:0 0 9px" }) : null);
    const vuRange = () => el("div", { class: "ranges" }, ...bacs.map((nom, k) =>
      ranges[k].length ? el("div", {}, el("strong", { html: nom }), el("ul", {}, ...ranges[k].map(t => el("li", { html: t })))) : el("div", {})));
    function fini() {
      gagne(cle + ".s");
      const detail = items.map(([texte, bon]) => ({ q: texte, donne: essais[texte] ? essais[texte][0] : bacs[bon], bonne: bacs[bon], ok: !essais[texte] }));
      const score = detail.filter(x => x.ok).length;
      noterResultat(cle, "Jeu de tri", titre || M.etapes[numEtape].titre, score, items.length, debut, detail);
      remplir(jeu, tete(), blocScore(score, items.length), listeCorrection(detail),
        el("p", { class: "question" }, erreurs === 0 ? "🌟 Tout est bien rangé, sans erreur ! ⭐" : `👏 Tout est rangé, avec ${erreurs} essai${erreurs > 1 ? "s" : ""} en plus. ⭐`),
        vuRange(), erreurs >= 2 && v ? aides([v]) : null,
        el("div", { class: "barre-btn" }, el("button", { class: "btn btn-petit", type: "button", onclick: depart }, "Recommencer")));
    }
    depart();
    return jeu;
  }

  /* ---------- Associer : cliquer un élément à gauche, puis son partenaire à droite ---------- */
  function associer(b, cle) {
    const jeu = el("div", { class: "jeu" });
    function depart() {
      let choisi = null, restants = b.associer.length, erreurs = 0;
      const essais = {};
      const debut = Date.now();
      const retour = el("div", { class: "retour", role: "status" });
      const clic = (bouton, i) => {
        retour.className = "retour";
        retour.textContent = "";
        if (!choisi || choisi.dataset.c === bouton.dataset.c) {
          if (choisi) choisi.classList.remove("choisi");
          choisi = bouton === choisi ? null : bouton;
          if (choisi) choisi.classList.add("choisi");
          return;
        }
        if (choisi.dataset.i === String(i)) {
          [choisi, bouton].forEach(x => { x.className = "paire ok"; x.disabled = true; });
          choisi = null;
          if (--restants === 0) {
            gagne(cle + ".s");
            const detail = b.associer.map((p, n) => ({ q: p[0], donne: essais[n] || p[1], bonne: p[1], ok: !essais[n] }));
            const score = detail.filter(x => x.ok).length;
            noterResultat(cle, "Jeu de paires", b.titre || M.etapes[numEtape].titre, score, b.associer.length, debut, detail);
            retour.className = "retour ok";
            retour.textContent = "🌟 Toutes les paires sont trouvées ! ⭐";
            jeu.append(blocScore(score, b.associer.length));
            const liste = listeCorrection(detail);
            if (liste) jeu.append(liste);
            jeu.append(el("div", { class: "barre-btn" }, el("button", { class: "btn btn-petit", type: "button", onclick: depart }, "Recommencer")));
          }
        } else {
          const a = choisi;
          a.classList.remove("choisi");
          [a, bouton].forEach(x => x.classList.add("ko"));
          setTimeout(() => [a, bouton].forEach(x => x.classList.remove("ko")), 650);
          choisi = null;
          erreurs++;
          const gauche = a.dataset.c === "g" ? a : bouton, droite = a.dataset.c === "g" ? bouton : a;
          if (!essais[gauche.dataset.i]) essais[gauche.dataset.i] = droite.innerHTML;
          retour.className = "retour ko";
          retour.textContent = "Ces deux-là ne vont pas ensemble. Essayez encore !";
        }
      };
      const col = (c, k) => el("div", {}, ...melange(b.associer.map((p, i) => ({ t: p[k], i }))).map(({ t, i }) => {
        const bt = el("button", { class: "paire", type: "button", "data-c": c, "data-i": i, html: t });
        bt.addEventListener("click", () => clic(bt, i));
        return bt;
      }));
      remplir(jeu, 
        el("div", { class: "jeu-titre" }, el("span", { html: b.titre || "Les paires" }), el("small", {}, `${b.associer.length} paires`)),
        el("p", { html: b.consigne || "Cliquez sur un élément à gauche, puis sur celui qui lui correspond à droite.", style: "margin:0 0 9px" }),
        el("div", { class: "assoc" }, col("g", 0), col("d", 1)), retour);
    }
    depart();
    return jeu;
  }

  /* ---------- Remettre dans l'ordre ---------- */
  function ordre(b, cle) {
    const jeu = el("div", { class: "jeu" });
    const bon = b.ordre;
    const debut = Date.now();
    let actuel, essais = 0, premier = null;
    const retour = el("div", { class: "retour", role: "status" });
    const liste = el("ol", { class: "ordre" });
    const bouge = (i, d) => {
      [actuel[i], actuel[i + d]] = [actuel[i + d], actuel[i]];
      dessine();
      const cible = liste.children[i + d] && liste.children[i + d].querySelector(d < 0 ? ".haut-f" : ".bas-f");
      if (cible && !cible.disabled) cible.focus();
    };
    function dessine(verif) {
      liste.replaceChildren(...actuel.map((t, i) => el("li", { class: verif ? (t === bon[i] ? "ok" : "ko") : "" },
        el("span", { html: t }),
        el("button", { class: "fleche haut-f", type: "button", disabled: i === 0, "aria-label": "Monter", onclick: () => bouge(i, -1) }, "↑"),
        el("button", { class: "fleche bas-f", type: "button", disabled: i === actuel.length - 1, "aria-label": "Descendre", onclick: () => bouge(i, 1) }, "↓"))));
    }
    actuel = melange(bon);
    while (egal(actuel, bon)) actuel = melange(bon);
    dessine();
    jeu.append(
      el("div", { class: "jeu-titre" }, el("span", { html: b.titre || "Dans le bon ordre" })),
      b.consigne ? el("p", { html: b.consigne, style: "margin:0 0 9px" }) : null,
      liste, retour,
      el("div", { class: "barre-btn" }, el("button", { class: "btn btn-petit", type: "button", onclick: () => {
        dessine(true);
        essais++;
        if (!premier) premier = actuel.slice();
        if (egal(actuel, bon)) {
          gagne(cle + ".s");
          const detail = bon.map((t, n) => ({ q: `Position ${n + 1}`, donne: premier[n], bonne: t, ok: premier[n] === t }));
          const score = detail.filter(x => x.ok).length;
          noterResultat(cle, "Remise en ordre", b.titre || M.etapes[numEtape].titre, score, bon.length, debut, detail);
          jeu.append(blocScore(score, bon.length));
          const liste = listeCorrection(detail, "📋 Votre premier essai");
          if (liste) jeu.append(liste);
          retour.className = "retour ok";
          retour.textContent = "🌟 C'est le bon ordre ! ⭐";
        } else {
          retour.className = "retour ko";
          retour.textContent = "Pas encore : déplacez les lignes en rouge.";
        }
      } }, "Vérifier")));
    return jeu;
  }

  /* ---------- Défi à réaliser sur l'ordinateur, avec cases à cocher gardées en mémoire ---------- */
  function defi({ titre, texte, taches, solution }, cle) {
    const fin = el("p", { class: "fin", role: "status" });
    const boite = el("div", { class: "defi" }, el("h3", { html: "🖥️ " + (titre || "À vous, sur votre ordinateur") }), texte ? el("p", { html: texte }) : null);
    const maj = () => {
      const tout = taches.every((t, i) => etat.taches[`${cle}.${i}`]);
      if (tout) {
        gagne(cle + ".s");
        noterResultat(cle, "Défi", titre || M.etapes[numEtape].titre, 1, 1, null);
        fin.textContent = "🌟 Défi réussi, bravo ! ⭐";
      } else fin.textContent = "";
    };
    taches.forEach((t, i) => {
      const k = `${cle}.${i}`;
      boite.append(el("label", { class: "tache" },
        el("input", { type: "checkbox", checked: !!etat.taches[k], onchange: e => {
          if (e.target.checked) etat.taches[k] = 1; else delete etat.taches[k];
          ecrire();
          maj();
        } }), el("span", { html: t })));
    });
    boite.append(fin);
    if (solution) boite.append(el("div", { style: "margin-top:9px;color:var(--encre)" }, bloc({ revele: { bouton: solution.bouton, contenu: solution.contenu } }, "x")));
    if (taches.every((t, i) => etat.taches[`${cle}.${i}`])) fin.textContent = "🌟 Défi réussi, bravo ! ⭐";
    return boite;
  }

  /* ---------- Exercice à faire dans Word, Excel ou PowerPoint ---------- */
  const LOGICIELS = {
    word: { nom: "Word", icone: "📄", schema: "ms-word" },
    excel: { nom: "Excel", icone: "📊", schema: "ms-excel" },
    powerpoint: { nom: "PowerPoint", icone: "🎞️", schema: "ms-powerpoint" },
    windows: { nom: "l'ordinateur", icone: "🖥️" },
    internet: { nom: "le navigateur", icone: "🌐" }
  };
  const lienFichier = chemin => "fichiers/" + chemin;
  function boutonOuvrir(chemin, logiciel, texte) {
    // Word, Excel et PowerPoint ne s'ouvrent directement que si le site est servi par une adresse http(s).
    const absolu = new URL(lienFichier(chemin), location.href).href;
    return logiciel.schema && location.protocol.startsWith("http")
      ? el("a", { class: "btn btn-petit btn-fort", href: `${logiciel.schema}:ofe|u|${absolu}` }, `${logiciel.icone} ${texte || "Ouvrir dans " + logiciel.nom}`)
      : null;
  }
  const boutonTelecharger = (chemin, texte) => el("a", { class: "btn btn-petit", href: lienFichier(chemin), download: chemin.split("/").pop() }, `⬇ ${texte}`);

  function fiche({ titre, fichier, gros }) {
    return el("div", { class: "fiche" }, el("span", { html: "📎 " + titre }),
      boutonTelecharger(fichier, "La fiche"),
      gros ? boutonTelecharger(gros, "En gros caractères") : null);
  }

  function exercice(id, cle) {
    const x = (typeof EXERCICES !== "undefined" && EXERCICES[id]) || null;
    if (!x) return el("p", {}, "Exercice introuvable : " + id);
    const logiciel = LOGICIELS[x.app] || LOGICIELS.word;
    const niveaux = ["", "Débutant", "Intermédiaire", "Avancé"];
    const coche = i => `${cle}.${i}`;
    const fini = () => x.taches.every((t, i) => etat.taches[coche(i)]);
    const demarrage = () => { if (!etat.debutExo[cle]) { etat.debutExo[cle] = Date.now(); ecrire(); } };

    const carte = el("div", { class: "exo" },
      el("div", { class: "exo-tete" },
        el("span", { class: "exo-logo", "aria-hidden": "true" }, logiciel.icone),
        el("div", {}, el("h3", { html: x.titre }), el("small", {}, [niveaux[x.niveau], x.duree].filter(Boolean).join(" · ")))));
    if (x.objectif) carte.append(el("p", { html: x.objectif }));

    const fichiers = el("div", { class: "barre-btn" });
    if (x.fichier) {
      const ouvrir = boutonOuvrir(x.fichier, logiciel);
      if (ouvrir) { ouvrir.addEventListener("click", demarrage); fichiers.append(ouvrir); }
      const tele = boutonTelecharger(x.fichier, ouvrir ? "Télécharger" : "Télécharger le fichier");
      tele.addEventListener("click", demarrage);
      fichiers.append(tele);
    }
    if (x.pack) {
      const p = boutonTelecharger(x.pack, "Télécharger le dossier de l'exercice (.zip)");
      p.addEventListener("click", demarrage);
      fichiers.append(p);
    }
    if (x.modele) fichiers.append(boutonTelecharger(x.modele, "Le modèle à reproduire en PDF"));
    if (x.consigne) fichiers.append(boutonTelecharger(x.consigne, "La consigne en PDF"));
    if (x.consigneGros) fichiers.append(boutonTelecharger(x.consigneGros, "En PDF, gros caractères"));
    if (fichiers.children.length) carte.append(fichiers);
    if (x.pack) carte.append(el("p", { class: "exo-note", html: "Le fichier .zip est une archive : clic droit dessus > <strong>Extraire tout</strong>, puis travaillez dans le dossier obtenu." }));
    else if (x.fichier) carte.append(el("p", { class: "exo-note", html: `Si ${logiciel.nom} affiche « Mode protégé », cliquez sur <strong>Activer la modification</strong>. Puis <strong>Enregistrer sous</strong> ({F12}) dans votre dossier de formation, sinon votre travail ne sera pas conservé.` }));

    const fin = el("div", { role: "status" });
    const liste = el("div", { class: "exo-taches" });
    const dessine = () => {
      liste.replaceChildren(...x.taches.map((t, i) => el("label", { class: "tache" },
        el("input", { type: "checkbox", checked: !!etat.taches[coche(i)], onchange: e => {
          demarrage();
          const avant = fini();
          if (e.target.checked) etat.taches[coche(i)] = 1; else delete etat.taches[coche(i)];
          ecrire();
          if (!avant && fini()) {
            gagne(cle + ".s");
          }
          bilan();
        } }), el("span", { html: t }))));
    };
    // Le stagiaire compare son travail au corrigé, puis indique ce qui est juste : le site ne peut pas lire son fichier.
    function autoEvaluation(actions) {
      const zone = el("div", { class: "auto-eval" });
      const memo = etat.memo[cle];
      if (memo && memo.fait) {
        const r = etat.resultats[cle];
        zone.append(actions, blocScore(r.dernier, r.total, "étapes justes"), el("p", { class: "exo-note" }, "Votre auto-évaluation, étape par étape."), listeCorrection(r.detail) || "");
        return zone;
      }
      const reponses = (memo && memo.reponses) || {};
      const valider = el("button", { class: "btn btn-petit btn-fort", type: "button", disabled: Object.keys(reponses).length < x.taches.length }, "Voir mon pourcentage");
      const lignes = x.taches.map((t, i) => {
        const b1 = el("button", { class: "outil", type: "button", "aria-pressed": String(reponses[i] === 1) }, "✓ C'est juste");
        const b2 = el("button", { class: "outil", type: "button", "aria-pressed": String(reponses[i] === 0) }, "✗ À revoir");
        const choisir = v => {
          reponses[i] = v;
          b1.setAttribute("aria-pressed", String(v === 1));
          b2.setAttribute("aria-pressed", String(v === 0));
          etat.memo[cle] = { reponses };
          ecrire();
          valider.disabled = Object.keys(reponses).length < x.taches.length;
        };
        b1.addEventListener("click", () => choisir(1));
        b2.addEventListener("click", () => choisir(0));
        return el("div", { class: "eval-ligne" }, el("span", { html: t }), el("div", { class: "eval-choix" }, b1, b2));
      });
      valider.addEventListener("click", () => {
        const detail = x.taches.map((t, i) => ({ q: t, ok: reponses[i] === 1, donne: reponses[i] === 1 ? "juste" : "à revoir" }));
        const score = detail.filter(d => d.ok).length;
        noterResultat(cle, "Exercice " + logiciel.nom, x.titre, score, x.taches.length, etat.debutExo[cle], detail);
        delete etat.debutExo[cle];
        etat.memo[cle] = { fait: 1 };
        ecrire();
        bilan();
      });
      zone.append(actions, el("h3", {}, "Et maintenant, comparez et notez-vous"), el("p", { class: "exo-note" }, x.corrige ? "Ouvrez le corrigé, comparez avec votre travail, puis indiquez pour chaque étape si c'est juste." : "Relisez votre travail, puis indiquez pour chaque étape si c'est juste."), ...lignes, el("div", { class: "barre-btn" }, valider));
      return zone;
    }
    const bilan = () => {
      fin.replaceChildren();
      if (!fini()) {
        if (x.corrige) fin.append(el("p", { class: "exo-note", html: "Cochez toutes les étapes pour débloquer le corrigé." }));
        return;
      }
      fin.append(el("p", { class: "retour ok" }, "🌟 Exercice terminé, bravo ! ⭐"));
      const actions = el("div", { class: "barre-btn" });
      if (x.corrige) actions.append(boutonTelecharger(x.corrige, "Comparer avec le corrigé en PDF"));
      fin.append(autoEvaluation(actions));
      actions.append(el("button", { class: "btn btn-petit", type: "button", onclick: () => {
        x.taches.forEach((t, i) => delete etat.taches[coche(i)]);
        delete etat.memo[cle];
        ecrire();
        dessine();
        bilan();
      } }, "↻ Refaire cet exercice"));
      const retourLecon = boutonRetour();
      if (retourLecon) actions.prepend(retourLecon);
      if (x.solution) fin.append(bloc({ revele: { bouton: x.solution.bouton, contenu: x.solution.contenu } }, "x"));
      if (x.suite) {
        const s = EXERCICES[x.suite];
        if (s) fin.append(el("p", { class: "exo-note", html: "Pour continuer de vous entraîner : <strong>" + s.titre + "</strong>." }));
      }
    };
    dessine();
    bilan();
    carte.append(liste, fin);
    return carte;
  }

  /* ---------- Démarrage ---------- */
  function demarrer(module) {
    M = module;
    etat = lire();
    etat.meta = {
      fichier: location.pathname.split("/").pop().replace(/\.html?$/i, ""),
      titre: M.titre.replace(/<[^>]+>/g, ""),
      etapes: M.etapes.length,
      etoiles: totalModule()
    };
    ecrire();
    window.addEventListener("pagehide", () => pointer(etapeChrono));
    document.addEventListener("visibilitychange", () => pointer(etapeChrono));
    racine = document.getElementById("livret");
    document.documentElement.style.setProperty("--teinte", M.couleur || "#0b7285");
    if (M.pale) document.documentElement.style.setProperty("--teinte-pale", M.pale);
    try { if (localStorage.getItem(CLE + "grand")) document.documentElement.classList.add("grand"); } catch {}
    // Les polices sont dans le site : le cours s'affiche d'abord, elles arrivent ensuite.
    const polices = el("link", { rel: "stylesheet", href: "livret/polices/polices.css", media: "print" });
    polices.addEventListener("load", () => { polices.media = "all"; });
    document.head.append(polices);
    accueil();
    // Retour depuis un quiz ou un exercice : on revient à l'écran exact qu'on avait quitté.
    try {
      const adresse = new URLSearchParams(location.search);
      let position = JSON.parse(sessionStorage.getItem(CLE + "position"));
      if (adresse.has("e")) {
        // Retour demandé par la barre du site : l'écran est donné dans l'adresse.
        position = { e: +adresse.get("e"), c: +adresse.get("c") };
        const pile = lirePile();
        if (pile.length && pile[pile.length - 1].de === etat.meta.fichier) { pile.pop(); ecrirePile(pile); }
      }
      if (position) {
        sessionStorage.removeItem(CLE + "position");
        if (M.etapes[position.e] && M.etapes[position.e].ecrans[position.c]) ouvrir(position.e, position.c);
      }
    } catch {}
    // Arrivée depuis le lien d'un cours : on ouvre directement la bonne étape.
    try {
      const voulue = sessionStorage.getItem(CLE + "aller");
      if (voulue) {
        sessionStorage.removeItem(CLE + "aller");
        const i = M.etapes.findIndex(e => e.titre === voulue);
        if (i >= 0) ouvrir(i, 0);
        else {
          // Un titre d'écran : celui de la notion à revoir.
          const e = M.etapes.findIndex(x => x.ecrans.some(c => c.t === voulue));
          if (e >= 0) ouvrir(e, M.etapes[e].ecrans.findIndex(c => c.t === voulue));
        }
      }
    } catch {}
  }

  return { demarrer };
})();
