import { SITE_NAME } from '@/lib/site';
import {
  GRIEVANCE_OFFICER_DESIGNATION,
  GRIEVANCE_OFFICER_NAME,
  LEGAL_EMAIL,
  PRIVACY_EMAIL,
} from '@/lib/legalContacts';

/** ISO date string shown as "last updated" for legal certainty */
export const TERMS_LAST_UPDATED_ISO = '2026-04-05';

export type TermsSubsection = {
  heading: string;
  /** Paragraphs (plain text; HTML avoided except we render as text) */
  body: string[];
};

export type TermsSection = {
  id: string;
  title: string;
  intro?: string[];
  subsections?: TermsSubsection[];
  /** Standalone paragraphs when no subsections */
  body?: string[];
};

/**
 * Terms of Service — comprehensive, India-oriented, aligned with platform flows
 * (trips, subscription packs, rental, lease prepay, Razorpay, GST messaging).
 * Not a substitute for independent legal advice.
 */
export function buildTermsSections(siteName: string): TermsSection[] {
  return [
    {
      id: 'agreement',
      title: '1. Agreement to these Terms',
      intro: [
        `These Terms of Service ("Terms") form a binding agreement between you ("you", "your", "User") and ${siteName} and its affiliates, successors, and assigns ("${siteName}", "we", "us", "our") governing access to and use of ${siteName}'s websites, mobile applications, APIs, dashboards, and related services (collectively, the "Platform").`,
        `By creating an account, requesting a demo, booking a service, paying through the Platform, clicking "accept", or otherwise using the Platform, you confirm that you have read, understood, and agree to these Terms, our Privacy Policy, and any additional terms presented at checkout or in an order confirmation (including prepayment declarations for lease or subscription products) ("Supplemental Terms"). If you use the Platform on behalf of a company or other legal entity, you represent that you are authorized to bind that entity, and "you" includes that entity.`,
        `If you do not agree, you must not access or use the Platform.`,
        `We may provide notices, invoices, receipts, trip summaries, and policy updates electronically (including by email, SMS, WhatsApp where you opt in or where operational messages are permitted, in-app notification, or posting on the Platform). You consent to receive such communications unless applicable law requires another method.`,
      ],
    },
    {
      id: 'definitions',
      title: '2. Definitions',
      body: [
        `"Customer" means any business or individual booking or contracting for logistics, delivery, subscription, rental, lease, or related services via the Platform.`,
        `"Driver Partner" or "Partner" means an independent third party (individual or entity) who fulfils transportation or related tasks facilitated by the Platform. Unless expressly stated in a separate written agreement, Partners are not employees, agents, or franchisees of ${siteName}.`,
        `"Trip" or "Booking" means a specific request for movement of goods or performance of a logistics task coordinated through the Platform.`,
        `"Fees" means amounts payable for Platform services, trips, packs, subscriptions, rentals, leases, automation tiers, or other billable items, including applicable taxes as stated at checkout or on tax invoices.`,
        `"Personal Data" has the meaning given in our Privacy Policy.`,
      ],
    },
    {
      id: 'eligibility',
      title: '3. Eligibility, Accounts, and Credentials',
      subsections: [
        {
          heading: '3.1 Age and capacity',
          body: [
            `You must be at least eighteen (18) years old and capable of entering into a binding contract under applicable law.`,
            `For business accounts, you represent that the business is validly formed and you have authority to act.`,
          ],
        },
        {
          heading: '3.2 Account security',
          body: [
            `You are responsible for safeguarding passwords, OTPs, API keys, and devices used to access the Platform. Promptly notify us of suspected unauthorized access.`,
            `You must provide accurate registration and billing information (including GSTIN, billing address, and contact details where invoicing or statutory compliance requires). Misrepresentation may result in suspension, withholding of services, or invalidation of tax documentation.`,
          ],
        },
        {
          heading: '3.3 KYC and verification',
          body: [
            `We may request documents or verification steps (including business PAN/GSTIN, bank details for settlements, or identity checks) to comply with law, manage risk, or activate certain products. Failure to complete reasonable verification may limit features or payouts.`,
          ],
        },
      ],
    },
    {
      id: 'platform-role',
      title: '4. Nature of the Platform',
      subsections: [
        {
          heading: '4.1 Facilitation',
          body: [
            `${siteName} operates a technology platform. Unless a specific order, lease schedule, or written contract states otherwise, ${siteName} facilitates connections, pricing interfaces, routing, communications, payments orchestration, and operational tooling between Customers and Partners—subject to operational coverage and product constraints in your geography.`,
            `We are not a common carrier, insurer of goods, or guarantor of Partner behaviour; statutory or contractual liability for carriage may arise under separate documents (e.g. consignment terms, lease agreement) where explicitly stated.`,
          ],
        },
        {
          heading: '4.2 Service areas and availability',
          body: [
            `Coverage, vehicle types, ETAs, and feature availability vary by lane, season, regulatory environment, and Partner supply. We may suspend or modify routes, pricing logic, or products with or without notice where required for safety, compliance, or operational viability.`,
          ],
        },
      ],
    },
    {
      id: 'products',
      title: '5. Products and Commercial Programs',
      intro: [
        `The following descriptions summarize categories of offerings that may be presented on the Platform. Binding commercial terms (including price, quantity, validity, and tax) are those confirmed at checkout, in an executed agreement, or on a valid tax invoice issued by ${siteName} or its billing entity.`,
      ],
      subsections: [
        {
          heading: '5.1 On-demand and scheduled trips',
          body: [
            `Ad hoc bookings are offered subject to acceptance by the Platform and Partner availability. Fares may depend on vehicle class, distance, waiting time, tolls, surcharges, and promotions displayed before confirmation.`,
          ],
        },
        {
          heading: '5.2 Subscription / trip packs',
          body: [
            `Committed-volume packs may offer improved per-trip economics in exchange for prepayment or minimum usage rules disclosed before purchase. Pack validity, rollover rules (if any), and forfeiture on expiry are stated in-product and in checkout disclosures. Indicative marketing numbers are non-binding until confirmed in your order summary.`,
          ],
        },
        {
          heading: '5.3 Vehicle rental (driver optional)',
          body: [
            `Short-term rental products may be offered with day/week/month tenures. Insurance, fuel, driver inclusion, and damage liability follow the rental flow and any rental agreement presented at booking.`,
          ],
        },
        {
          heading: '5.4 Long-term lease',
          body: [
            `Lease products may require prepayment of the full committed term (e.g. six or twelve months) as a multiple of the monthly lease fee excluding GST plus applicable GST on that amount, collected via approved payment gateways (such as Razorpay) at checkout. The prepayment declaration and consent wording presented at payment (including vehicle class, term length, amounts, and tax) forms part of your agreement for that transaction.`,
            `A separate lease agreement or activation pack may follow order confirmation; in case of inconsistency on commercial quantum for the prepaid tranche, the binding tax invoice and executed lease schedule for that order prevail.`,
            `Earning examples or ROI narratives on marketing pages are illustrative and not income guarantees.`,
          ],
        },
        {
          heading: '5.5 Custom / calculator plans',
          body: [
            `Blended fleet or corridor-specific constructions may be estimated in tools before formal quotation. Estimates do not guarantee final pricing until confirmed by ${siteName} and, where required, accepted in writing or via checkout.`,
          ],
        },
        {
          heading: '5.6 GST billing and automation',
          body: [
            `Where offered, GST-ready artefacts (per-trip invoices, consolidated summaries, or automation tiers) are subject to plan limits, data completeness in your profile, and applicable law. Automation fees (if any) are ${siteName}'s charges for platform services—not government statutory fees unless labelled otherwise.`,
          ],
        },
      ],
    },
    {
      id: 'booking-obligations',
      title: '6. Customer Obligations for Trips and Cargo',
      subsections: [
        {
          heading: '6.1 Accurate information',
          body: [
            `You must provide truthful pickup and drop details, cargo descriptions, special handling needs, access constraints, and regulatory declarations (e.g. dangerous goods, temperature control). Misdeclaration may void coverage, void promotions, and incur charges or liability.`,
          ],
        },
        {
          heading: '6.2 Prohibited and restricted goods',
          body: [
            `You may not book illegal, stolen, or hazardous goods outside permitted regulatory frameworks. Weapons, narcotics, cash bulk outside policy, counterfeit goods, and other barred categories are prohibited. We and Partners may refuse, offload, or report suspicious consignments as required by law.`,
          ],
        },
        {
          heading: '6.3 Loading, packaging, and access',
          body: [
            `Unless otherwise agreed, you are responsible for safe packaging, labelling, loading/unloading manpower, and lawful access to premises. Waiting charges may apply as per in-app rules.`,
          ],
        },
        {
          heading: '6.4 Proof of delivery and disputes',
          body: [
            `Electronic POD, OTP-based handover, photos, or geotags may constitute delivery evidence. Disputes must be raised within timelines and channels published in support policies; delayed notice may limit remedies.`,
          ],
        },
      ],
    },
    {
      id: 'fees-tax',
      title: '7. Fees, Taxes, and Invoicing',
      subsections: [
        {
          heading: '7.1 Display vs invoice',
          body: [
            `Marketing pages, calculators, and dashboards may show indicative amounts. The amount on your checkout page, order receipt, and statutory tax invoice (where issued) controls for that transaction, subject to manifest errors that we may correct where law allows.`,
          ],
        },
        {
          heading: '7.2 GST and indirect taxes',
          body: [
            `Tax treatment depends on place of supply, service category, and your GST registration status. You must maintain accurate GSTIN and business addresses. You indemnify ${siteName} against losses arising from incorrect tax data you supply.`,
          ],
        },
        {
          heading: '7.3 Tolls, parking, and pass-throughs',
          body: [
            `Certain road, toll, parking, state-entry, or demurrage costs may be charged on actuals or estimates as disclosed before or after the Trip, consistent with product rules.`,
          ],
        },
      ],
    },
    {
      id: 'payments',
      title: '8. Payments, Gateways, and Settlement',
      subsections: [
        {
          heading: '8.1 Payment methods',
          body: [
            `We may accept card, UPI, net banking, wallets, or other methods via certified payment partners (e.g. Razorpay). Your use of those instruments is also subject to issuer/bank rules and the payment processor's terms.`,
          ],
        },
        {
          heading: '8.2 Authorization',
          body: [
            `By submitting payment, you represent that you are authorized to use the payment method and that charges are lawful company expenditures where applicable.`,
          ],
        },
        {
          heading: '8.3 Chargebacks and reversals',
          body: [
            `You agree to attempt resolution with ${siteName} before initiating chargebacks where reasonably practicable. Fraudulent chargebacks or abuse may result in account closure and recovery actions.`,
          ],
        },
        {
          heading: '8.4 Currency',
          body: [
            `Unless stated otherwise, amounts are in Indian Rupees (INR).`,
          ],
        },
      ],
    },
    {
      id: 'cancellations-refunds',
      title: '9. Cancellations, Credits, and Refunds',
      body: [
        `Cancellation fees, no-show charges, and refund eligibility depend on product type, timing of cancellation, Partner dispatch status, and campaign rules disclosed at booking.`,
        `For prepaid packs, leases, or non-trip products, refund and credit rules are specified at purchase. Some products may be non-refundable after activation or beyond statutory cooling-off windows where permitted.`,
        `Where refunds are approved, processing times may depend on payment partners and banks.`,
        `Nothing in this section limits mandatory consumer or statutory rights that cannot be waived under applicable law.`,
      ],
    },
    {
      id: 'acceptable-use',
      title: '10. Acceptable Use and Fair Practice',
      body: [
        `You may not misuse the Platform: no scraping or excessive automated access without consent; no circumvention of fees; no collusion with Partners to defraud ${siteName}; no harassment; no transmission of malware; no impersonation; no use of the Platform to compete unfairly by misappropriating data or disrupting operations.`,
        `We may rate-limit, throttle API usage, or require commercial agreements for high-volume integrations.`,
        `We may investigate anomalies (duplicate accounts, refund rings, GPS spoofing) and cooperate with law enforcement.`,
      ],
    },
    {
      id: 'ip',
      title: '11. Intellectual Property',
      body: [
        `${siteName} and its licensors own the Platform, trademarks, logos, software, dashboards, documentation, and aggregated analytics (excluding your confidential business data). We grant you a limited, non-exclusive, non-transferable, revocable license to use the Platform for its intended purpose during your compliance with these Terms.`,
        `Feedback you provide may be used by ${siteName} without obligation to you, except where a separate signed agreement states otherwise.`,
      ],
    },
    {
      id: 'data-privacy-security',
      title: '12. Data, Privacy, and Security',
      subsections: [
        {
          heading: '12.1 Privacy Policy',
          body: [
            `Our collection, use, sharing, retention, and rights related to Personal Data are described in the Privacy Policy, which is incorporated by reference.`,
          ],
        },
        {
          heading: '12.2 Security measures',
          body: [
            `${siteName} implements administrative, technical, and organizational safeguards appropriate to the nature of our processing—such as access controls on production systems, encryption in transit where standard for the channel, logging and monitoring, vendor due diligence for subprocessors, and staff confidentiality obligations.`,
            `No system is immune to attack or misconfiguration. You acknowledge residual risk and agree to protect your endpoints, rotate credentials, and report incidents promptly. We will comply with breach notification requirements applicable to us under Indian law where they arise.`,
          ],
        },
        {
          heading: '12.3 Data residency and subprocessors',
          body: [
            `Data may be processed in India and, where required for redundancy or specific tools, in other jurisdictions with appropriate safeguards as described in our Privacy Policy or data processing terms offered to enterprise Customers.`,
          ],
        },
      ],
    },
    {
      id: 'third-parties',
      title: '13. Third-Party Services',
      body: [
        `The Platform may link to or embed maps, analytics, communication providers, payment gateways, cloud infrastructure, or Partner tools. Those services are governed by their own terms. ${siteName} is not responsible for third-party failures beyond commercially reasonable mitigation.`,
      ],
    },
    {
      id: 'warranties-disclaimers',
      title: '14. Warranties and Disclaimers',
      body: [
        `EXCEPT WHERE PROHIBITED BY LAW, THE PLATFORM AND ALL RELATED SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE". TO THE MAXIMUM EXTENT PERMITTED, ${siteName.toUpperCase()} DISCLAIMS IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.`,
        `We do not warrant uninterrupted, timely, secure, or error-free operation; any material downloaded is at your risk.`,
        `Illustrative earnings, benchmarks, maps, or ETAs are informational.`,
      ],
    },
    {
      id: 'liability',
      title: '15. Limitation of Liability',
      body: [
        `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NEITHER ${siteName.toUpperCase()} NOR ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, OR PARTNERS SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOSS OF PROFITS, GOODWILL, DATA, OR BUSINESS INTERRUPTION, ARISING FROM OR RELATED TO THE PLATFORM OR THESE TERMS, EVEN IF ADVISED OF THE POSSIBILITY.`,
        `TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${siteName}'S AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THE PLATFORM OR TERMS SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO ${siteName.toUpperCase()} FOR THE SPECIFIC SERVICE GIVING RISE TO THE CLAIM IN THE THREE (3) MONTHS BEFORE THE EVENT, OR (B) INR FIVE THOUSAND (₹5,000)—EXCEPT THAT THIS CAP DOES NOT APPLY WHERE STATUTE PROHIBITS SUCH LIMITATION (INCLUDING CERTAIN CONSUMER OR PERSONAL INJURY CLAIMS WHERE LIABILITY CANNOT BE EXCLUDED).`,
        `For high-value programs (including long-term lease prepayments), you are encouraged to complete diligence, obtain internal approvals, and use consultant channels we provide prior to payment.`,
      ],
    },
    {
      id: 'indemnity',
      title: '16. Indemnity',
      body: [
        `You will defend, indemnify, and hold harmless ${siteName}, its affiliates, and personnel from third-party claims, damages, fines, and reasonable legal costs arising from: (a) your breach of these Terms; (b) your cargo, instructions, or premises; (c) your violation of law or third-party rights; (d) tax positions relying on data you supplied; or (e) disputes between you and Partners except to the extent caused by ${siteName}'s willful misconduct as finally adjudicated.`,
      ],
    },
    {
      id: 'suspension-termination',
      title: '17. Suspension and Termination',
      body: [
        `We may suspend or terminate accounts or specific features for risk, abuse, non-payment, legal demand, or material breach. You may stop using the Platform at any time; outstanding Fees and post-termination obligations survive.`,
        `Sections intended to survive (including intellectual property, disclaimers, limitation of liability, indemnity, governing law, and dispute resolution) remain in effect.`,
      ],
    },
    {
      id: 'compliance-law',
      title: '18. Regulatory Compliance (India-Oriented)',
      subsections: [
        {
          heading: '18.1 Lawful use',
          body: [
            `You will comply with the Information Technology Act, 2000, rules thereunder (including Reasonable Security Practices where applicable to your role), motor transport and goods carriage laws, GST law, e-way bill rules where relevant, and local municipal or environmental regulations for your cargo and operations.`,
          ],
        },
        {
          heading: '18.2 Records',
          body: [
            `You consent to ${siteName} retaining transaction records, communications, and operational logs as required for audits, tax, dispute resolution, and security investigations, for durations guided by law and internal policy.`,
          ],
        },
        {
          heading: '18.3 Export and sanctions',
          body: [
            `You represent that you are not subject to sanctions or restrictions that would prohibit ${siteName} from serving you under Indian or applicable international rules relevant to our banking and cloud partners.`,
          ],
        },
      ],
    },
    {
      id: 'disputes',
      title: '19. Governing Law and Dispute Resolution',
      body: [
        `These Terms are governed by the laws of India, without regard to conflict-of-law rules.`,
        `Courts at New Delhi, India shall have exclusive jurisdiction, subject to mandatory provisions of law that require another forum for specific consumer or small-business matters.`,
        `Before filing a claim, you agree to provide written notice and a reasonable cure period to resolve disputes amicably via ${siteName} support or escalations.`,
        `Complaints involving personal data or privacy under applicable Indian law should first be directed to our ${GRIEVANCE_OFFICER_DESIGNATION}, ${GRIEVANCE_OFFICER_NAME}, at ${PRIVACY_EMAIL}, as further described in our Privacy Policy and on the Contact page.`,
      ],
    },
    {
      id: 'changes',
      title: '20. Changes to Terms',
      body: [
        `We may modify these Terms to reflect new products, legal requirements, or risk controls. Material changes will be communicated by reasonable means (e.g. prominent notice, email to your registered address, or in-app alert). Continued use after the effective date constitutes acceptance where law permits; where consent is required separately, we will seek it.`,
      ],
    },
    {
      id: 'misc',
      title: '21. Miscellaneous',
      body: [
        `Assignment: You may not assign these Terms without our consent; we may assign in connection with merger, financing, or sale of assets.`,
        `Severability: If a provision is invalid, the remainder remains enforceable.`,
        `Waiver: Failure to enforce a provision is not a waiver.`,
        `Entire agreement: These Terms, the Privacy Policy, and Supplemental Terms constitute the entire agreement regarding the Platform subject to any executed enterprise agreement that expressly overrides for enterprise accounts.`,
      ],
    },
    {
      id: 'contact',
      title: '22. Contact and Legal Notices',
      body: [
        `Legal and commercial notices may be sent to ${LEGAL_EMAIL} (or to addresses published on the Platform).`,
        `${GRIEVANCE_OFFICER_DESIGNATION}: ${GRIEVANCE_OFFICER_NAME}. For customer-support escalations, privacy and personal-data grievances, and statutory grievance redressal routes under applicable Indian law, contact ${GRIEVANCE_OFFICER_NAME} at ${PRIVACY_EMAIL}. Phone and other channels are listed on our Contact page, including the published grievance section.`,
        `For statutory or regulatory notices where a physical address is required, use the registered business address published on the Platform or in corporate disclosures.`,
      ],
    },
  ];
}

export const TERMS_SECTIONS: TermsSection[] = buildTermsSections(SITE_NAME);
