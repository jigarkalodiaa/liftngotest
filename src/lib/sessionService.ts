import type { ChatRole, ChatTurn } from '@/types/chat';

const MAX_MESSAGES = 5;

export type SessionRecord = {
  messages: ChatTurn[];
  /** User message matched lead keywords; assistant should collect name and phone. */
  awaitingLeadDetails: boolean;
  leadSaved: boolean;
};

const store = new Map<string, SessionRecord>();

export function getOrCreateSession(sessionId: string): SessionRecord {
  let rec = store.get(sessionId);
  if (!rec) {
    rec = { messages: [], awaitingLeadDetails: false, leadSaved: false };
    store.set(sessionId, rec);
  }
  return rec;
}

export function appendMessage(sessionId: string, role: ChatRole, content: string): void {
  const rec = getOrCreateSession(sessionId);
  rec.messages.push({ role, content });
  if (rec.messages.length > MAX_MESSAGES) {
    rec.messages = rec.messages.slice(-MAX_MESSAGES);
  }
}

export function patchSession(sessionId: string, patch: Partial<SessionRecord>): SessionRecord {
  const rec = getOrCreateSession(sessionId);
  Object.assign(rec, patch);
  return rec;
}

/** For tests / admin only — in-memory store resets on cold start. */
export function _clearSessionsForTests(): void {
  store.clear();
}
