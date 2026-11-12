import type { ReportModel } from "./types";

// PDF writer, ported from js/reports/pdf.js. Builds a simple A4 PDF from a report model with the built-in Helvetica
// fonts, so text is limited to Western European characters; others become "?". Headings, tables and page numbers.

// Helvetica glyph widths (per 1000 units) for characters 32 to 126.
const PDF_W = [278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
  1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
  333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584];
// Unicode characters that WinAnsiEncoding stores at 128 to 159.
const PDF_WIN: Record<number, number> = { 0x20AC: 128, 0x201A: 130, 0x0192: 131, 0x201E: 132, 0x2026: 133, 0x2020: 134, 0x2021: 135, 0x02C6: 136, 0x2030: 137, 0x0160: 138, 0x2039: 139, 0x0152: 140, 0x017D: 142,
  0x2018: 145, 0x2019: 146, 0x201C: 147, 0x201D: 148, 0x2022: 149, 0x2013: 150, 0x2014: 151, 0x02DC: 152, 0x2122: 153, 0x0161: 154, 0x203A: 155, 0x0153: 156, 0x017E: 158, 0x0178: 159 };
// Text as WinAnsi byte values held in a string (one char per byte).
function pdfBytes(s: string) {
  let out = "";
  for (const ch of String(s).normalize("NFC")) {
    const c = ch.codePointAt(0)!;
    out += String.fromCharCode(c >= 32 && c < 127 ? c : c >= 160 && c <= 255 ? c : PDF_WIN[c] || 63);
  }
  return out;
}
export function pdfWidth(s: string, size: number, bold?: boolean) {
  let w = 0;
  for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); w += c >= 32 && c < 127 ? PDF_W[c - 32]! : 556; }
  return w * size / 1000 * (bold ? 1.07 : 1);
}
function pdfWrap(text: string, size: number, bold: boolean, maxW: number) {
  const lines: string[] = [];
  String(text).split("\n").forEach(para => {
    let line = "";
    para.split(/\s+/).filter(Boolean).forEach(word => {
      const tryLine = line ? line + " " + word : word;
      if (pdfWidth(tryLine, size, bold) <= maxW) { line = tryLine; return; }
      if (line) lines.push(line);
      while (pdfWidth(word, size, bold) > maxW) { // break a very long word
        let n = word.length; while (n > 1 && pdfWidth(word.slice(0, n), size, bold) > maxW) n--;
        lines.push(word.slice(0, n)); word = word.slice(n);
      }
      line = word;
    });
    lines.push(line);
  });
  return lines;
}
function pdfEsc(s: string) { return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)"); }

