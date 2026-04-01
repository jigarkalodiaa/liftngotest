import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hasSheetsBackend, persistLead } from '@/lib/sheetsBridge';

const bodySchema = z.object({
  name: z.string().max(200).optional().default(''),
  phone: z.string().min(10).max(20),
  query: z.string().max(4000).optional().default(''),
  source: z.string().max(120).optional().default('chatbot_widget'),
});

/** Persists chat leads to Google Sheets: Apps Script URL if set, else service account. */
export async function POST(req: Request) {
  if (!hasSheetsBackend()) {
    return NextResponse.json(
      {
        error:
          'Sheets not configured. Set APPS_SCRIPT_SHEETS_URL in .env.local, or GOOGLE_SHEETS_SPREADSHEET_ID + GOOGLE_SERVICE_ACCOUNT_JSON.',
      },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { name, phone, query, source } = parsed.data;
  try {
    await persistLead({
      name: name.trim() || 'Chat user',
      phone: phone.replace(/\s/g, ''),
      query: query.trim(),
      source,
    });
  } catch (e) {
    console.error('[api/leads]', e);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
