/**
 * Google Sheets integration for leads and chat logs.
 * Requires env: GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_JSON (full service account JSON string).
 * Sheets must exist with tabs: "Leads" and "ChatLogs", row 1 = headers:
 *   Leads:    timestamp | name | phone | query | source
 *   ChatLogs: session_id | user_message | bot_response | timestamp
 * Share the spreadsheet with the service account client_email as Editor.
 */
import { google } from 'googleapis';

function sheetsEnabled(): boolean {
  return Boolean(process.env.GOOGLE_SHEETS_SPREADSHEET_ID && process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
}

function getSheetsClient() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!spreadsheetId || !raw) return null;

  let credentials: Record<string, unknown>;
  try {
    credentials = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    console.warn('[excelService] Invalid GOOGLE_SERVICE_ACCOUNT_JSON');
    return null;
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return { sheets: google.sheets({ version: 'v4', auth }), spreadsheetId };
}

export type LeadRow = {
  name: string;
  phone: string;
  query: string;
  source: string;
};

export async function saveLead(data: LeadRow): Promise<void> {
  if (!sheetsEnabled()) return;

  const client = getSheetsClient();
  if (!client) return;

  const timestamp = new Date().toISOString();
  const row = [[timestamp, data.name, data.phone, data.query, data.source]];

  try {
    await client.sheets.spreadsheets.values.append({
      spreadsheetId: client.spreadsheetId,
      range: 'Leads!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: row },
    });
  } catch (e) {
    console.error('[excelService] saveLead failed', e);
  }
}

export type ChatLogRow = {
  session_id: string;
  user_message: string;
  bot_response: string;
};

export async function saveChatLog(data: ChatLogRow): Promise<void> {
  if (!sheetsEnabled()) return;

  const client = getSheetsClient();
  if (!client) return;

  const timestamp = new Date().toISOString();
  const row = [[data.session_id, data.user_message, data.bot_response, timestamp]];

  try {
    await client.sheets.spreadsheets.values.append({
      spreadsheetId: client.spreadsheetId,
      range: 'ChatLogs!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: row },
    });
  } catch (e) {
    console.error('[excelService] saveChatLog failed', e);
  }
}
