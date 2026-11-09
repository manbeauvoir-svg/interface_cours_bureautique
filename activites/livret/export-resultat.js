/*
  EXPORTER UN RÉSULTAT : un fichier lisible (page web, imprimable) avec le code stagiaire,
  le pourcentage, les leçons à revoir et chaque réponse. Il arrive dans Téléchargements ;
  le stagiaire le range ensuite dans son dossier sur le réseau.
*/
const ExportResultat = (() => {
  const pourcent = (s, t) => t ? Math.round(s / t * 100) : 0;
  // Le texte seul, sans balises : les touches {Ctrl+C} deviennent « Ctrl + C ».
  function texte(t) {
    const html = String(t ?? "").replace(/\{([^{}]+)\}/g, (m, s) => s.split("+").map(x => x.trim()).join(" + "));
    return (new DOMParser().parseFromString(html, "text/html").body.textContent || "").replace(/\s+/g, " ").trim();
  }
  const esc = t => texte(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const nomFichier = t => texte(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "activite";
  function code() {
    try { return localStorage.getItem("cours-bureautique:code") || ""; } catch { return ""; }
  }
  function duree(ms) {
    const min = Math.round((ms || 0) / 60000);
    if (!ms) return "";
    return min < 1 ? "moins d'1 min" : min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}`;
  }

  function page(r) {
    const p = pourcent(r.score, r.total);
    const date = new Date();
    const fautes = (r.detail || []).filter(x => !x.ok);
    const couleur = p >= 80 ? "#1a7f4b" : p >= 50 ? "#a86b00" : "#b42318";
    const lignes = (r.detail || []).map((x, i) => `
      <tr class="${x.ok ? "ok" : "ko"}">
        <td>${x.ok ? "✓" : "✗"}</td>
        <td>${i + 1}. ${esc(x.q)}</td>
        <td>${esc(x.donne)}</td>
        <td>${x.ok ? "" : esc(x.bonne)}${!x.ok && x.e ? `<small>${esc(x.e)}</small>` : ""}</td>
      </tr>`).join("");
    const revoir = (r.revoir || []).length
      ? `<h2>📖 Les leçons à revoir</h2><ul>${r.revoir.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`
      : fautes.length ? "" : `<h2>📖 Les leçons à revoir</h2><p>Aucune : tout est juste. 🌟</p>`;
    return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Résultat ${esc(code() || "")} : ${esc(r.titre)}</title>
<style>
  body { margin: 0; padding: 24px; font: 15px/1.5 "Segoe UI", system-ui, sans-serif; color: #1b2a33; background: #fff; }
  .page { max-width: 900px; margin: 0 auto; }
  h1 { margin: 0 0 4px; font-size: 1.5rem; color: #17324d; }
  h2 { margin: 22px 0 8px; font-size: 1.15rem; color: #17324d; }
  .infos { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 6px 18px; margin: 12px 0; padding: 12px 14px; border: 1px solid #c8d1d6; border-radius: 10px; background: #f6f8f9; }
  .infos b { display: block; font-size: .8rem; color: #4b5c66; text-transform: uppercase; letter-spacing: .03em; }
  .score { font-size: 2.2rem; font-weight: 800; color: ${couleur}; }
  .jauge { height: 12px; border-radius: 99px; background: #e6e6e1; overflow: hidden; margin: 4px 0 2px; }
  .jauge i { display: block; height: 100%; width: ${p}%; background: ${couleur}; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 7px 9px; border-bottom: 1px solid #e1e5e8; text-align: left; vertical-align: top; }
  th { background: #17324d; color: #fff; font-size: .9rem; }
  tr.ok td:first-child { color: #1a7f4b; font-weight: 800; }
  tr.ko td:first-child { color: #b42318; font-weight: 800; }
  tr.ko { background: #fdf1f0; }
  small { display: block; color: #4b5c66; margin-top: 3px; }
  .pied { margin-top: 24px; font-size: .85rem; color: #4b5c66; }
  @media print { body { padding: 0; } tr { break-inside: avoid; } }
</style></head>
<body><div class="page">
  <h1>📄 ${esc(r.titre)}</h1>
  <div>${esc(r.module || "")}${r.type ? " · " + esc(r.type) : ""}</div>
  <div class="infos">
    <div><b>Code stagiaire</b>${esc(code() || "non saisi")}</div>
    <div><b>Date</b>${date.toLocaleDateString("fr-FR")} à ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
    ${r.essais ? `<div><b>Essai</b>n° ${r.essais}${r.meilleur != null ? ` · meilleur : ${pourcent(r.meilleur, r.total)} %` : ""}</div>` : ""}
    ${duree(r.temps) ? `<div><b>Temps</b>${duree(r.temps)}</div>` : ""}
  </div>
  <div class="score">${p} % de réussite</div>
  <div class="jauge"><i></i></div>
  <div>${r.score} / ${r.total} ${esc(r.unite || "bonnes réponses")}${fautes.length ? ` · ${fautes.length} à revoir` : ""}</div>
  ${revoir}
  ${lignes ? `<h2>📋 Les réponses</h2>
  <table><thead><tr><th></th><th>Question</th><th>Votre réponse</th><th>Bonne réponse</th></tr></thead><tbody>${lignes}</tbody></table>` : ""}
  <p class="pied">Cours de bureautique · fichier créé sur le poste du stagiaire. À ranger dans votre dossier sur le réseau.</p>
</div></body></html>`;
  }

  function telecharger(r) {
    const nom = `resultat_${code() || "SANS-CODE"}_${nomFichier(r.titre)}_${new Date().toISOString().slice(0, 10)}.html`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([page(r)], { type: "text/html;charset=utf-8" }));
    a.download = nom;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    return nom;
  }

  // Le bouton : `donnees` est appelé au clic, pour exporter le résultat tel qu'il est à ce moment-là.
  function bouton(donnees, classe) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = classe || "btn btn-petit";
    b.textContent = "📤 Exporter mon résultat";
    b.title = "Enregistre un fichier dans Téléchargements, à ranger ensuite dans votre dossier sur le réseau";
    b.addEventListener("click", () => {
      const r = donnees();
      if (!r) return;
      const nom = telecharger(r);
      b.textContent = "✓ Fichier dans Téléchargements";
      b.title = nom;
      setTimeout(() => { b.textContent = "📤 Exporter mon résultat"; }, 5000);
    });
    return b;
  }
  return { bouton, telecharger, page };
})();
