/*
  POUR LES ACTIVITÉS AUTONOMES (pendu, mots croisés, dictées…) :
  affiche le pourcentage et la correction, et enregistre le résultat pour « Mon bilan ».
*/
const ResultatActivite = (() => {
  const CLE = "cours-bureautique:livret:";
  const id = location.pathname.split("/").pop().replace(/\.html?$/i, "");
  const debut = Date.now();
  const pourcent = (s, t) => t ? Math.round(s / t * 100) : 0;

  function noter({ titre, type, score, total, detail, cle = "partie" }) {
    try {
      const etat = JSON.parse(localStorage.getItem(CLE + id)) || { etoiles: {}, faites: {}, temps: {}, resultats: {} };
      etat.meta = { fichier: id, titre, etapes: 0, etoiles: 0 };
      const r = etat.resultats[cle] || { type, titre, etape: titre, essais: 0, meilleur: 0, total, temps: 0 };
      const duree = Math.min(Date.now() - debut, 4 * 3600 * 1000);
      r.essais++;
      r.dernier = score;
      // Selon la partie, le total peut changer : on garde le meilleur pourcentage.
      if (pourcent(score, total) >= pourcent(r.meilleur, r.total)) { r.meilleur = score; r.total = total; }
      r.dernierTotal = total;
      r.temps += duree;
      r.dernierTemps = duree;
      r.date = new Date().toISOString();
      r.detail = detail || [];
      etat.resultats[cle] = r;
      localStorage.setItem(CLE + id, JSON.stringify(etat));
    } catch {}
  }

  function style() {
    if (document.getElementById("style-resultat")) return;
    const s = document.createElement("style");
    s.id = "style-resultat";
    s.textContent = `
      .ra { margin: 14px 0; padding: 12px 14px; border-radius: 14px; background: #fff; border: 2px solid #c8d1d6; color: #1b2a33; text-align: left; font-size: 1rem; line-height: 1.45; }
      .ra-pct { display: block; font-size: 2.2rem; font-weight: 800; line-height: 1.1; color: #17324d; }
      .ra-jauge { height: 11px; margin: 7px 0 9px; border-radius: 99px; background: #e6e6e1; overflow: hidden; }
      .ra-jauge i { display: block; height: 100%; border-radius: inherit; }
      .ra summary { cursor: pointer; font-weight: 800; padding: 3px 0; }
      .ra ul { list-style: none; margin: 7px 0 0; padding: 0; display: grid; gap: 6px; }
      .ra li { padding: 7px 10px; border-radius: 9px; border-left: 5px solid; }
      .ra li.ok { background: #e2f6ea; border-color: #1a7f4b; }
      .ra li.ko { background: #fdeceb; border-color: #b42318; }
      .ra li b { display: block; }
      .ra-export { margin-top: 10px; padding: 7px 14px; border: 2px solid #17324d; border-radius: 10px; background: #fff; color: #17324d; font: 700 .95rem "Segoe UI", system-ui, sans-serif; cursor: pointer; }
      .ra-export:hover { background: #e7f0fb; }
    `;
    document.head.append(s);
  }

  function afficher(zone, { score, total, detail, unite, titre, type }) {
    style();
    const p = pourcent(score, total);
    const bloc = document.createElement("div");
    bloc.className = "ra";
    bloc.setAttribute("role", "status");
    const pct = document.createElement("strong");
    pct.className = "ra-pct";
    pct.textContent = p + " % de réussite";
    const ligne = document.createElement("div");
    ligne.textContent = `${score} / ${total} ${unite || "bonnes réponses"}`;
    const jauge = document.createElement("div");
    jauge.className = "ra-jauge";
    const plein = document.createElement("i");
    plein.style.width = p + "%";
    plein.style.background = p >= 80 ? "#1a7f4b" : p >= 50 ? "#c98a00" : "#b42318";
    jauge.append(plein);
    bloc.append(pct, jauge, ligne);
    if (detail && detail.length) {
      const d = document.createElement("details");
      const fautes = detail.filter(x => !x.ok).length;
      d.open = fautes > 0;
      const s = document.createElement("summary");
      s.textContent = fautes ? `📋 Voir mes réponses (${fautes} à revoir)` : "📋 Voir mes réponses";
      const ul = document.createElement("ul");
      detail.forEach(x => {
        const li = document.createElement("li");
        li.className = x.ok ? "ok" : "ko";
        const q = document.createElement("b");
        q.textContent = (x.ok ? "✓ " : "✗ ") + x.q;
        li.append(q);
        if (x.donne) li.append(document.createTextNode("Votre réponse : " + x.donne + ". "));
        if (!x.ok && x.bonne) li.append(document.createTextNode("Bonne réponse : " + x.bonne + "."));
        ul.append(li);
      });
      d.append(s, ul);
      bloc.append(d);
    }
    // Le fichier de résultat à ranger dans son dossier sur le réseau
    if (titre && typeof ExportResultat !== "undefined") {
      const b = ExportResultat.bouton(() => ({ titre, module: document.title, type, score, total, detail, unite, temps: Date.now() - debut }), "ra-export");
      bloc.append(b);
    }
    zone.replaceChildren(bloc);
  }

  // Un seul appel pour noter et afficher ; `zone` est créée au besoin juste après `apres`.
  function terminer({ apres, zone, ...r }) {
    noter(r);
    if (!zone) {
      zone = document.getElementById("ra-zone");
      if (!zone) {
        zone = document.createElement("div");
        zone.id = "ra-zone";
        apres.after(zone);
      }
    }
    afficher(zone, r);
  }
  // Pour les activités qui affichent elles-mêmes leur score : on note, puis le bouton d'export juste après `cible`.
  function noterEtExporter(cible, r) {
    noter(r);
    if (typeof cible === "string") cible = document.getElementById(cible);
    if (!cible || typeof ExportResultat === "undefined") return;
    style();
    const ancien = cible.parentNode.querySelector(".ra-export");
    if (ancien) ancien.remove();
    cible.after(ExportResultat.bouton(() => ({ module: document.title, temps: Date.now() - debut, ...r }), "ra-export"));
  }
  return { noter, afficher, terminer, noterEtExporter, pourcent };
})();
