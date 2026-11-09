/*
  LE CALCUL DU BILAN : lit ce que chaque module a enregistré dans ce navigateur.
  Utilisé par l'accueil, par « Mon bilan » et par le tableau de bord du formateur.
*/
const Bilan = (() => {
  const PREFIXE = "cours-bureautique:";
  const lireJson = (cle, defaut) => {
    try { return JSON.parse(localStorage.getItem(cle)) ?? defaut; } catch { return defaut; }
  };
  const idDe = a => a.fichier.replace(/\.html?$/i, "");

  function lignesActivites() {
    const ouvertes = new Set(lireJson(PREFIXE + "ouvertes", []));
    const visites = lireJson(PREFIXE + "visites", {});
    const modules = {};
    try {
      Object.keys(localStorage).filter(k => k.startsWith(PREFIXE + "livret:")).forEach(k => {
        const m = lireJson(k, null);
        if (m && m.meta) modules[m.meta.fichier] = m;
      });
    } catch {}
    return ACTIVITES.map(a => {
      const id = idDe(a);
      const m = modules[id];
      const v = visites[id] || { n: 0, ms: 0 };
      const resultats = m ? Object.values(m.resultats || {}) : [];
      const tempsModule = m ? Object.values(m.temps || {}).reduce((s, x) => s + x, 0) : 0;
      return {
        id,
        titre: a.titre,
        rubrique: a.rubrique,
        ouverte: ouvertes.has(id) || !!m,
        visites: v.n,
        temps: Math.max(tempsModule, v.ms),
        etapes: m ? m.meta.etapes : 0,
        etapesFaites: m ? Object.keys(m.faites || {}).length : 0,
        etoiles: m ? Object.keys(m.etoiles || {}).length : 0,
        etoilesMax: m ? m.meta.etoiles : 0,
        fois: m ? Object.values(m.faites || {}).reduce((s, x) => s + x, 0) : 0,
        resultats: resultats.map(r => ({ type: r.type, titre: r.titre, etape: r.etape, essais: r.essais, dernier: r.dernier, meilleur: r.meilleur, total: r.total, dernierTotal: r.dernierTotal, temps: r.temps, date: r.date, detail: r.detail }))
      };
    });
  }

  function cumul(lignes) {
    const resultats = lignes.flatMap(l => l.resultats);
    const score = resultats.reduce((s, r) => s + (r.total ? r.meilleur / r.total : 0), 0);
    return {
      activites: lignes.length,
      ouvertes: lignes.filter(l => l.ouverte).length,
      terminees: lignes.filter(l => l.etapes && l.etapesFaites === l.etapes).length,
      etoiles: lignes.reduce((s, l) => s + l.etoiles, 0),
      temps: lignes.reduce((s, l) => s + l.temps, 0),
      exercices: resultats.length,
      valides: resultats.filter(r => r.type === "Quiz final" && r.total && r.meilleur / r.total >= .8).length,
      essais: resultats.reduce((s, r) => s + r.essais, 0),
      reussite: resultats.length ? Math.round(score / resultats.length * 100) : null
    };
  }

  function duree(ms) {
    const min = Math.round((ms || 0) / 60000);
    if (!ms) return "0 min";
    if (min < 1) return "moins d'1 min";
    return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}`;
  }

  // Ce que le stagiaire peut enregistrer et remettre au formateur : un code, jamais de nom imposé.
  function exporter(code) {
    const lignes = lignesActivites();
    return {
      format: "bilan-cours-bureautique-1",
      code,
      date: new Date().toISOString(),
      global: cumul(lignes),
      rubriques: RUBRIQUES.map(r => ({ id: r.id, titre: r.titre, ...cumul(lignes.filter(l => l.rubrique === r.id)) })),
      activites: lignes.filter(l => l.ouverte || l.resultats.length)
    };
  }

  /* ---------- Un code par stagiaire ----------
     Le stagiaire actif a ses données sous les clés habituelles, que toutes les pages lisent.
     Quand il quitte, elles sont rangées sous son code ; le suivant retrouve les siennes. */
  const RANGEMENT = "cours-bureautique-stagiaire:";
  const DU_POSTE = ["code", "info-lue", "derniere-utilisation", "livret:grand"];   // réglages du poste, pas d'un stagiaire
  const clesDuStagiaire = () => Object.keys(localStorage).filter(k => k.startsWith(PREFIXE) && !DU_POSTE.includes(k.slice(PREFIXE.length)));
  const codeActif = () => { try { return localStorage.getItem(PREFIXE + "code") || ""; } catch { return ""; } };
  // Majuscules, tirets à la place des espaces : « ev man 001 » devient EV-MAN-001 ; null si la forme n'est pas la bonne.
  function verifierCode(saisie) {
    let code = (saisie || "").toUpperCase().trim().replace(/[\s_.]+/g, "-").replace(/-+/g, "-");
    const morceaux = code.match(/^EV-?([A-Z]+)-?(\d{3})$/);
    if (morceaux) code = `EV-${morceaux[1]}-${morceaux[2]}`;
    return CODE_STAGIAIRE.motif.test(code) ? code : null;
  }
  function ranger(code) {
    const donnees = {};
    clesDuStagiaire().forEach(k => { donnees[k] = localStorage.getItem(k); localStorage.removeItem(k); });
    if (code && Object.keys(donnees).length) localStorage.setItem(RANGEMENT + code, JSON.stringify({ date: Date.now(), donnees }));
    return donnees;
  }
  function quitter() {
    try {
      ranger(codeActif());
      localStorage.removeItem(PREFIXE + "code");
      sessionStorage.clear();
    } catch {}
  }
  function entrer(code) {
    try {
      const rangees = lireJson(RANGEMENT + code, null);
      if (codeActif()) ranger(codeActif());
      else if (rangees) ranger("SANS-CODE");   // une progression d'avant les codes : gardée à part, jamais mélangée
      // Sinon, la progression faite sans code devient celle du premier code saisi.
      if (rangees) Object.entries(rangees.donnees || {}).forEach(([k, v]) => localStorage.setItem(k, v));
      localStorage.removeItem(RANGEMENT + code);
      localStorage.setItem(PREFIXE + "code", code);
      sessionStorage.clear();
    } catch {}
  }
  // Pour le formateur, en fin de session : tous les stagiaires de ce poste.
  function stagiairesDuPoste() {
    try { return [codeActif(), ...Object.keys(localStorage).filter(k => k.startsWith(RANGEMENT)).map(k => k.slice(RANGEMENT.length))].filter(Boolean); } catch { return []; }
  }
  function effacerLePoste() {
    try { Object.keys(localStorage).filter(k => k.startsWith(RANGEMENT)).forEach(k => localStorage.removeItem(k)); } catch {}
    toutEffacer();
  }

  // Les données du stagiaire actif, sauf le simple réglage de la taille du texte.
  function toutEffacer() {
    try {
      Object.keys(localStorage).filter(k => k.startsWith(PREFIXE) && !k.endsWith(":grand")).forEach(k => localStorage.removeItem(k));
      sessionStorage.clear();
    } catch {}
  }
  // Conservation limitée : sans utilisation depuis trop longtemps, on efface.
  function verifierConservation(mois = CONSERVATION_MOIS, maintenant = Date.now()) {
    try {
      const derniere = +localStorage.getItem(PREFIXE + "derniere-utilisation");
      const limite = mois * 30.44 * 24 * 3600 * 1000;
      if (derniere && maintenant - derniere > limite) toutEffacer();
      // Les progressions rangées des autres stagiaires suivent la même règle.
      Object.keys(localStorage).filter(k => k.startsWith(RANGEMENT)).forEach(k => {
        const r = lireJson(k, null);
        if (!r || maintenant - r.date > limite) localStorage.removeItem(k);
      });
      localStorage.setItem(PREFIXE + "derniere-utilisation", String(maintenant));
    } catch {}
  }
  verifierConservation();

  return { lignesActivites, cumul, duree, exporter, PREFIXE, lireJson, toutEffacer, verifierConservation,
    codeActif, verifierCode, entrer, quitter, stagiairesDuPoste, effacerLePoste };
})();
