/*
  FICHIERS EXCEL (.xlsx), sans bibliothèque ni Internet.
  Xlsx.creer(feuilles) fabrique le classeur ; Xlsx.lire(octets) relit les feuilles d'un classeur,
  même enregistré à nouveau par Excel.
  Une feuille : { nom, lignes: [[cellule, …], …], largeurs: [nombres], entete: true, cachee: true }.
  Une cellule : un texte, un nombre, ou { v: valeur, s: "tete" | "titre" | "pct" | "gras" }.
*/
const Xlsx = (() => {
  const enc = new TextEncoder();
  const xml = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "");
  const colonne = n => { let s = ""; n++; while (n) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); } return s; };
  const STYLES = { tete: 1, titre: 2, pct: 3, gras: 4 };

  function feuilleXml(f) {
    const lignes = f.lignes.map((ligne, i) => {
      const cellules = ligne.map((c, j) => {
        if (c === null || c === undefined || c === "") return "";
        const o = typeof c === "object" ? c : { v: c };
        const s = o.s ? ` s="${STYLES[o.s]}"` : (f.entete && i === 0 ? ` s="1"` : "");
        const ref = colonne(j) + (i + 1);
        if (typeof o.v === "number" && isFinite(o.v)) return `<c r="${ref}"${s}><v>${o.v}</v></c>`;
        return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${xml(o.v)}</t></is></c>`;
      }).join("");
      return `<row r="${i + 1}">${cellules}</row>`;
    }).join("");
    const vue = f.entete ? `<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>` : "";
    const cols = f.largeurs ? `<cols>${f.largeurs.map((l, i) => `<col min="${i + 1}" max="${i + 1}" width="${l}" customWidth="1"/>`).join("")}</cols>` : "";
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${vue}${cols}<sheetData>${lignes}</sheetData></worksheet>`;
  }

  const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="4"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><sz val="14"/><color rgb="FF17324D"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF17324D"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="5"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/><xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="9" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

  /* ---------- Le fichier zip (sans compression) ---------- */
  const TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = o => { let c = 0xffffffff; for (let i = 0; i < o.length; i++) c = TABLE[(c ^ o[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  function zip(fichiers) {
    const parts = [], central = [];
    let pos = 0;
    const d = new Date(), heure = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), jour = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    fichiers.forEach(({ nom, donnees }) => {
      const n = enc.encode(nom), o = enc.encode(donnees), crc = crc32(o);
      const tete = new DataView(new ArrayBuffer(30));
      tete.setUint32(0, 0x04034b50, true); tete.setUint16(4, 20, true); tete.setUint16(6, 0x0800, true); tete.setUint16(8, 0, true);
      tete.setUint16(10, heure, true); tete.setUint16(12, jour, true); tete.setUint32(14, crc, true);
      tete.setUint32(18, o.length, true); tete.setUint32(22, o.length, true); tete.setUint16(26, n.length, true); tete.setUint16(28, 0, true);
      const c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
      c.setUint16(12, heure, true); c.setUint16(14, jour, true); c.setUint32(16, crc, true); c.setUint32(20, o.length, true); c.setUint32(24, o.length, true);
      c.setUint16(28, n.length, true); c.setUint32(42, pos, true);
      parts.push(tete, n, o);
      central.push(c, n);
      pos += 30 + n.length + o.length;
    });
    const taille = central.reduce((s, x) => s + x.byteLength, 0);
    const fin = new DataView(new ArrayBuffer(22));
    fin.setUint32(0, 0x06054b50, true); fin.setUint16(8, fichiers.length, true); fin.setUint16(10, fichiers.length, true);
    fin.setUint32(12, taille, true); fin.setUint32(16, pos, true);
    return new Blob([...parts, ...central, fin], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }

  function creer(feuilles) {
    const ns = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
    const nomFeuille = n => xml(String(n).replace(/[\\/?*[\]:]/g, " ").slice(0, 31));
    return zip([
      { nom: "[Content_Types].xml", donnees: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${feuilles.map((f, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}</Types>` },
      { nom: "_rels/.rels", donnees: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
      { nom: "xl/workbook.xml", donnees: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook ${ns}><bookViews><workbookView activeTab="0"/></bookViews><sheets>${feuilles.map((f, i) => `<sheet name="${nomFeuille(f.nom)}" sheetId="${i + 1}"${f.cachee ? ' state="hidden"' : ""} r:id="rId${i + 1}"/>`).join("")}</sheets></workbook>` },
      { nom: "xl/_rels/workbook.xml.rels", donnees: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${feuilles.map((f, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("")}<Relationship Id="rId${feuilles.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>` },
      { nom: "xl/styles.xml", donnees: STYLES_XML },
      ...feuilles.map((f, i) => ({ nom: `xl/worksheets/sheet${i + 1}.xml`, donnees: feuilleXml(f) }))
    ]);
  }

  /* ---------- Relire un classeur ---------- */
  async function dezipper(octets) {
    const v = new DataView(octets);
    let fin = -1;
    for (let i = octets.byteLength - 22; i >= Math.max(0, octets.byteLength - 66000); i--) if (v.getUint32(i, true) === 0x06054b50) { fin = i; break; }
    if (fin < 0) throw new Error("Ce n'est pas un fichier Excel.");
    const nb = v.getUint16(fin + 10, true);
    let p = v.getUint32(fin + 16, true);
    const fichiers = {};
    const dec = new TextDecoder();
    for (let k = 0; k < nb; k++) {
      const methode = v.getUint16(p + 10, true), taille = v.getUint32(p + 20, true);
      const ln = v.getUint16(p + 28, true), lx = v.getUint16(p + 30, true), lc = v.getUint16(p + 32, true), local = v.getUint32(p + 42, true);
      const nom = dec.decode(new Uint8Array(octets, p + 46, ln));
      const debut = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
      const brut = new Uint8Array(octets, debut, taille);
      fichiers[nom] = methode === 0 ? brut
        : new Uint8Array(await new Response(new Blob([brut]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer());
      p += 46 + ln + lx + lc;
    }
    return fichiers;
  }
  async function lire(octets) {
    const f = await dezipper(octets);
    const dec = new TextDecoder();
    const doc = nom => f[nom] ? new DOMParser().parseFromString(dec.decode(f[nom]), "application/xml") : null;
    const tous = (d, tag) => d ? [...d.getElementsByTagNameNS("*", tag)] : [];
    const partages = tous(doc("xl/sharedStrings.xml"), "si").map(si => tous(si, "t").map(t => t.textContent).join(""));
    const liens = {};
    tous(doc("xl/_rels/workbook.xml.rels"), "Relationship").forEach(r => { liens[r.getAttribute("Id")] = r.getAttribute("Target").replace(/^\/?(xl\/)?/, "xl/"); });
    const resultat = {};
    tous(doc("xl/workbook.xml"), "sheet").forEach(s => {
      const id = s.getAttribute("r:id") || s.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
      const lignes = [];
      tous(doc(liens[id]), "c").forEach(c => {
        const ref = c.getAttribute("r").match(/^([A-Z]+)(\d+)$/);
        const col = [...ref[1]].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1, lig = +ref[2] - 1;
        const t = c.getAttribute("t"), val = tous(c, "v")[0];
        const valeur = t === "s" ? partages[+val.textContent] : t === "inlineStr" ? tous(c, "t").map(x => x.textContent).join("") : val ? (t === "str" || t === "b" ? val.textContent : +val.textContent) : "";
        (lignes[lig] = lignes[lig] || [])[col] = valeur;
      });
      resultat[s.getAttribute("name")] = lignes;
    });
    return resultat;
  }

  function telecharger(feuilles, nom) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(creer(feuilles));
    a.download = nom;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  return { creer, lire, telecharger };
})();
