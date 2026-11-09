/* L'affichage du bilan, commun à « Mon bilan » et au suivi du formateur. */
const BilanVue = (() => {
  function creer(balise, attributs = {}, texte) {
    const n = Object.assign(document.createElement(balise), attributs);
    if (texte !== undefined) n.textContent = texte;
    return n;
  }
  function chiffre(valeur, nom) {
    const d = creer("div", { className: "chiffre" });
    d.append(creer("strong", {}, valeur), creer("span", {}, nom));
    return d;
  }
  function chiffres(zone, c) {
    zone.replaceChildren(
      chiffre(`${c.ouvertes} / ${c.activites}`, "activités ouvertes"),
      chiffre(String(c.terminees), "modules terminés"),
      chiffre(String(c.valides || 0), "quiz finals validés"),
      chiffre(`⭐ ${c.etoiles}`, "étoiles"),
      chiffre(c.reussite === null ? "–" : c.reussite + " %", "de réussite"),
      chiffre(String(c.essais), "essais au total"),
      chiffre(Bilan.duree(c.temps), "de travail"));
  }
  const pourcent = r => r.total ? Math.round(r.meilleur / r.total * 100) : 0;

  function rubriques(zone, liste, lignes, cumuls) {
    zone.replaceChildren();
    liste.forEach(r => {
      const dedans = lignes.filter(l => l.rubrique === r.id);
      const c = cumuls ? cumuls.find(x => x.id === r.id) : Bilan.cumul(dedans);
      const section = creer("section", { className: "rubrique" });
      section.style.setProperty("--teinte", r.couleur || "#17324d");
      const tete = creer("div", { className: "rubrique-tete" });
      tete.append(creer("h2", {}, `${r.icone || ""} ${r.titre}`));
      const part = c.activites ? c.ouvertes / c.activites * 100 : 0;
      const jauge = creer("div", { className: "jauge" });
      jauge.setAttribute("role", "img");
      jauge.setAttribute("aria-label", `${c.ouvertes} activités ouvertes sur ${c.activites}`);
      const plein = creer("i");
      plein.style.width = part + "%";
      jauge.append(plein);
      tete.append(jauge, creer("p", {}, [
        `${c.ouvertes} / ${c.activites} ouvertes`,
        c.terminees ? `${c.terminees} terminé${c.terminees > 1 ? "s" : ""}` : "",
        c.etoiles ? `⭐ ${c.etoiles}` : "",
        c.reussite !== null ? `${c.reussite} % de réussite` : "",
        c.essais ? `${c.essais} essai${c.essais > 1 ? "s" : ""}` : "",
        Bilan.duree(c.temps)
      ].filter(Boolean).join(" · ")));
      section.append(tete);

      dedans.filter(l => l.ouverte || l.resultats.length).forEach(l => {
        const d = creer("details");
        const resume = creer("summary");
        const av = l.etapes ? `${l.etapesFaites} / ${l.etapes} étapes` : `${l.visites} ouverture${l.visites > 1 ? "s" : ""}`;
        resume.append(creer("strong", {}, l.titre), creer("span", {}, [
          av,
          l.etoilesMax ? `⭐ ${l.etoiles} / ${l.etoilesMax}` : "",
          Bilan.duree(l.temps)
        ].filter(Boolean).join(" · ")));
        d.append(resume);
        if (l.resultats.length) {
          const t = creer("table", { className: "tab" });
          t.append(creer("thead"), creer("tbody"));
          const entete = creer("tr");
          ["Exercice ou jeu", "Type", "Meilleur", "Dernier", "Essais", "Temps"].forEach(x => entete.append(creer("th", { scope: "col" }, x)));
          t.tHead.append(entete);
          l.resultats.forEach(x => {
            const ligne = creer("tr");
            ligne.append(
              creer("td", {}, x.titre),
              creer("td", {}, x.type),
              creer("td", {}, `${pourcent(x)} % (${x.meilleur} / ${x.total})`),
              creer("td", {}, `${Math.round(x.dernier / (x.dernierTotal || x.total) * 100)} % (${x.dernier} / ${x.dernierTotal || x.total})`),
              creer("td", {}, String(x.essais)),
              creer("td", {}, x.temps ? Bilan.duree(x.temps) : "–"));
            t.tBodies[0].append(ligne);
            if (x.detail && x.detail.length) {
              const fautes = x.detail.filter(y => !y.ok).length;
              const tr = creer("tr");
              const td = creer("td", { colSpan: 6 });
              const rep = creer("details", { className: "reponses" });
              rep.append(creer("summary", {}, fautes ? `📋 Voir les réponses : ${fautes} à revoir` : "📋 Voir les réponses : tout est juste"));
              const ul = creer("ul");
              x.detail.forEach(y => {
                const li = creer("li", { className: y.ok ? "ok" : "ko" });
                const q = creer("strong");
                q.innerHTML = (y.ok ? "✓ " : "✗ ") + BilanVue.nettoyer(y.q);
                li.append(q);
                if (y.donne) li.append(creer("span", {}, "Réponse donnée : " + BilanVue.brut(y.donne)));
                if (!y.ok && y.bonne) li.append(creer("span", { className: "bonne" }, "Bonne réponse : " + BilanVue.brut(y.bonne)));
                ul.append(li);
              });
              rep.append(ul);
              td.append(rep);
              tr.append(td);
              t.tBodies[0].append(tr);
            }
          });
          const defile = creer("div", { className: "defile" });
          defile.append(t);
          d.append(defile);
        } else {
          d.append(creer("p", { className: "vide" }, l.etapes ? "Pas encore d'exercice terminé." : "Le score de cette activité n'est pas encore enregistré : seuls le temps et le nombre d'ouvertures sont suivis."));
        }
        section.append(d);
      });
      if (!dedans.some(l => l.ouverte || l.resultats.length)) section.append(creer("p", { className: "vide" }, "Rien de commencé dans cette rubrique pour le moment."));
      zone.append(section);
    });
  }
  // Les textes du cours contiennent {Ctrl+S} et `=SOMME()` : on les remet en texte simple, sans balises.
  function brut(t) {
    const d = document.createElement("div");
    d.innerHTML = String(t);
    return d.textContent.replace(/[{}`]/g, "");
  }
  const nettoyer = t => brut(t).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  return { creer, chiffres, rubriques, brut, nettoyer };
})();
