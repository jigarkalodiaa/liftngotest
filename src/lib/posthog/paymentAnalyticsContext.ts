/** Pull safe string dimensions from Razorpay order `notes` for PostHog. */
export function paymentContextFromNotes(notes?: Record<string, string>): Record<string, unknown> {
  if (!notes) return {};
  const out: Record<string, unknown> = {};
  const keys = ['flow', 'product', 'vehicle', 'vehicle_type'] as const;
  for (const k of keys) {
    const v = notes[k];
    if (v) out[k] = v;
  }
  return out;
}
