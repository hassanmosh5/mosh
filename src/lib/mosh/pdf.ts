/**
 * A very small PDF writer.
 *
 * Exports are a first-class part of the system — a year of reflection should
 * be something you can hold — but a full PDF toolkit is a heavy dependency for
 * what these reports need: headings, paragraphs, key/value rows and simple
 * tables in one standard font. This module emits a valid PDF 1.4 document with
 * a correct cross-reference table, using only the built-in Helvetica faces.
 */

export type PdfBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "text"; text: string }
  | { type: "row"; label: string; value: string }
  | { type: "table"; columns: string[]; rows: string[][] }
  | { type: "spacer" };

export type PdfDocument = {
  title: string;
  subtitle?: string;
  footer?: string;
  blocks: PdfBlock[];
};

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const BODY_SIZE = 10;
const LINE_HEIGHT = 14;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

/** Average Helvetica advance width as a fraction of the font size. */
const CHAR_WIDTH = 0.5;

const SUBSTITUTIONS: [RegExp, string][] = [
  [/[‘’‚′]/g, "'"],
  [/[“”„″]/g, '"'],
  [/[–—]/g, "-"],
  [/[…]/g, "..."],
  [/[ ]/g, " "],
  [/[→]/g, "->"],
];

/** Reduce text to the printable ASCII range the base fonts can render. */
function sanitise(value: string): string {
  let text = value;
  for (const [pattern, replacement] of SUBSTITUTIONS) text = text.replace(pattern, replacement);
  return text.replace(/[^\x20-\x7E]/g, "");
}

function escapeText(value: string): string {
  return sanitise(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrap(text: string, size: number, width = CONTENT_WIDTH): string[] {
  const max = Math.max(8, Math.floor(width / (size * CHAR_WIDTH)));
  const lines: string[] = [];

  for (const paragraph of sanitise(text).split(/\r?\n/)) {
    if (paragraph.trim() === "") {
      lines.push("");
      continue;
    }
    let current = "";
    for (const word of paragraph.split(/\s+/)) {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length <= max) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        // A single word longer than the line is hard-split rather than clipped.
        let remainder = word;
        while (remainder.length > max) {
          lines.push(remainder.slice(0, max));
          remainder = remainder.slice(max);
        }
        current = remainder;
      }
    }
    if (current) lines.push(current);
  }

  return lines;
}

type Line = { text: string; size: number; bold: boolean; gap: number };

function layout(document: PdfDocument): Line[] {
  const lines: Line[] = [
    { text: document.title, size: 18, bold: true, gap: 8 },
  ];
  if (document.subtitle) {
    lines.push({ text: document.subtitle, size: 10, bold: false, gap: 12 });
  }

  for (const block of document.blocks) {
    switch (block.type) {
      case "heading":
        lines.push({ text: "", size: BODY_SIZE, bold: false, gap: 6 });
        for (const line of wrap(block.text, 13)) {
          lines.push({ text: line, size: 13, bold: true, gap: 4 });
        }
        break;
      case "subheading":
        for (const line of wrap(block.text, 11)) {
          lines.push({ text: line, size: 11, bold: true, gap: 2 });
        }
        break;
      case "text":
        for (const line of wrap(block.text, BODY_SIZE)) {
          lines.push({ text: line, size: BODY_SIZE, bold: false, gap: 0 });
        }
        break;
      case "row": {
        const label = sanitise(block.label);
        const value = sanitise(block.value);
        for (const line of wrap(`${label}: ${value}`, BODY_SIZE)) {
          lines.push({ text: line, size: BODY_SIZE, bold: false, gap: 0 });
        }
        break;
      }
      case "table": {
        const widths = block.columns.map((column, index) =>
          Math.max(
            column.length,
            ...block.rows.map((row) => (row[index] ?? "").length)
          )
        );
        const total = widths.reduce((sum, width) => sum + width + 2, 0);
        const max = Math.floor(CONTENT_WIDTH / (BODY_SIZE * CHAR_WIDTH));
        const scale = total > max ? max / total : 1;
        const columnWidths = widths.map((width) => Math.max(4, Math.floor((width + 2) * scale)));

        const renderRow = (cells: string[]) =>
          cells
            .map((cell, index) => sanitise(cell).slice(0, columnWidths[index] - 1).padEnd(columnWidths[index]))
            .join("");

        lines.push({ text: renderRow(block.columns), size: BODY_SIZE, bold: true, gap: 0 });
        for (const row of block.rows) {
          lines.push({ text: renderRow(row), size: BODY_SIZE, bold: false, gap: 0 });
        }
        break;
      }
      case "spacer":
        lines.push({ text: "", size: BODY_SIZE, bold: false, gap: 6 });
        break;
    }
  }

  return lines;
}

