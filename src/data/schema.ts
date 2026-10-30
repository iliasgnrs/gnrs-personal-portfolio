/**
 * Site-wide structured data. Kept as plain objects (not JSX) so the exact same
 * graph can be emitted into index.html and referenced by llms.txt.
 */

const SITE = 'https://gnrs.gr';
const PERSON_ID = `${SITE}/#person`;
const SITE_ID = `${SITE}/#website`;
const SERVICE_ID = `${SITE}/#service`;

const expertise = [
  'Headless Architecture',
  'TypeScript & React Engineering',
  'WordPress & WooCommerce Plugins',
  'PHP Backend Engineering',
  'MCP Server Development',
  'Custom AI Agent Skills',
  'eCommerce Systems',
  'PWA & Booking Systems',
];

const notableProjects = [
  { name: 'Theros', url: 'https://therosapp.eu', description: 'Accommodation management SaaS.' },
  { name: 'Buddystat', url: 'https://buddystat.com', description: 'Privacy-first web analytics SaaS.' },
  { name: 'Atractos', url: 'https://atractos.com', description: 'Engineering hub SaaS.' },
  { name: 'Adapedu', url: 'https://adapedu.com', description: 'Education SaaS platform.' },
  { name: 'Menuvi', url: 'https://menuvi.app', description: 'Hospitality menu platform.' },
  { name: 'Agrivate', url: 'https://agrivate.eu', description: 'IoT smart agriculture platform.' },
  { name: 'Scalepath', url: 'https://scalepath.ee', description: 'European technology venture hub.' },
];

export const homeGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Ilias Giannaros',
      alternateName: ['GNRS', 'Ilias GNRS'],
      url: SITE,
      image: `${SITE}/portrait.webp`,
      jobTitle: 'Headless Full-Stack Developer & AI Agent Engineer',
      description:
        'Full-stack developer specializing in headless architectures, WordPress/WooCommerce plugins, React and TypeScript frontends, and MCP server plus AI agent development.',
      email: 'mailto:ilias@gnrs.gr',
      knowsLanguage: ['el-GR', 'en'],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kalamaria',
        addressRegion: 'Thessaloniki',
        addressCountry: 'GR',
      },
      sameAs: ['https://gr.linkedin.com/in/iliasgnrs', 'https://github.com/iliasgnrs'],
      knowsAbout: expertise,
      worksFor: { '@id': SERVICE_ID },
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Full-Stack Developer',
        occupationalCategory: '15-1252.00',
        skills: expertise.join(', '),
      },
    },
    {
      '@type': 'ProfessionalService',
      '@id': SERVICE_ID,
      name: 'GNRS — Ilias Giannaros',
      url: SITE,
      image: `${SITE}/logo.webp`,
      email: 'ilias@gnrs.gr',
      founder: { '@id': PERSON_ID },
      areaServed: [
        { '@type': 'Country', name: 'Greece' },
        { '@type': 'Place', name: 'Europe' },
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kalamaria',
        addressRegion: 'Thessaloniki',
        addressCountry: 'GR',
      },
      knowsAbout: expertise,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Engineering Services',
        itemListElement: [
          'Headless web application development',
          'WordPress & WooCommerce plugin development',
          'React & TypeScript frontend engineering',
          'MCP server and AI agent development',
          'E-commerce systems and PWA booking platforms',
        ].map((name) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name },
        })),
      },
    },
    {
      '@type': 'WebSite',
      '@id': SITE_ID,
      url: SITE,
      name: 'Ilias Giannaros (GNRS) — Portfolio',
      inLanguage: 'en',
      publisher: { '@id': PERSON_ID },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE}/#page`,
      url: SITE,
      name: 'Ilias Giannaros (GNRS) — Headless Full-Stack Developer & AI Agent Engineer',
      isPartOf: { '@id': SITE_ID },
      about: { '@id': PERSON_ID },
      mainEntity: { '@id': PERSON_ID },
      primaryImageOfPage: `${SITE}/og-image.webp`,
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE}/#projects`,
      name: 'Selected projects by Ilias Giannaros',
      url: `${SITE}/#projects`,
      itemListElement: notableProjects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: p.name,
          url: p.url,
          description: p.description,
          applicationCategory: 'BusinessApplication',
          author: { '@id': PERSON_ID },
        },
      })),
    },
  ],
};

export const faqGraph = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is Ilias Giannaros (GNRS)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ilias Giannaros, known online as GNRS, is a full-stack developer based in Kalamaria, Thessaloniki, Greece. He builds headless web architectures, custom WordPress and WooCommerce plugins, React and TypeScript frontends, and MCP servers with AI agent skills.',
      },
    },
    {
      '@type': 'Question',
      name: 'What services does GNRS offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Headless and SaaS web application development, WordPress and WooCommerce plugin engineering, React and TypeScript frontend development, MCP server and AI agent development, and e-commerce or PWA booking systems.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is GNRS based and who does he work with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GNRS is based in Kalamaria, Thessaloniki, Greece, and works with clients across Greece and Europe, including hospitality, agriculture, education, insurance, and e-commerce businesses.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I contact Ilias Giannaros?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'By email at ilias@gnrs.gr or through the contact form at https://gnrs.gr/#contact. He typically responds within 24 hours.',
      },
    },
  ],
};
