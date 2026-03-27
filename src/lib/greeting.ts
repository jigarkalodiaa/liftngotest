/**
 * Dashboard / UI greeting: only show a real name after the user enters valid sender details.
 * Ignores empty values, invalid names, and legacy demo placeholder data.
 */

import { getSenderDetails, getUserProfile } from '@/lib/storage';
import { validatePersonName } from '@/lib/validations';

/** Names that were shipped as demo defaults in default trips — do not use for greeting. */
const LEGACY_DEMO_NAMES = new Set(['prateek jha']);

/**
 * Returns the name to show after "Hi, …" or a fallback ("there" → "Hi, there").
 * Priority: Menu → My Details (profile fullName), then booking sender name.
 */
export function getGreetingDisplayName(): string {
  const profileName = getUserProfile()?.fullName?.trim() ?? '';
  if (profileName) {
    const pv = validatePersonName(profileName);
    if (pv.success) return pv.data;
  }

  const raw = getSenderDetails()?.name?.trim() ?? '';
  if (!raw) return 'there';
  if (LEGACY_DEMO_NAMES.has(raw.toLowerCase())) return 'there';
  const v = validatePersonName(raw);
  return v.success ? v.data : 'there';
}