/** A simple A4 PDF of the report, made on the device: no library, nothing sent anywhere. */
export function reportToPdf(rep: ReportModel): Uint8Array {
  const PW = 595.28, PH = 841.89, M = 56, CW = PW - 2 * M, BOTTOM = M + 24;
  const ink = "0.18 0.23 0.22", muted = "0.36 0.42 0.41", brand = "0.26 0.42 0.40", rule = "0.83 0.87 0.85";
  const pages: string[][] = []; let ops: string[] = [], y = 0;
  const newPage = () => { ops = []; pages.push(ops); y = PH - M; };
  const ensure = (h: number) => { if (y - h < BOTTOM) newPage(); };
  const text = (s: string, x: number, yy: number, size: number, bold?: boolean, color?: string) => ops.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${color || ink} rg ${x.toFixed(2)} ${yy.toFixed(2)} Td (${pdfEsc(s)}) Tj ET`);
  const line = (x1: number, y1: number, x2: number, y2: number, color?: string, w?: number) => ops.push(`${color || rule} RG ${w || 0.75} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  const para = (s: string, size: number, bold?: boolean, color?: string, indent?: number) => {
    const lh = size * 1.4, x = M + (indent || 0);
    pdfWrap(pdfBytes(s), size, !!bold, CW - (indent || 0)).forEach(l => { ensure(lh); y -= lh; text(l, x, y + size * 0.3, size, bold, color); });
  };
  newPage();
  // Title band
  ops.push(`${brand} rg ${M} ${y - 4} ${CW} 4 re f`); y -= 34;
  pdfWrap(pdfBytes(rep.title), 20, true, CW).forEach(l => { text(l, M, y, 20, true); y -= 26; });
  if (rep.subtitle) para(rep.subtitle, 11, false, muted);
  y -= 8;
  // Details table
  (rep.meta || []).forEach(([k, v]) => {
    const vl = pdfWrap(pdfBytes(v), 10, false, CW - 150), h = vl.length * 14 + 4;
    ensure(h); text(pdfBytes(k), M, y - 12, 10, true, muted);
    vl.forEach((l, i) => text(l, M + 150, y - 12 - i * 14, 10, false));
    y -= h;
  });
  y -= 6; line(M, y, M + CW, y); y -= 6;
  (rep.sections || []).forEach(sec => {
    ensure(48); y -= 18; pdfWrap(pdfBytes(sec.heading), 14, true, CW).forEach(l => { text(l, M, y, 14, true, brand); y -= 18; }); y += 4;
    (sec.paras || []).forEach(p => { para(p, 10.5); y -= 4; });
    (sec.bullets || []).forEach(b => {
      const lines = pdfWrap(pdfBytes(b), 10.5, false, CW - 16);
      lines.forEach((l, i) => { ensure(15); y -= 15; if (i === 0) text(pdfBytes("•"), M + 2, y + 3, 10.5, false, brand); text(l, M + 16, y + 3, 10.5); });
      y -= 3;
    });
    if (sec.table && sec.table.rows.length) {
      const t = sec.table, n = t.head.length, ws = (t.widths || t.head.map(() => 1)), tot = ws.reduce((a, b) => a + b, 0);
      const colW = ws.map(w => w / tot * CW), xs = colW.map((_, i) => M + colW.slice(0, i).reduce((a, b) => a + b, 0));
      const drawRow = (cells: string[], bold: boolean): void => {
        const wrapped = cells.map((c, i) => pdfWrap(pdfBytes(c), 9.5, bold, colW[i]! - 10)), h = Math.max(...wrapped.map(w => w.length)) * 13 + 8;
        if (y - h < BOTTOM) { newPage(); if (!bold) drawRow(t.head, true); }
        if (bold) ops.push(`0.93 0.95 0.94 rg ${M} ${(y - h).toFixed(2)} ${CW} ${h.toFixed(2)} re f`);
        wrapped.forEach((ls, i) => ls.forEach((l, j) => text(l, xs[i]! + 5, y - 14 - j * 13, 9.5, bold)));
        line(M, y - h, M + CW, y - h); y -= h;
      };
      y -= 6; line(M, y, M + CW, y); drawRow(t.head, true); t.rows.forEach(r => drawRow(r.slice(0, n).map(String), false)); y -= 6;
    }
  });
  if (rep.footer) { y -= 10; ensure(30); line(M, y, M + CW, y); y -= 4; para(rep.footer, 9, false, muted); }
  // Page numbers and a confidentiality line on every page
  pages.forEach((p, i) => {
    p.push(`BT /F1 8.5 Tf ${muted} rg ${M} ${M - 10} Td (${pdfEsc(pdfBytes(rep.pageNote || ""))}) Tj ET`);
    const pn = pdfBytes(`Page ${i + 1} of ${pages.length}`);
    p.push(`BT /F1 8.5 Tf ${muted} rg ${(M + CW - pdfWidth(pn, 8.5)).toFixed(2)} ${M - 10} Td (${pn}) Tj ET`);
  });
  // Assemble the file: catalog, page tree, two fonts, then a page and content stream per page.
  const objs: string[] = [];
  const add = (s: string) => { objs.push(s); return objs.length; };
  const catalog = add(""), pagesId = add(""), f1 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"), f2 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const kids = pages.map(p => {
    const body = p.join("\n"), content = add(`<< /Length ${body.length} >>\nstream\n${body}\nendstream`);
    return add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${content} 0 R >>`);
  });
  objs[catalog - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R /ViewerPreferences << /DisplayDocTitle true >> /Lang (en) >>`;
  objs[pagesId - 1] = `<< /Type /Pages /Kids [${kids.map(k => k + " 0 R").join(" ")}] /Count ${kids.length} >>`;
  const info = add(`<< /Title (${pdfEsc(pdfBytes(rep.title))}) /Producer (2to.iQ Thinking Lab) /CreationDate (D:${new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14)}Z) >>`);
  let out = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n"; const offs: number[] = [];
  objs.forEach((o, i) => { offs.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map(o => String(o).padStart(10, "0") + " 00000 n \n").join("");
  out += `trailer\n<< /Size ${objs.length + 1} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  const bytes = new Uint8Array(out.length);
  for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 255;
  return bytes;
}
