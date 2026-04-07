/**
 * Minimal valid PDF for the flagship monthly bulk GST sample (same bytes as
 * public/samples/liftngo-flagship-monthly-bulk-gst-report-sample.pdf).
 * Built with Buffer + exact xref offsets so Acrobat / Preview / Chrome open it.
 */

export function buildGstFlagshipSamplePdfBuffer(): Buffer {
  const blocks: Buffer[] = [];
  let total = 0;
  const offsets: number[] = [];

  const push = (b: Buffer) => {
    blocks.push(b);
    total += b.length;
  };

  const pushObj = (n: number, body: string) => {
    offsets[n] = total;
    push(Buffer.from(`${n} 0 obj\n${body}\nendobj\n`, 'latin1'));
  };

  push(Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', 'latin1'));

  pushObj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  pushObj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  pushObj(
    3,
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
  );

  const streamText = [
    'BT',
    '/F1 10 Tf',
    '72 740 Td (Liftngo - Flagship Monthly Bulk GST Report) Tj',
    '0 -16 Td ((SAMPLE - illustrative layout for finance teams)) Tj',
    '0 -16 Td (Production PDFs include: cover & GSTIN, HSN summary matrix,) Tj',
    '0 -16 Td (trip annex with IDs, PO / cost-centre columns on Business tier.) Tj',
    '0 -20 Td (See liftngo.com/plans/gst - Request Business quote when ready.) Tj',
    'ET',
  ].join('\n');
  const streamContent = Buffer.from(`${streamText}\n`, 'latin1');
  const head = Buffer.from(`4 0 obj\n<< /Length ${streamContent.length} >>\nstream\n`, 'latin1');
  const tail = Buffer.from('endstream\nendobj\n', 'latin1');
  offsets[4] = total;
  push(Buffer.concat([head, streamContent, tail]));

  pushObj(5, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

  const xrefPos = total;
  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  for (let i = 1; i <= 5; i++) {
    xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  xref += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  push(Buffer.from(xref, 'latin1'));

  return Buffer.concat(blocks);
}

/** Stable public URL (works without API routes, e.g. static hosting). */
export const GST_FLAGSHIP_SAMPLE_PDF_PATH = '/samples/liftngo-flagship-monthly-bulk-gst-report-sample.pdf';
