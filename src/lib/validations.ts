/**
 * Zod schemas for form validation (TRD §11).
 * Single source of truth for field rules; used with React Hook Form.
 */

import { z } from 'zod';

const MOBILE_LENGTH = 10;
const OTP_LENGTH = 4;

/** Indian 10-digit mobile (digits only) */
export const mobileSchema = z
  .string()
  .min(1, 'Please enter your mobile number')
  .transform((s) => s.replace(/\D/g, ''))
  .refine((s) => s.length === MOBILE_LENGTH, 'Please enter a valid 10-digit mobile number');

/** OTP: exactly 4 digits */
export const otpSchema = z
  .string()
  .length(OTP_LENGTH, 'Please enter the 4-digit OTP')
  .regex(/^\d{4}$/, 'OTP must be 4 digits');

/** Person name: required, 2–100 chars, trimmed */
export const personNameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name is too long')
  .transform((s) => s.trim())
  .refine((s) => s.length >= 2, 'Name must be at least 2 characters');

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

/** GSTIN: 15 chars, format 2 digits + 5 alpha + 4 digits + 1 alpha + 1 (1-9 or A-Z) + Z + 1 alphanumeric */
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
export const gstinSchema = z
  .string()
  .transform((s) => s.trim().toUpperCase())
  .refine((s) => s.length === 0 || GSTIN_REGEX.test(s), 'Enter a valid 15-character GSTIN');

/** Add GST modal: GST number optional; if provided, business name can be required by business rules */
export const addGstSchema = z.object({
  gstNumber: z.string().trim().optional(),
  businessName: z.string().max(200, 'Business name is too long').trim().optional(),
}).refine(
  (data) => {
    const hasGst = Boolean(data.gstNumber?.length);
    if (hasGst) return Boolean(data.businessName?.length);
    return true;
  },
  { message: 'Business name is required when adding GST', path: ['businessName'] }
);

export type LoginPhoneForm = z.infer<typeof loginPhoneSchema>;
export type LoginOtpForm = z.infer<typeof loginOtpSchema>;
export type SenderDetailsForm = z.infer<typeof senderDetailsSchema>;
export type ReceiverDetailsForm = z.infer<typeof receiverDetailsSchema>;
export type AddGstForm = z.infer<typeof addGstSchema>;
