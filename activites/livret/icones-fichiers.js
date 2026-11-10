/*
  LES ICÔNES DESSINÉES, pour les jeux sur les fichiers et Windows.
  Des dessins simples qui ressemblent aux vraies icônes, sans image à télécharger.
  ICONE("word") donne le dessin ; ICONES.word.nom donne son nom.
*/
const ICONES = (() => {
  const page = (dedans = "") => `<path d="M11 4h18l9 9v31H11z" fill="#fff" stroke="#8a9bb0" stroke-width="2"/><path d="M29 4v9h9" fill="#e2e8f0" stroke="#8a9bb0" stroke-width="2" stroke-linejoin="round"/>${dedans}`;
  const tuile = (couleur, lettre) => `<rect x="6" y="6" width="36" height="36" rx="7" fill="${couleur}"/><text x="24" y="32.5" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-weight="700" font-size="22" fill="#fff">${lettre}</text>`;
  const dossier = (dedans = "") => `<path d="M4 12a3 3 0 0 1 3-3h11l4 4h19a3 3 0 0 1 3 3v21a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="#e6ac17"/><path d="M4 18h40v19a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="#ffd45e"/>${dedans}`;
  const engrenage = c => `<g fill="${c}">${[0, 45, 90, 135].map(a => `<rect x="21" y="4" width="6" height="40" rx="2" transform="rotate(${a} 24 24)"/>`).join("")}<circle cx="24" cy="24" r="13"/></g><circle cx="24" cy="24" r="5.5" fill="#fff"/>`;
  return {
    dossier: { nom: "Un dossier", svg: dossier() },
    corbeille: { nom: "La Corbeille", svg: `<path d="M12 14h24l-2.5 28h-19z" fill="#d7e0ea" stroke="#5f7189" stroke-width="2" stroke-linejoin="round"/><rect x="8" y="9" width="32" height="5" rx="2" fill="#7f93ab"/><rect x="19" y="5" width="10" height="4" rx="1.5" fill="#7f93ab"/><path d="M20 19v18M28 19v18" stroke="#5f7189" stroke-width="2"/>` },
    pc: { nom: "Ce PC", svg: `<rect x="5" y="8" width="38" height="25" rx="2.5" fill="#2b6cb0"/><rect x="8" y="11" width="32" height="19" fill="#7cc4f2"/><rect x="20" y="33" width="8" height="5" fill="#4a5568"/><rect x="13" y="38" width="22" height="3.5" rx="1.5" fill="#4a5568"/>` },
    explorateur: { nom: "L'Explorateur de fichiers", svg: dossier(`<rect x="4" y="24" width="40" height="6" fill="#2b6cb0"/>`) },
    parametres: { nom: "Les Paramètres", svg: engrenage("#5f7189") },
    word: { nom: "Microsoft Word", svg: tuile("#185abd", "W") },
    excel: { nom: "Microsoft Excel", svg: tuile("#107c41", "X") },
    powerpoint: { nom: "Microsoft PowerPoint", svg: tuile("#c43e1c", "P") },
    pdf: { nom: "Un fichier PDF", svg: page(`<rect x="6" y="24" width="27" height="12" rx="2" fill="#d32f2f"/><text x="19.5" y="33.5" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-weight="700" font-size="9" fill="#fff">PDF</text>`) },
    texte: { nom: "Un fichier texte (Bloc-notes)", svg: page(`<path d="M16 20h16M16 25h16M16 30h16M16 35h11" stroke="#8a9bb0" stroke-width="2"/>`) },
    image: { nom: "Une image", svg: `<rect x="5" y="9" width="38" height="30" rx="3" fill="#e6f2ff" stroke="#3182ce" stroke-width="2"/><circle cx="16" cy="18" r="4" fill="#f6ad55"/><path d="M7 37l11-12 8 8 6-6 9 10z" fill="#38a169"/>` },
    musique: { nom: "Un fichier de musique", svg: `<circle cx="14" cy="36" r="6" fill="#805ad5"/><circle cx="35" cy="32" r="6" fill="#805ad5"/><path d="M19.5 36V11l21-4v25" stroke="#805ad5" stroke-width="3.5" fill="none" stroke-linejoin="round"/>` },
    video: { nom: "Une vidéo", svg: `<rect x="5" y="10" width="38" height="28" rx="3.5" fill="#2d3748"/><path d="M20 17v14l12-7z" fill="#fff"/>` },
    zip: { nom: "Un dossier compressé (zip)", svg: dossier(`<path d="M24 12v28" stroke="#4a5568" stroke-width="4" stroke-dasharray="3 2.5"/>`) },
    programme: { nom: "Un programme d'installation (.exe)", svg: `<rect x="5" y="8" width="38" height="32" rx="3" fill="#fff" stroke="#4a5568" stroke-width="2"/><rect x="5" y="8" width="38" height="7" rx="2" fill="#4a5568"/><g transform="translate(14 18) scale(.42)">${engrenage("#2b6cb0")}</g>` },
    navigateur: { nom: "Le navigateur Internet", svg: `<circle cx="24" cy="24" r="18" fill="#1a7fc1"/><ellipse cx="24" cy="24" rx="7.5" ry="18" fill="none" stroke="#fff" stroke-width="2"/><path d="M6 24h36M9 15h30M9 33h30" stroke="#fff" stroke-width="2"/>` },
    telechargements: { nom: "Le dossier Téléchargements", svg: dossier(`<path d="M24 19v14m-6.5-6.5L24 33l6.5-6.5" stroke="#2b6cb0" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`) },
    usb: { nom: "Une clé USB", svg: `<rect x="18" y="3" width="12" height="11" rx="1" fill="#a0aec0"/><rect x="20.5" y="6" width="2.5" height="3" fill="#4a5568"/><rect x="25" y="6" width="2.5" height="3" fill="#4a5568"/><rect x="14" y="14" width="20" height="31" rx="4" fill="#2b6cb0"/>` },
    mail: { nom: "La messagerie", svg: `<rect x="5" y="11" width="38" height="26" rx="3" fill="#3182ce"/><path d="M6 13l18 14 18-14" stroke="#fff" stroke-width="2.5" fill="none" stroke-linejoin="round"/>` }
  };
})();
// Le dessin d'une icône, prêt à placer dans une question, une carte ou un bouton.
const ICONE = (cle, taille = 56) => `<svg class="icone-dessin" width="${taille}" height="${taille}" viewBox="0 0 48 48" role="img" aria-label="${ICONES[cle].nom.replace(/"/g, "")}">${ICONES[cle].svg}</svg>`;
