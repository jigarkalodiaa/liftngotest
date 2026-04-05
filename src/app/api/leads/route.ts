import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hasSheetsBackend, persistLead } from '@/lib/sheetsBridge';
import { leadPhoneSchema } from '@/lib/validations';

const bodySchema = z.object({
  name: z.string().max(200).optional().default(''),
  phone: leadPhoneSchema,
  query: z.string().max(4000).optional().default(''),
  source: z.string().max(120).optional().default('chatbot_widget'),
  company: z.string().max(200).optional().default(''),
  email: z.string().max(254).optional().default(''),
  city: z.string().max(120).optional().default(''),
  /** Honeypot — if filled, accept but do not persist. */
  website: z.string().max(200).optional().default(''),
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

  const { name, phone, query, source, company, email, city, website } = parsed.data;

  if (website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const em = email.trim();
  if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const parts: string[] = [];
  if (company.trim()) parts.push(`Company: ${company.trim()}`);
  if (em) parts.push(`Email: ${em}`);
  if (city.trim()) parts.push(`City: ${city.trim()}`);
  const msg = query.trim();
  if (msg) parts.push(`Message: ${msg}`);
  const queryCombined =
    parts.length > 0 ? parts.join('\n').slice(0, 4000) : msg.slice(0, 4000) || 'Business enquiry (no message)';

  const displayName =
    name.trim() ||
    company.trim() ||
    (source.includes('business_enquiry') ? 'Business enquiry'
    : source.includes('route_optimization') ? 'Route optimization'
    : 'Chat user');

  try {
    await persistLead({
      name: displayName,
      phone: phone,
      query: queryCombined,
      source,
    });
  } catch (e) {
    console.error('[api/leads]', e);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
