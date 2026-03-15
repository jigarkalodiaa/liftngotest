/**
 * Design tokens: single source of truth for colors and font sizes.
 * Use these constants instead of hardcoded values.
 *
 * Usage:
 * - Inline styles: import { theme } from '@/config/theme'; style={{ color: theme.colors.primary, fontSize: theme.fontSizes.md }}
 * - Tailwind/CSS: globals.css :root defines the same values as CSS variables (--color-primary, etc.); keep in sync when changing this file.
 */

export const colors = {
  // Brand
  primary: '#2C2D5B',
  primaryHover: '#23244a',
  /** LiftnGo landing accent (find-restaurant, download section) – sync with --landing-primary in globals.css */
  landingPrimary: '#4A2CCC',
  whatsappGreen: '#25D366',

  // Neutrals
  white: '#FFFFFF',
  black: '#171717',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Semantic
  success: '#10B981',
  error: '#EF4444',
  errorLight: '#FEE2E2',

  // UI
  border: '#D1D5DB',
  borderLight: '#E5E7EB',
  textPrimary: '#2F2E41',
  textSecondary: '#6E6D7A',
  textMuted: '#6B7280',
  surface: '#F8FAFC',
  surfaceMuted: '#FAFAFA',
  primaryTint: '#EEF0FF',
  /** Warning / restricted notice box */
  warningBg: '#FFFBEB',
  warningBorder: '#FDE68A',
} as const;

export const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.8125rem',  // 13px
  base: '0.875rem', // 14px
  md: '0.9375rem',  // 15px
  lg: '1rem',       // 16px
  xl: '1.125rem',   // 18px
  '2xl': '1.25rem', // 20px
  '3xl': '1.5rem',  // 24px
  '4xl': '1.75rem', // 28px
} as const;

/** For inline styles: theme.colors.primary, theme.fontSizes.md */
export const theme = {
  colors,
  fontSizes,
} as const;

export default theme;
