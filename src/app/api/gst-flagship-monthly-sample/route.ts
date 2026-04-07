import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { buildGstFlagshipSamplePdfBuffer } from '@/lib/pdf/gstFlagshipSamplePdf';

const SAMPLE_FILENAME = 'liftngo-flagship-monthly-bulk-gst-report-sample.pdf';

/**
 * Serves the flagship GST sample PDF. Prefers the file in /public/samples when
 * present; otherwise generates bytes in-process (for dev before emit script runs).
 */
export async function GET() {
  const publicPath = join(process.cwd(), 'public', 'samples', SAMPLE_FILENAME);
  let buf: Buffer;
  try {
    buf = readFileSync(publicPath);
  } catch {
    buf = buildGstFlagshipSamplePdfBuffer();
  }

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${SAMPLE_FILENAME}"`,
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
