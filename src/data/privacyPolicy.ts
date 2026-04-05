import { SITE_NAME } from '@/lib/site';
import {
  GRIEVANCE_OFFICER_DESIGNATION,
  GRIEVANCE_OFFICER_NAME,
  PRIVACY_EMAIL,
} from '@/lib/legalContacts';

/** ISO date — keep in sync with material legal reviews */
export const PRIVACY_LAST_UPDATED_ISO = '2026-04-05';

export type PrivacySubsection = {
  heading: string;
  body: string[];
};

export type PrivacySection = {
  id: string;
  title: string;
  intro?: string[];
  subsections?: PrivacySubsection[];
  body?: string[];
};

/**
 * Privacy Policy — detailed, India-oriented, aligned with Platform flows.
 * References applicable Indian law including the Digital Personal Data Protection Act, 2023 ("DPDP Act")
 * and rules thereunder where applicable. Not a substitute for independent legal advice.
 */
export function buildPrivacySections(siteName: string): PrivacySection[] {
  return [
    {
      id: 'introduction',
      title: '1. Introduction and scope',
      intro: [
        `This Privacy Policy ("Policy") describes how ${siteName} ("${siteName}", "we", "us", "our") and its affiliates collect, use, store, disclose, and protect personal data when you access or use our websites, mobile applications, APIs, dashboards, customer support channels, and related services (collectively, the "Platform").`,
        `This Policy applies to visitors, registered users, business customers, driver partners, and others who interact with the Platform. It should be read together with our Terms of Service, cookie notices, and any product-specific disclosures shown at booking or checkout.`,
        `By using the Platform, you acknowledge this Policy. If you do not agree, please discontinue use and contact us to close your account where applicable.`,
      ],
    },
    {
      id: 'controller',
      title: '2. Data fiduciary and contact',
      subsections: [
        {
          heading: '2.1 Who is responsible',
          body: [
            `For personal data processed in connection with the Platform, the data fiduciary (controller) is the ${siteName} group entity identified on your tax invoices, contract, or in-product disclosure, or otherwise the primary operating company stated on our Contact page.`,
            `If you are unsure which entity processes your data for a specific transaction, contact us using the details below and we will confirm.`,
          ],
        },
        {
          heading: '2.2 Grievance Officer, privacy contact, and customer support',
          body: [
            `Our ${GRIEVANCE_OFFICER_DESIGNATION} is ${GRIEVANCE_OFFICER_NAME}. For privacy requests, exercise of rights under applicable Indian personal-data law, formal grievances about our processing of your personal data, and good-faith escalations of customer-support matters with a legal or compliance angle, contact ${GRIEVANCE_OFFICER_NAME} at ${PRIVACY_EMAIL}. Include your registered phone or email with the Platform, relevant booking or order IDs where applicable, approximate dates, and a clear description of your request or complaint.`,
            `Day-to-day operational support (trip status, refunds, driver issues) may also be reached through the phone number and team inbox on our Contact page when published; those channels may coordinate with ${GRIEVANCE_OFFICER_NAME} where a grievance requires formal handling.`,
            `We may request reasonable verification before fulfilling rights requests or disclosing account information to prevent unauthorized access.`,
          ],
        },
      ],
    },
    {
      id: 'categories',
      title: '3. Categories of personal data we collect',
      intro: [
        `The categories below depend on how you use the Platform. Not every category applies to every user.`,
      ],
      subsections: [
        {
          heading: '3.1 Identity and account data',
          body: [
            `Name, phone number, email address, business name, role, profile photo (if uploaded), credentials, authentication tokens, and internal user identifiers.`,
            `For business accounts: GSTIN, PAN or equivalent tax identifiers where required for invoicing, billing addresses, purchase order references, and authorized signatory details.`,
          ],
        },
        {
          heading: '3.2 Booking, delivery, and logistics data',
          body: [
            `Pickup and drop addresses, geocoordinates, contact persons at premises, instructions, goods descriptions, weight/volume declarations, time windows, proof-of-delivery artefacts (signatures, OTP confirmations, photos), trip IDs, and chat or call metadata between you and Partners facilitated through the Platform.`,
          ],
        },
        {
          heading: '3.3 Payment and financial data',
          body: [
            `Transaction amounts, product type (trip, pack, lease, subscription, etc.), payment method type, payment status, Razorpay or other gateway transaction references, masked card or UPI identifiers where surfaced by the processor, and chargeback or reconciliation metadata.`,
            `We generally do not store full card numbers; payment partners tokenize or process card data in line with PCI-DSS expectations for their role.`,
          ],
        },
        {
          heading: '3.4 Lease, subscription, and high-value program data',
          body: [
            `Vehicle class, lease term, consent snapshots and declarations you affirm at checkout, consultant notes from sales conversations (if captured in CRM), and documents you upload for eligibility or fleet onboarding.`,
          ],
        },
        {
          heading: '3.5 Device, log, and diagnostic data',
          body: [
            `IP address, device type, operating system, app version, browser type, coarse or precise location (when you grant permission or when needed to operate maps), crash logs, performance telemetry, security logs, and timestamps of API calls.`,
          ],
        },
        {
          heading: '3.6 Communications and support',
          body: [
            `Emails, in-app tickets, SMS or WhatsApp content where you message official ${siteName} lines, call recordings where legally recorded and disclosed, and training or quality monitoring consistent with policy.`,
          ],
        },
        {
          heading: '3.7 Data you give us about others',
          body: [
            `If you provide personal data of employees, consignees, or contacts, you represent that you have a lawful basis to do so and, where required, have informed them of ${siteName}'s role.`,
          ],
        },
      ],
    },
    {
      id: 'sources',
      title: '4. How we collect personal data',
      body: [
        `Directly from you when you register, complete forms, book, pay, chat with support, or upload documents.`,
        `Automatically through cookies, SDKs, and server logs when you use digital properties.`,
        `From Partners and subprocessors involved in fulfilment (e.g. status updates, GPS pings during an active Trip).`,
        `From fraud-prevention, identity, or credit partners where permitted and proportionate.`,
        `From public sources or corporate registries in limited cases (e.g. verifying business name against GSTIN).`,
      ],
    },
    {
      id: 'purposes',
      title: '5. Purposes and legal bases for processing',
      intro: [
        `We process personal data where permitted under applicable Indian law, including the DPDP Act and the Information Technology Act, 2000 and rules thereunder, as well as sector-specific obligations. Depending on context, processing may be based on your consent, performance of a contract, compliance with legal obligations, protection of your or others' vital interests, or legitimate interests that are not overridden by your rights.`,
      ],
      subsections: [
        {
          heading: '5.1 Operating the Platform',
          body: [
            `Creating accounts, authenticating users, displaying pricing, matching Trips with Partners, routing, ETA notifications, issuing invoices and receipts, and customer support.`,
          ],
        },
        {
          heading: '5.2 Payments, risk, and compliance',
          body: [
            `Processing Fees, detecting fraud and abuse, meeting tax and audit obligations, responding to lawful requests from government authorities, and enforcing our Terms.`,
          ],
        },
        {
          heading: '5.3 Safety and integrity',
          body: [
            `Investigating incidents, enforcing bans on prohibited cargo, protecting users and Partners, and securing systems against intrusion or denial-of-service attacks.`,
          ],
        },
        {
          heading: '5.4 Improvement and analytics',
          body: [
            `Understanding feature usage in aggregated or de-identified form, debugging, product development, and training models only where compatible with this Policy and applicable law (we do not sell your personal data).`,
          ],
        },
        {
          heading: '5.5 Marketing',
          body: [
            `Sending promotional communications where permitted—often based on consent or soft opt-in for similar products—with opt-out in each channel where required.`,
          ],
        },
      ],
    },
    {
      id: 'sharing',
      title: '6. Sharing and disclosure',
      intro: [
        `We do not sell your personal data. We disclose personal data only as described below or with your direction or consent where required.`,
      ],
      subsections: [
        {
          heading: '6.1 Driver and fulfilment Partners',
          body: [
            `Trip and contact details necessary to perform pickup and delivery, subject to role-based access and retention limits.`,
          ],
        },
        {
          heading: '6.2 Payment processors and banks',
          body: [
            `Entities such as Razorpay or banking partners receive data needed to authorize, settle, or dispute payments, under their privacy terms and certification regimes.`,
          ],
        },
        {
          heading: '6.3 Cloud, messaging, maps, and tools',
          body: [
            `Vendors providing hosting, email delivery, SMS, WhatsApp Business API (where used), maps, analytics, customer support ticketing, and CRM may process personal data as subprocessors under contract and instruction.`,
          ],
        },
        {
          heading: '6.4 Legal and safety',
          body: [
            `We may disclose data to comply with court orders, investigative demands, or regulatory inquiries, or where we reasonably believe disclosure prevents harm, fraud, or illegal activity.`,
          ],
        },
        {
          heading: '6.5 Business transfers',
          body: [
            `If ${siteName} undergoes a merger, acquisition, or asset sale, personal data may transfer as a business asset subject to commitments comparable to this Policy or notice to you where required.`,
          ],
        },
      ],
    },
    {
      id: 'transfers',
      title: '7. Cross-border processing',
      body: [
        `Primary processing occurs in India. Subprocessors (e.g. cloud regions, global communications APIs) may use facilities outside India where contractually required compatibility with Indian cross-border transfer rules is maintained, including standard contractual clauses, adequacy decisions, or other permitted mechanisms under the DPDP Act and rules as they come into force.`,
        `We assess vendor locations and security commitments during onboarding and periodically thereafter.`,
      ],
    },
    {
      id: 'retention',
      title: '8. Retention',
      subsections: [
        {
          heading: '8.1 General approach',
          body: [
            `We retain personal data only as long as necessary for the purposes above, including statutory, tax, and dispute-resolution timelines.`,
            `Trip and billing records may be kept for multi-year periods consistent with GST, contract, and litigation limitation rules.`,
          ],
        },
        {
          heading: '8.2 Deletion and minimization',
          body: [
            `Where retention is no longer required, we delete or de-identify data subject to backups and archival systems that age out over reasonable cycles.`,
          ],
        },
      ],
    },
    {
      id: 'security',
      title: '9. Security of personal data',
      subsections: [
        {
          heading: '9.1 Safeguards',
          body: [
            `We implement reasonable technical and organizational measures appropriate to the sensitivity and volume of data—we aim in good faith to align with commonly referenced practices including access control (least privilege), encryption in transit for standard web and app channels, segregation of production environments, logging and monitoring, vulnerability management, vendor security reviews, and personnel confidentiality obligations.`,
          ],
        },
        {
          heading: '9.2 Your responsibilities',
          body: [
            `Use strong passwords (or SSO where offered), protect OTPs, log out of shared devices, keep app versions updated, and report suspected compromise to us immediately.`,
          ],
        },
        {
          heading: '9.3 Incidents',
          body: [
            `No system is risk-free. If a breach materially affects your personal data and the law requires notification, we will take steps to notify regulators and affected users as prescribed.`,
          ],
        },
      ],
    },
    {
      id: 'rights',
      title: '10. Your rights and choices',
      subsections: [
        {
          heading: '10.1 Access, correction, and updates',
          body: [
            `You may access and update certain profile fields in-app; for broader requests, contact ${GRIEVANCE_OFFICER_NAME} at ${PRIVACY_EMAIL}.`,
          ],
        },
        {
          heading: '10.2 Withdrawal of consent',
          body: [
            `Where processing is consent-based, you may withdraw consent by using in-product controls or contacting us. Withdrawal does not affect lawfulness of prior processing; some services may cease if processing is essential to deliver them.`,
          ],
        },
        {
          heading: '10.3 Erasure and restriction',
          body: [
            `You may request deletion or restriction where applicable law allows. We may retain minimal records where statute, tax law, or unresolved disputes require.`,
          ],
        },
        {
          heading: '10.4 Grievance redressal (India)',
          body: [
            `If you have concerns about how we process personal data, contact our Grievance Officer, ${GRIEVANCE_OFFICER_NAME}, at ${PRIVACY_EMAIL} with sufficient detail (account phone/email, approximate dates, description of issue).`,
            `We will engage in good faith to resolve complaints within timelines compatible with the DPDP Act and rules as applicable. You may also have rights to escalate to the Data Protection Board of India (or successor body) once operational under law.`,
          ],
        },
        {
          heading: '10.5 Nomination',
          body: [
            `Where the DPDP Act provides for nomination by a user in case of death or incapacity, we will publish or honor procedures consistent with notified rules.`,
          ],
        },
      ],
    },
    {
      id: 'cookies',
      title: '11. Cookies and similar technologies',
      body: [
        `We use cookies, local storage, pixels, SDK identifiers, and similar technologies for authentication, session management, preferences, fraud prevention, and analytics.`,
        `You can control many cookies through browser settings; blocking strictly necessary cookies may degrade login or checkout.`,
        `We may use first-party and third-party analytics with privacy-conscious configuration where feasible.`,
      ],
    },
    {
      id: 'communications',
      title: '12. SMS, WhatsApp, email, and push',
      body: [
        `Operational messages (booking status, OTPs, security alerts, invoice availability) are sent as needed to perform our contract with you and keep accounts safe.`,
        `Marketing or promotional messages are sent where permitted and with controls to opt out except where transactional messages must continue.`,
        `WhatsApp or SMS use follows channel policies, your registration consent where required, and applicable telemarketing norms (including India-specific TRAI frameworks where they apply to commercial communications).`,
      ],
    },
    {
      id: 'children',
      title: '13. Children',
      body: [
        `The Platform is not directed to children under eighteen (18). We do not knowingly collect personal data from minors for contract formation. If you believe we have collected a minor's data improperly, contact us for prompt review and deletion subject to law.`,
      ],
    },
    {
      id: 'automated',
      title: '14. Automated processing',
      body: [
        `We may use rules-based systems or analytics for fraud scoring, surge or dynamic pricing surfaces, partner matching, and safety interventions.`,
        `We do not make solely automated decisions with legal or similarly significant effects without human review where such review is required by applicable law.`,
      ],
    },
    {
      id: 'dpdp-notice',
      title: '15. Fair processing notice',
      body: [
        `${siteName} processes personal data fairly and for specified purposes. Where consent is the basis, we seek clear, informed, opt-in consent where required and allow withdrawal as described above.`,
        `You may request information about significant processors acting on our behalf through ${GRIEVANCE_OFFICER_NAME} at ${PRIVACY_EMAIL}, subject to commercial confidentiality and security.`,
      ],
    },
    {
      id: 'changes',
      title: '16. Changes to this Policy',
      body: [
        `We may update this Policy to reflect legal, technical, or business changes. Material updates will be communicated by reasonable means—email to your registered address, in-app notice, or prominent website posting. Continued use after the effective date may constitute acceptance where law permits; where fresh consent is required, we will obtain it.`,
        `The "Last updated" date at the top of this page will change when we publish revisions.`,
      ],
    },
    {
      id: 'contact',
      title: '17. Contact',
      body: [
        `${GRIEVANCE_OFFICER_DESIGNATION}: ${GRIEVANCE_OFFICER_NAME}. Data protection and personal-data grievance inquiries: ${PRIVACY_EMAIL}.`,
        `Legal notices may also reference addresses on our Contact page or corporate filings.`,
      ],
    },
  ];
}

export const PRIVACY_SECTIONS: PrivacySection[] = buildPrivacySections(SITE_NAME);
