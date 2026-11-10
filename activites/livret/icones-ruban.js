/*
  LES ICÔNES DU RUBAN, dessinées simplement pour ressembler à celles de Word, Excel et PowerPoint.
  Utilisées par les cartes des cours : { cartes: [["Barré", "Ce que ça fait", { i: "barre", ou: ["Accueil", "Police"] }]] }.
*/
const ICONES_RUBAN = (() => {
  const N = "#323130", B = "#2b579a";
  const T = (x, y, s, t, plus = "") => `<text x="${x}" y="${y}" font-family="Segoe UI,Arial,sans-serif" font-size="${s}" font-weight="600" fill="${N}" text-anchor="middle" ${plus}>${t}</text>`;
  const L = (x, y, l, c = N) => `<rect x="${x}" y="${y}" width="${l}" height="2.2" rx="1" fill="${c}"/>`;
  const lignes = (pos) => pos.map(([x, l], k) => L(x, 6 + k * 5, l)).join("");
  const crayon = `<path d="M20 29l8-8 3 3-8 8h-3z" fill="#f2b200" stroke="${N}" stroke-width="1"/>`;
  const image = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="#9cc3e6" stroke="${B}" stroke-width="1.2"/><path d="M${x + 1} ${y + h - 1}l${w * .35} ${-h * .5}l${w * .25} ${h * .3}l${w * .15} ${-h * .15}l${w * .2} ${h * .35}z" fill="#548235"/>`;
  const grille = (fond = []) => { let s = ""; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) s += `<rect x="${4 + c * 8.5}" y="${4 + r * 6.2}" width="8" height="5.7" fill="${fond[r * 3 + c] || "#fff"}" stroke="#a6a6a6" stroke-width=".6"/>`; return s; };
  return {
    enregistrer: `<path d="M4 4h19l5 5v19H4z" fill="${B}"/><rect x="8" y="4" width="13" height="8" fill="#fff"/><rect x="17" y="5.5" width="2.5" height="5" fill="${B}"/><rect x="8" y="17" width="16" height="11" fill="#fff"/>`,
    "enregistrer-sous": `<path d="M2 3h17l4 4v17H2z" fill="${B}"/><rect x="5.5" y="3" width="11" height="7" fill="#fff"/><rect x="5.5" y="14" width="13" height="10" fill="#fff"/>${crayon}`,
    auto: `<rect x="1" y="10" width="30" height="13" rx="6.5" fill="${B}"/><circle cx="24.5" cy="16.5" r="4.5" fill="#fff"/>${T(10, 20, 8, "Oui", 'fill="#fff"')}`,
    barre: `${T(16, 22, 16, "ab")}<rect x="4" y="15.5" width="24" height="2.2" fill="#c00000"/>`,
    indice: `${T(12, 22, 18, "x")}${T(23, 28, 11, "2", `fill="${B}"`)}`,
    exposant: `${T(12, 26, 18, "x")}${T(23, 14, 11, "2", `fill="${B}"`)}`,
    surlignage: `${T(16, 19, 14, "ab")}<rect x="3" y="23" width="26" height="6" fill="#ffff00" stroke="#bfbf00" stroke-width=".6"/>`,
    effets: `${T(17, 26, 24, "A", `fill="#bdd7ee" transform="translate(1.5 1.5)"`)}${T(16, 25, 24, "A", `fill="#fff" stroke="${B}" stroke-width="1.6"`)}`,
    "petites-maj": `${T(11, 25, 20, "A")}${T(23, 25, 12, "A", `fill="${B}"`)}`,
    espacement: `${T(16, 19, 15, "A&#8202;V")}<path d="M5 25h22M5 25l3-2.5M5 25l3 2.5M27 25l-3-2.5M27 25l-3 2.5" stroke="${B}" stroke-width="1.6" fill="none"/>`,
    effacer: `${T(12, 23, 20, "A")}<rect x="17" y="17" width="12" height="7" rx="1.5" transform="rotate(-35 23 20.5)" fill="#f4b6c2" stroke="${N}" stroke-width="1"/>`,
    "align-g": lignes([[4, 24], [4, 16], [4, 22], [4, 13], [4, 20]]),
    "align-c": lignes([[4, 24], [8, 16], [5, 22], [9.5, 13], [6, 20]]),
    "align-d": lignes([[4, 24], [12, 16], [6, 22], [15, 13], [8, 20]]),
    justifie: lignes([[4, 24], [4, 24], [4, 24], [4, 24], [4, 14]]),
    "retrait-1": lignes([[11, 17], [4, 24], [4, 24], [4, 24], [4, 18]]),
    "retrait-neg": lignes([[4, 24], [11, 17], [11, 17], [11, 17], [11, 13]]),
    retrait: `${lignes([[12, 16], [12, 16], [12, 16], [12, 16], [12, 12]])}<path d="M3 13l5 4-5 4z" fill="${B}"/>`,
    puces: [0, 1, 2].map(k => `<circle cx="7" cy="${8 + k * 8}" r="2.4" fill="${N}"/>${L(12, 7 + k * 8, 16)}`).join(""),
    numeros: [1, 2, 3].map((n, k) => `${T(7, 10.5 + k * 8, 8, n + ".")}${L(12, 7 + k * 8, 16)}`).join(""),
    niveaux: `${T(5.5, 10.5, 8, "1")}${L(10, 7, 18)}${T(11.5, 18.5, 8, "a", `fill="${B}"`)}${L(16, 15, 12)}${T(17, 26.5, 8, "i")}${L(21, 23, 7)}`,
    "hab-ligne": `${L(3, 26, 5)}${image(9, 13, 11, 13)}${L(21, 26, 8)}${L(3, 6, 26)}`,
    "hab-carre": `${image(3, 6, 12, 14)}${L(17, 6, 12)}${L(17, 11, 12)}${L(17, 16, 12)}${L(3, 23, 26)}${L(3, 28, 20)}`,
    "hab-rapproche": `<circle cx="10" cy="14" r="7" fill="#9cc3e6" stroke="${B}" stroke-width="1.2"/>${L(19, 7, 10)}${L(18, 12, 11)}${L(18, 17, 11)}${L(14, 22, 15)}${L(3, 27, 26)}`,
    "hab-devant": `${lignes([[3, 26], [3, 26], [3, 26], [3, 26], [3, 26]])}${image(10, 9, 13, 13)}`,
    "mode-page": `<rect x="7" y="3" width="18" height="26" fill="#fff" stroke="${N}" stroke-width="1.4"/>${L(10, 8, 12)}${L(10, 12, 12)}${L(10, 16, 12)}${L(10, 20, 8)}`,
    "mode-lecture": `<path d="M16 8c-4-3-9-3-13-2v20c4-1 9-1 13 2 4-3 9-3 13-2V6c-4-1-9-1-13 2z" fill="#fff" stroke="${N}" stroke-width="1.4"/><path d="M16 8v20" stroke="${N}" stroke-width="1.2"/>`,
    "mode-plan": `<circle cx="5" cy="7" r="2" fill="${B}"/>${L(9, 6, 19)}<circle cx="10" cy="14" r="2" fill="${N}"/>${L(14, 13, 14)}<circle cx="10" cy="21" r="2" fill="${N}"/>${L(14, 20, 14)}<circle cx="5" cy="28" r="2" fill="${B}"/>${L(9, 27, 19)}`,
    "mode-brouillon": lignes([[3, 26], [3, 22], [3, 26], [3, 18], [3, 24]]),
    styles: `<rect x="2" y="7" width="28" height="18" rx="2" fill="#fff" stroke="${N}" stroke-width="1.2"/>${T(16, 21, 11, "AaBb")}`,
    "styles-modifier": `<rect x="1" y="4" width="25" height="16" rx="2" fill="#fff" stroke="${N}" stroke-width="1.2"/>${T(13.5, 16, 9.5, "AaBb")}${crayon}`,
    "styles-volet": `<rect x="3" y="3" width="26" height="26" rx="1.5" fill="#fff" stroke="${N}" stroke-width="1.2"/><rect x="17" y="3" width="12" height="26" fill="#deebf7"/>${T(23, 12, 8, "A")}${L(19, 16, 8, B)}${L(19, 21, 8, B)}${L(6, 9, 9)}${L(6, 14, 9)}${L(6, 19, 9)}`,
    "mfc-surbrillance": grille(["", "#ffc7ce", "", "", "", "#ffc7ce", "#ffc7ce", "", "", "", "", "#ffc7ce"]),
    "mfc-top": `${grille()}<rect x="4" y="4" width="25" height="5.7" fill="#c6efce" stroke="#a6a6a6" stroke-width=".6"/>${T(16.5, 9, 6, "TOP 10", `fill="#006100"`)}`,
    "mfc-barres": [0, 1, 2, 3].map(k => `<rect x="4" y="${4 + k * 6.2}" width="25" height="5.7" fill="#fff" stroke="#a6a6a6" stroke-width=".6"/><rect x="4.5" y="${4.7 + k * 6.2}" width="${[20, 9, 15, 5][k]}" height="4.3" fill="#5b9bd5"/>`).join(""),
    "mfc-nuances": grille(["#63be7b", "#ffeb84", "#f8696b", "#a9d27f", "#ffeb84", "#fbaa77", "#ffeb84", "#63be7b", "#f8696b", "#fbaa77", "#a9d27f", "#63be7b"]),
    "mfc-icones": `<path d="M8 4l5 6H3z" fill="#00b050"/>${L(16, 6, 13)}<path d="M3 12h8v-2.5l4 5-4 5V17H3z" fill="#ffc000"/>${L(16, 14, 13)}<path d="M8 30l5-6H3z" fill="#c00000"/>${L(16, 25, 13)}`,
    video: `<rect x="2" y="7" width="20" height="18" rx="2" fill="${N}"/><path d="M22 13l8-5v16l-8-5z" fill="${N}"/><path d="M9 11v10l7-5z" fill="#fff"/>`,
    audio: `<path d="M3 12h6l7-6v20l-7-6H3z" fill="${N}"/><path d="M20 11c2 3 2 7 0 10M24 7c4 5 4 13 0 18" stroke="${B}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    graphique: `<rect x="5" y="16" width="5" height="12" fill="#5b9bd5"/><rect x="13" y="8" width="5" height="20" fill="#ed7d31"/><rect x="21" y="12" width="5" height="16" fill="#a5a5a5"/>${L(3, 28, 26)}`,
    tableau: `<rect x="3" y="5" width="26" height="22" fill="#fff" stroke="${N}" stroke-width="1.3"/><rect x="3" y="5" width="26" height="5.5" fill="${B}"/><path d="M3 16h26M3 21.5h26M11.7 5v22M20.3 5v22" stroke="${N}" stroke-width="1"/>`
  };
})();
const ICONE_RUBAN = cle => ICONES_RUBAN[cle] ? `<svg class="ico-ruban" viewBox="0 0 32 32" width="40" height="40" aria-hidden="true">${ICONES_RUBAN[cle]}</svg>` : "";
