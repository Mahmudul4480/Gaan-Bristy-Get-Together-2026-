import { EVENT_DETAILS, LOGO_URL, TEAM_MEMBERS } from './eventData';

export const SITE_ORIGIN = 'https://gaanbristy.site';
export const SITE_URL = `${SITE_ORIGIN}/`;
export const SITE_NAME = 'Gaan Bristy';
export const SITE_NAME_BN = 'গান বৃষ্টি';
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}${LOGO_URL}`;

export const SEO_TITLE =
  'Gaan Bristy Get Together 2026 | StarMaker Family — গান বৃষ্টি, ঢাকা';
export const SEO_TITLE_SHORT = 'Gaan Bristy Get Together 2026';
export const SEO_DESCRIPTION =
  'Gaan Bristy (গান বৃষ্টি) StarMaker-এর জনপ্রিয় মিউজিক ফ্যামিলি। Agoon Khan Asifur Rahman (Artist Agun), নৃত্যশিল্পী Dolly Iqbal ও Tanna Khanসহ শিল্পী, পেশাজীবী ও গানপ্রেমীদের পরিবার। ১৯ সেপ্টেম্বর ২০২৬, গুলশান ক্লাব, ঢাকায় Grand Get Together।';
export const SEO_KEYWORDS = [
  'Gaan Bristy',
  'গান বৃষ্টি',
  'Gaan Bristy Family',
  'Gaan Bristy Get Together 2026',
  'StarMaker Bangladesh',
  'StarMaker Family',
  'Artist Agun',
  'Agoon Khan Asifur Rahman',
  'Agun StarMaker',
  'Dolly Iqbal',
  'Tanna Khan',
  'Bangla music community',
  'ঢাকা মিউজিক ইভেন্ট',
  'Gulshan Club concert',
  'বাংলা গান',
  'StarMaker ID',
].join(', ');

export const FAMILY_STORY_BN = `গান বৃষ্টি (Gaan Bristy) StarMaker অ্যাপের একটি জনপ্রিয় ফ্যামিলি। এখানে সোশ্যাল মিডিয়ার জনপ্রিয় ব্যক্তিত্ব ও মিউজিক আর্টিস্টরা সদস্য হিসেবে আছেন। উল্লেখযোগ্যদের মধ্যে আছেন শিল্পী আগুন — Agoon Khan Asifur Rahman (StarMaker ID 78003563297), বিশিষ্ট নৃত্যশিল্পী ডলি ইকবাল (Dolly Iqbal) এবং বিশিষ্ট নৃত্যশিল্পী তান্না খান (Tanna Khan, StarMaker ID 62127262968)। এছাড়াও আছেন অনেক পেশাজীবী, ব্যবসায়ী ও চাকরিজীবী ব্যক্তিত্ব, যাঁরা নিজ নিজ ক্ষেত্রে প্রতিষ্ঠিত—কিন্তু তাঁরা প্রচণ্ড গান ভালোবাসেন। তাঁদের নিয়েই এই ফ্যামিলি গঠিত। এরকম কিছু গানপ্রিয় মানুষকে নিয়ে গড়ে উঠেছে আমাদের Gaan Bristy।`;

export const FAMILY_STORY_EN =
  'Gaan Bristy is a popular StarMaker family where social-media personalities and music artists gather. Notable members include Agoon Khan Asifur Rahman (Artist Agun, StarMaker ID 78003563297), distinguished dancers Dolly Iqbal and Tanna Khan (StarMaker ID 62127262968), alongside professionals, entrepreneurs, and music lovers across Bangladesh.';

export const NOTABLE_MEMBERS: Array<{
  name: string;
  nameBengali: string;
  role: string;
  roleBengali: string;
  starMakerId?: string;
  image: string;
  note: string;
}> = [
  {
    name: 'Agoon Khan Asifur Rahman',
    nameBengali: 'শিল্পী আগুন',
    role: 'Real World Star · Music Artist',
    roleBengali: 'বিশিষ্ট সঙ্গীতশিল্পী',
    starMakerId: '78003563297',
    image: 'https://i.postimg.cc/j2fDC9t1/583339215-25299362949675364-1080041592358759651-n.jpg',
    note: 'বাংলাদেশের পরিচিত মিউজিক আর্টিস্ট; Gaan Bristy ফ্যামিলির উল্লেখযোগ্য সদস্য।',
  },
  {
    name: 'Dolly Iqbal',
    nameBengali: 'ডলি ইকবাল',
    role: 'Real World Star · Dance Artist',
    roleBengali: 'বিশিষ্ট নৃত্যশিল্পী · কো-ক্যাপ্টেন',
    starMakerId: '62011290458',
    image: 'https://i.postimg.cc/VLq2NvYh/Enhancing-and-combining-photos-f-202608081311.jpg',
    note: 'বিশিষ্ট নৃত্যশিল্পী এবং Gaan Bristy Family-র কো-ক্যাপ্টেন।',
  },
  {
    name: 'Tanna Khan',
    nameBengali: 'তান্না খান',
    role: 'Real World Star · Dance Artist',
    roleBengali: 'বিশিষ্ট নৃত্যশিল্পী',
    starMakerId: '62127262968',
    image: 'https://i.postimg.cc/V6CfFCpt/Whats-App-Image-2026-09-05-at-18-42-49.jpg',
    note: 'বিশিষ্ট নৃত্যশিল্পী এবং Gaan Bristy ফ্যামিলির উল্লেখযোগ্য সদস্য।',
  },
];

export function getAbsoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized}`;
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: [SITE_NAME_BN, 'Gaan Bristy Family', 'GB Family'],
    url: SITE_URL,
    inLanguage: ['bn-BD', 'en'],
    description: SEO_DESCRIPTION,
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'MusicGroup', 'PerformingGroup'],
    '@id': `${SITE_ORIGIN}/#organization`,
    name: 'Gaan Bristy Family',
    alternateName: [SITE_NAME, SITE_NAME_BN, 'GB Family'],
    url: SITE_URL,
    logo: DEFAULT_OG_IMAGE,
    image: DEFAULT_OG_IMAGE,
    description: FAMILY_STORY_EN,
    foundingLocation: {
      '@type': 'Place',
      name: 'Dhaka, Bangladesh',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Bangladesh',
    },
    genre: ['Bengali Music', 'StarMaker Live', 'Community Concert'],
    knowsAbout: [
      'StarMaker',
      'Bengali music',
      'Community concert',
      'Gaan Bristy Get Together',
    ],
    member: NOTABLE_MEMBERS.map((member) => ({
      '@type': 'Person',
      name: member.name,
      alternateName: member.nameBengali,
      jobTitle: member.role,
      image: member.image,
      description: member.note,
      ...(member.starMakerId
        ? {
            identifier: {
              '@type': 'PropertyValue',
              name: 'StarMaker ID',
              value: member.starMakerId,
            },
          }
        : {}),
    })),
    employee: TEAM_MEMBERS.filter((member) => member.role === 'Captain' || member.role === 'Co-Captain').map(
      (member) => ({
        '@type': 'Person',
        name: member.name,
        jobTitle: member.role,
        ...(member.starMakerId
          ? {
              identifier: {
                '@type': 'PropertyValue',
                name: 'StarMaker ID',
                value: member.starMakerId,
              },
            }
          : {}),
      })
    ),
  };
}