function paginate(lines: Line[]): Line[][] {
  const pages: Line[][] = [];
  let current: Line[] = [];
  let y = 0;
  const usable = PAGE_HEIGHT - MARGIN * 2 - 24; // leave room for the footer

  for (const line of lines) {
    const height = Math.max(LINE_HEIGHT, line.size + 4) + line.gap;
    if (y + height > usable && current.length > 0) {
      pages.push(current);
      current = [];
      y = 0;
    }
    current.push(line);
    y += height;
  }
  if (current.length > 0) pages.push(current);
  return pages.length > 0 ? pages : [[]];
}

function contentStream(lines: Line[], footer: string, pageNumber: number, pageCount: number): string {
  const parts: string[] = ["BT"];
  let cursor = PAGE_HEIGHT - MARGIN;
  let first = true;

  for (const line of lines) {
    const height = Math.max(LINE_HEIGHT, line.size + 4) + line.gap;
    cursor -= height;
    const font = line.bold ? "/F2" : "/F1";
    parts.push(`${font} ${line.size} Tf`);
    if (first) {
      parts.push(`1 0 0 1 ${MARGIN.toFixed(2)} ${cursor.toFixed(2)} Tm`);
      first = false;
    } else {
      parts.push(`1 0 0 1 ${MARGIN.toFixed(2)} ${cursor.toFixed(2)} Tm`);
    }
    parts.push(`(${escapeText(line.text)}) Tj`);
  }

  parts.push("ET");
  parts.push("BT");
  parts.push("/F1 8 Tf");
  parts.push(`1 0 0 1 ${MARGIN.toFixed(2)} ${(MARGIN - 12).toFixed(2)} Tm`);
  parts.push(`(${escapeText(`${footer}  ·  Page ${pageNumber} of ${pageCount}`.replace("·", "-"))}) Tj`);
  parts.push("ET");

  return parts.join("\n");
}

/** Render a document to PDF bytes. */
export function renderPdf(document: PdfDocument): Uint8Array {
  const pages = paginate(layout(document));
  const footer = document.footer ?? "MOSH Self-Mastery & Wealth Alignment System";

  const objects: string[] = [];
  const pageObjectNumbers: number[] = [];

  // 1 catalog, 2 pages tree, 3 + 4 fonts, then page/content pairs.
  const firstPageObject = 5;
  pages.forEach((_, index) => pageObjectNumbers.push(firstPageObject + index * 2));

  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = `<< /Type /Pages /Kids [${pageObjectNumbers
    .map((number) => `${number} 0 R`)
    .join(" ")}] /Count ${pages.length} >>`;
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
  objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";

  pages.forEach((lines, index) => {
    const pageNumber = pageObjectNumbers[index];
    const contentNumber = pageNumber + 1;
    const stream = contentStream(lines, footer, index + 1, pages.length);

    objects[pageNumber] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH.toFixed(2)} ${PAGE_HEIGHT.toFixed(2)}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNumber} 0 R >>`;
    objects[contentNumber] = `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`;
  });

  const count = objects.length - 1;
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  for (let number = 1; number <= count; number += 1) {
    offsets[number] = Buffer.byteLength(pdf, "latin1");
    pdf += `${number} 0 obj\n${objects[number] ?? "<< >>"}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${count + 1}\n0000000000 65535 f \n`;
  for (let number = 1; number <= count; number += 1) {
    pdf += `${String(offsets[number]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${count + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return new Uint8Array(Buffer.from(pdf, "latin1"));
}
