/**
 * Writes to Google Sheets either via Apps Script Web App (no Google Cloud project)
 * or via service account (`excelService`) when `APPS_SCRIPT_SHEETS_URL` is unset.
 *
 * Apps Script `doPost` should handle JSON: { kind: 'lead' | 'chat_log', ... } — see repo docs / comment below.
 */
import { saveChatLog, saveLead, type ChatLogRow, type LeadRow } from '@/lib/excelService';

const APPS_SCRIPT_URL = () => process.env.APPS_SCRIPT_SHEETS_URL?.trim() ?? '';

/** True if either Apps Script web app URL or service-account env is set. */
export function hasSheetsBackend(): boolean {
  if (APPS_SCRIPT_URL()) return true;
  return Boolean(
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim() && process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim(),
  );
}

export async function persistLead(data: LeadRow): Promise<void> {
  const url = APPS_SCRIPT_URL();
  if (url) {
    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: 'lead',
        name: data.name,
        phone: data.phone,
        query: data.query,
        source: data.source,
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`Apps Script lead failed: ${res.status} ${t.slice(0, 200)}`);
    }
    return;
  }
  await saveLead(data);
}

export async function persistChatLog(data: ChatLogRow): Promise<void> {
  const url = APPS_SCRIPT_URL();
  if (url) {
    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: 'chat_log',
        session_id: data.session_id,
        user_message: data.user_message,
        bot_response: data.bot_response,
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`Apps Script chat log failed: ${res.status} ${t.slice(0, 200)}`);
    }
    return;
  }
  await saveChatLog(data);
}

/*
 * ---------------------------------------------------------------------------
 * Apps Script (Extensions → Apps Script), bound to the SAME spreadsheet:
 *
 *   function doPost(e) {
 *     var body = JSON.parse(e.postData.contents);
 *     var ss = SpreadsheetApp.getActiveSpreadsheet();
 *     if (body.kind === 'lead') {
 *       var leads = ss.getSheetByName('Leads');
 *       if (!leads) throw new Error('Missing tab: Leads');
 *       leads.appendRow([
 *         new Date().toISOString(),
 *         body.name || '',
 *         body.phone || '',
 *         body.query || '',
 *         body.source || 'chatbot',
 *       ]);
 *     } else if (body.kind === 'chat_log') {
 *       var logs = ss.getSheetByName('ChatLogs');
 *       if (!logs) throw new Error('Missing tab: ChatLogs');
 *       logs.appendRow([
 *         body.session_id || '',
 *         body.user_message || '',
 *         body.bot_response || '',
 *         new Date().toISOString(),
 *       ]);
 *     }
 *     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 *
 * Deploy → New deployment → Web app → Execute as: Me
 * Who has access: Anyone (required for Next.js server fetch without Google login)
 * Copy /exec URL into APPS_SCRIPT_SHEETS_URL
 * ---------------------------------------------------------------------------
 */