export function buildEventJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    '@id': `${SITE_ORIGIN}/#event-2026`,
    name: EVENT_DETAILS.fullTitle,
    alternateName: ['Gaan Bristy Grand Get Together 2026', 'গান বৃষ্টি গেট টুগেদার ২০২৬'],
    description: SEO_DESCRIPTION,
    startDate: `${EVENT_DETAILS.dateISO}+06:00`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: SITE_URL,
    image: [DEFAULT_OG_IMAGE],
    inLanguage: 'bn-BD',
    isAccessibleForFree: false,
    organizer: {
      '@id': `${SITE_ORIGIN}/#organization`,
    },
    performer: {
      '@id': `${SITE_ORIGIN}/#organization`,
    },
    location: {
      '@type': 'Place',
      name: EVENT_DETAILS.venueNameEnglish,
      alternateName: EVENT_DETAILS.venueNameBengali,
      address: {
        '@type': 'PostalAddress',
        streetAddress: EVENT_DETAILS.venueAddress,
        addressLocality: 'Gulshan',
        addressRegion: 'Dhaka',
        postalCode: '1212',
        addressCountry: 'BD',
      },
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}#details`,
      price: EVENT_DETAILS.feeAdult,
      priceCurrency: 'BDT',
      availability: 'https://schema.org/LimitedAvailability',
      validFrom: '2026-08-01',
      validThrough: EVENT_DETAILS.registrationDeadlineISO,
    },
  };
}

export function buildBreadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'About Gaan Bristy', item: `${SITE_URL}#about` },
      { '@type': 'ListItem', position: 3, name: 'Family Team', item: `${SITE_URL}#team` },
      { '@type': 'ListItem', position: 4, name: 'Get Together 2026', item: `${SITE_URL}#details` },
    ],
  };
}
