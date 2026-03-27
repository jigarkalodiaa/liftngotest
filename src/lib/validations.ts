/**
 * Zod schemas for form validation (TRD §11).
 * Single source of truth for field rules; used with React Hook Form.
 * - All text fields: trim whitespace; required text fields need at least 3 alphabets.
 */

import { z } from 'zod';

export const MOBILE_LENGTH = 10;
const OTP_LENGTH = 4;
const MIN_ALPHABETS = 3;

/** Count alphabetic characters (a-zA-Z) */
function countAlphabets(s: string): number {
  return s.match(/[a-zA-Z]/g)?.length ?? 0;
}

/** Normalize raw input for phone field: digits only, max MOBILE_LENGTH. Use for controlled inputs so UI stays in sync with schema. */
export function normalizePhoneInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, MOBILE_LENGTH);
}

/** Indian mobile: first digit 6–9 (TRAI allocation). */
const INDIAN_MOBILE_BODY = /^[6-9]\d{9}$/;

/** Indian 10-digit mobile: trim, digits only, no spaces; first digit 6–9 */
export const mobileSchema = z
  .string()
  .transform((s) => s.trim().replace(/\s/g, '').replace(/\D/g, ''))
  .refine((s) => s.length > 0, 'Please enter your mobile number')
  .refine((s) => s.length === MOBILE_LENGTH, 'Please enter a valid 10-digit mobile number')
  .refine((s) => INDIAN_MOBILE_BODY.test(s), 'Enter a valid Indian mobile number (must start with 6–9)');

/** OTP: trim, exactly 4 digits */
export const otpSchema = z
  .string()
  .transform((s) => s.trim().replace(/\s/g, ''))
  .refine((s) => s.length === OTP_LENGTH, 'Please enter the 4-digit OTP')
  .refine((s) => /^\d{4}$/.test(s), 'OTP must be 4 digits');

/** Trim, collapse internal spaces (no leading space, no consecutive spaces). */
export function normalizePersonNameInput(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/** Person name: required, normalized spacing, at least 3 alphabets */
export const personNameSchema = z
  .string()
  .transform((s) => normalizePersonNameInput(s))
  .refine((s) => s.length > 0, 'Name is required')
  .refine((s) => countAlphabets(s) >= MIN_ALPHABETS, 'Name must contain at least 3 letters')
  .refine((s) => s.length <= 100, 'Name is too long');

/** Same rules as personNameSchema for imperative checks (e.g. greeting). */
export function validatePersonName(value: string): { success: true; data: string } | { success: false; error: string } {
  const normalized = normalizePersonNameInput(value);
  if (normalized.length === 0) return { success: false, error: 'Name is required' };
  if (countAlphabets(normalized) < MIN_ALPHABETS) return { success: false, error: 'Name must contain at least 3 letters' };
  if (normalized.length > 100) return { success: false, error: 'Name is too long' };
  return { success: true, data: normalized };
}

/** Login: phone step */
export const loginPhoneSchema = z.object({
  phone: mobileSchema,
  termsAccepted: z.boolean().refine((v) => v === true, 'You must accept the terms to continue'),
});

/** Login: OTP step (standalone validation; phone already validated) */
export const loginOtpSchema = z.object({
  otp: otpSchema,
});

/** Sender details (Step 1 of pickup flow) */
export const senderDetailsSchema = z.object({
  senderName: personNameSchema,
  senderMobile: mobileSchema,
});

/** Receiver details (Step 2 of pickup flow) */
export const receiverDetailsSchema = z.object({
  receiverName: personNameSchema,
  receiverMobile: mobileSchema,
});

/** Indian GSTIN: 15 chars, no spaces (standard format). */
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

/** Normalize GST input: uppercase, strip spaces/non-alphanumerics, max 15. */
export function normalizeGstInput(value: string): string {
  return value.replace(/\s/g, '').toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 15);
}

/** Optional GSTIN (e.g. profile): empty OK, else must match format */
export const gstinSchema = z
  .string()
  .transform((s) => normalizeGstInput(s))
  .refine((s) => s.length === 0 || GSTIN_REGEX.test(s), 'Enter a valid 15-character GSTIN');

/** Add GST modal: both fields required; GST must be valid format */
export const addGstSchema = z.object({
  gstNumber: z
    .string()
    .transform((s) => normalizeGstInput(s))
    .refine((s) => s.length > 0, 'GST number is required')
    .refine((s) => s.length === 15, 'GST number must be 15 characters')
    .refine((s) => GSTIN_REGEX.test(s), 'Enter a valid GSTIN (e.g. 22AAAAA0000A1Z5)'),
  businessName: z
    .string()
    .transform((s) => s.trim())
    .refine((s) => s.length > 0, 'Business name is required')
    .refine((s) => countAlphabets(s) >= MIN_ALPHABETS, 'Business name must contain at least 3 letters')
    .refine((s) => s.length <= 200, 'Business name is too long'),
});

/** Optional 10-digit Indian mobile: empty OK; if filled, must match Indian pattern */
const optionalMobileSchema = z
  .string()
  .transform((s) => s.trim().replace(/\D/g, '').slice(0, MOBILE_LENGTH))
  .refine((s) => s.length === 0 || s.length === MOBILE_LENGTH, 'Enter a valid 10-digit number or leave blank')
  .refine((s) => s.length === 0 || INDIAN_MOBILE_BODY.test(s), 'Enter a valid Indian mobile number or leave blank');

/** Optional person-style name: empty OK; if filled, same spacing + letter rules as full name */
const optionalEmergencyNameSchema = z
  .string()
  .transform((s) => normalizePersonNameInput(s))
  .refine(
    (s) => s.length === 0 || countAlphabets(s) >= MIN_ALPHABETS,
    'Name must contain at least 3 letters or leave blank'
  )
  .refine((s) => s.length <= 100, 'Name is too long');

/** Optional Indian bank A/C: empty OK; digits only, typical 9–18 length */
const optionalIndianBankAccountSchema = z
  .string()
  .transform((s) => s.replace(/\s/g, ''))
  .refine(
    (s) => s.length === 0 || /^\d{9,18}$/.test(s),
    'Account number must be 9–18 digits only, or leave blank'
  );

/** Collapse line whitespace for free-text address */
export function normalizeAddressInput(value: string): string {
  return value
    .split(/\n/)
    .map((line) => line.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .join('\n')
    .trim();
}

/** Optional profile email: empty OK; else Zod email */
const profileEmailSchema = z
  .string()
  .transform((s) => s.trim())
  .refine((s) => s.length === 0 || z.string().email().safeParse(s).success, 'Enter a valid email address or leave blank');

/** Menu → My Details form */
export const userProfileFormSchema = z.object({
  fullName: personNameSchema,
  alternatePhone: optionalMobileSchema,
  emergencyContactName: optionalEmergencyNameSchema,
  emergencyContactPhone: optionalMobileSchema,
  accountNumber: optionalIndianBankAccountSchema,
  address: z
    .string()
    .transform((s) => normalizeAddressInput(s))
    .refine((s) => s.length <= 500, 'Address is too long'),
  email: profileEmailSchema,
});

export type UserProfileForm = z.infer<typeof userProfileFormSchema>;

export type LoginPhoneForm = z.infer<typeof loginPhoneSchema>;
export type LoginOtpForm = z.infer<typeof loginOtpSchema>;
export type SenderDetailsForm = z.infer<typeof senderDetailsSchema>;
export type ReceiverDetailsForm = z.infer<typeof receiverDetailsSchema>;
export type AddGstForm = z.infer<typeof addGstSchema>;
