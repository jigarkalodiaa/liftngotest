interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Liftngo',
  url: 'https://yourdomain.com',
  description: 'Book rides in seconds, track in real-time, and get food delivered to your doorstep. Join Liftngo for affordable fares and seamless delivery.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://yourdomain.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Liftngo',
  url: 'https://yourdomain.com',
  logo: 'https://yourdomain.com/logo.png',
  sameAs: [
    'https://twitter.com/yourhandle',
    'https://linkedin.com/company/yourcompany',
    'https://github.com/yourhandle',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-xxx-xxx-xxxx',
    contactType: 'customer service',
  },
};
