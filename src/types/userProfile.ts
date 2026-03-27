/**
 * Saved profile from Menu → My Details (localStorage).
 * Used for dashboard greeting (fullName) and future features.
 */
export interface UserProfile {
  fullName: string;
  alternatePhone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  /** Bank / account number (user’s “AC no”) */
  accountNumber: string;
  address: string;
  email: string;
}
