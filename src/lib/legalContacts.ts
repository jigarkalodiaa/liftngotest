/**
 * Named contacts for regulatory, DPDP, and consumer grievance disclosures.
 * Single source of truth — update here when officers change.
 */

export const GRIEVANCE_OFFICER_NAME = 'Saqulain';

/** As published for data-protection and customer grievance redressal */
export const GRIEVANCE_OFFICER_DESIGNATION =
  'Grievance Officer & Nodal Contact (Customer Support, Data Protection)';

/** Primary inbox for privacy requests and formal personal-data grievances */
export const PRIVACY_EMAIL = 'privacy@liftngo.com';

/** Commercial, contractual, and takedown notices */
export const LEGAL_EMAIL = 'legal@liftngo.com';

/** Grievances are accepted at this address; use a clear subject line, e.g. "Grievance – Data" */
export const GRIEVANCE_OFFICER_EMAIL = PRIVACY_EMAIL;

export const grievanceMailtoHref = `mailto:${GRIEVANCE_OFFICER_EMAIL}?subject=${encodeURIComponent(
  'Grievance – Attention: ' + GRIEVANCE_OFFICER_NAME,
)}`;
