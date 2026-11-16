import type { ReportModel } from "./types";

// Word (.docx) writer, ported from js/reports/docx.js: a real Word document from the same report model as the PDF,
// zipped without compression ("stored" entries), which is all a .docx needs.

const CRC_TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(bytes: Uint8Array) { let c = 0xFFFFFFFF; for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]!) & 255]! ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
// A zip archive with uncompressed ("stored") entries: all a .docx needs.
function zipStore(files: [string, string][]): Uint8Array {
  const enc = new TextEncoder(), parts: Uint8Array[] = [], central: Uint8Array[] = []; let offset = 0;
  const d = new Date(), dosTime = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), dosDate = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  const u16 = (v: number, a: Uint8Array, o: number) => { a[o] = v & 255; a[o + 1] = (v >>> 8) & 255; }, u32 = (v: number, a: Uint8Array, o: number) => { u16(v & 0xFFFF, a, o); u16(v >>> 16, a, o + 2); };
  files.forEach(([name, text]) => {
    const nb = enc.encode(name), data = enc.encode(text), crc = crc32(data);
    const h = new Uint8Array(30 + nb.length);
    u32(0x04034b50, h, 0); u16(20, h, 4); u16(0x0800, h, 6); u16(0, h, 8); u16(dosTime, h, 10); u16(dosDate, h, 12);
    u32(crc, h, 14); u32(data.length, h, 18); u32(data.length, h, 22); u16(nb.length, h, 26); u16(0, h, 28); h.set(nb, 30);
    const c = new Uint8Array(46 + nb.length);
    u32(0x02014b50, c, 0); u16(20, c, 4); u16(20, c, 6); u16(0x0800, c, 8); u16(0, c, 10); u16(dosTime, c, 12); u16(dosDate, c, 14);
    u32(crc, c, 16); u32(data.length, c, 20); u32(data.length, c, 24); u16(nb.length, c, 28); u16(0, c, 30); u16(0, c, 32); u16(0, c, 34); u16(0, c, 36); u32(0, c, 38); u32(offset, c, 42); c.set(nb, 46);
    parts.push(h, data); central.push(c); offset += h.length + data.length;
  });
  const cdSize = central.reduce((s, c) => s + c.length, 0), end = new Uint8Array(22);
  u32(0x06054b50, end, 0); u16(0, end, 4); u16(0, end, 6); u16(files.length, end, 8); u16(files.length, end, 10); u32(cdSize, end, 12); u32(offset, end, 16); u16(0, end, 20);
  const all = [...parts, ...central, end], out = new Uint8Array(all.reduce((n, a) => n + a.length, 0));
  let at = 0; for (const a of all) { out.set(a, at); at += a.length; }
  return out;
}
// Control characters aren't allowed in Word's XML, so they are removed.
// eslint-disable-next-line no-control-regex
const xmlEsc = (s: string) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" } as Record<string, string>)[c]!).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");

/** A Word document of the report, with Word's own heading styles (navigation pane, screen readers). */
export function reportToDocx(rep: ReportModel): Uint8Array {
  const run = (t: string, o?: string) => `<w:r>${o ? `<w:rPr>${o}</w:rPr>` : ""}<w:t xml:space="preserve">${xmlEsc(t)}</w:t></w:r>`;
  const p = (t: string, style?: string, o?: string) => `<w:p>${style ? `<w:pPr><w:pStyle w:val="${style}"/></w:pPr>` : ""}${run(t, o)}</w:p>`;
  const cell = (t: string, w: number, head: boolean) => `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="pct"/>${head ? '<w:shd w:val="clear" w:color="auto" w:fill="EEF2F0"/>' : ""}</w:tcPr><w:p><w:pPr><w:spacing w:after="0"/></w:pPr>${run(t, head ? "<w:b/>" : "")}</w:p></w:tc>`;
  const table = (head: string[], rows: string[][], widths?: number[]) => {
    const ws = widths || head.map(() => 1), tot = ws.reduce((a, b) => a + b, 0), pct = ws.map(w => Math.round(w / tot * 5000));
    const border = '<w:top w:val="single" w:sz="4" w:color="D3DDDA"/><w:left w:val="single" w:sz="4" w:color="D3DDDA"/><w:bottom w:val="single" w:sz="4" w:color="D3DDDA"/><w:right w:val="single" w:sz="4" w:color="D3DDDA"/><w:insideH w:val="single" w:sz="4" w:color="D3DDDA"/><w:insideV w:val="single" w:sz="4" w:color="D3DDDA"/>';
    return `<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>${border}</w:tblBorders><w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr>
      <w:tr><w:trPr><w:tblHeader/></w:trPr>${head.map((h, i) => cell(h, pct[i]!, true)).join("")}</w:tr>
      ${rows.map(r => `<w:tr><w:trPr><w:cantSplit/></w:trPr>${head.map((_, i) => cell(r[i] == null ? "" : String(r[i]), pct[i]!, false)).join("")}</w:tr>`).join("")}</w:tbl><w:p/>`;
  };
  let body = p(rep.title, "Title");
  if (rep.subtitle) body += p(rep.subtitle, "Subtitle");
  if (rep.meta && rep.meta.length) body += table(["Detail", "Value"], rep.meta, [1, 2.4]);
  (rep.sections || []).forEach(sec => {
    body += p(sec.heading, "Heading1");
    (sec.paras || []).forEach(t => { body += p(t); });
    (sec.bullets || []).forEach(t => { body += p(t, "ListBullet"); });
    if (sec.table && sec.table.rows.length) body += table(sec.table.head, sec.table.rows, sec.table.widths);
  });
  if (rep.footer) body += p(rep.footer, "Note");
  const footer = `<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:pStyle w:val="Note"/></w:pPr>${run(rep.pageNote || "")}<w:r><w:tab/></w:r>${run("Page ")}<w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>`;
  const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document ${W}><w:body>${body}<w:sectPr><w:footerReference w:type="default" r:id="rIdFooter"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  const font = '<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>';
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr>${font}<w:color w:val="2E3A39"/><w:sz w:val="22"/><w:lang w:val="en-ZA"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="288" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:pBdr><w:top w:val="single" w:sz="24" w:space="8" w:color="426C65"/></w:pBdr><w:spacing w:after="60"/></w:pPr><w:rPr><w:b/><w:sz w:val="40"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:rPr><w:color w:val="5D6B69"/><w:sz w:val="24"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="280" w:after="100"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="426C65"/><w:sz w:val="28"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="ListBullet"><w:name w:val="List Bullet"/><w:basedOn w:val="Normal"/><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:spacing w:after="60"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Note"><w:name w:val="Note"/><w:basedOn w:val="Normal"/><w:rPr><w:color w:val="5D6B69"/><w:sz w:val="18"/></w:rPr></w:style>
</w:styles>`;
  const numbering = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="360" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;
  const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");
  return zipStore([
    ["[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`],
    ["_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`],
    ["docProps/core.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xmlEsc(rep.title)}</dc:title><dc:creator>2to.iQ Thinking Lab</dc:creator><dc:language>en-ZA</dc:language><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created></cp:coreProperties>`],
    ["word/_rels/document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdNumbering" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/><Relationship Id="rIdFooter" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/></Relationships>`],
    ["word/document.xml", document],
    ["word/styles.xml", styles],
    ["word/numbering.xml", numbering],
    ["word/footer1.xml", footer]
  ]);
}
