export interface SiteSettings {
  // Branding
  siteName: string;
  siteNameAccent: string; // first letter highlighted
  logoIcon: string; // emoji or icon identifier
  logoImage: string; // optional uploaded logo as a data URL; replaces the icon when set
  tagline: string;

  // Contact Info
  address: string;
  phone: string;
  phoneSecondary: string;
  email: string;
  emailSales: string;
  emailSupport: string;

  // Social Media
  facebook: string;
  twitter: string;
  instagram: string;

  // Business Hours
  hoursWeekday: string;
  hoursSaturday: string;
  hoursSunday: string;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroCTA: string;

  // About Section
  aboutTitle: string;
  aboutDescription: string;
  yearsExperience: string;

  // Stats
  statClients: string;
  statCountries: string;
  statDeliveries: string;
  statYears: string;

  // Footer
  footerAbout: string;
  copyrightText: string;

  // Colors
  primaryColor: string; // tailwind color: 'red' | 'blue' | 'emerald' | 'amber' | 'purple' | 'indigo'
}

export const DEFAULT_SETTINGS: SiteSettings = {
  // Branding
  siteName: 'Posalfast',
  siteNameAccent: 'P',
  logoIcon: 'truck',
  logoImage: '',
  tagline: 'Freight cleared, tracked and delivered',

  // Contact Info
  address: '12 Fenchurch Avenue, London EC3M 5AD',
  phone: '+44 20 7946 0199',
  phoneSecondary: '+44 7700 900123',
  email: 'hello@posalfast.com',
  emailSales: 'sales@posalfast.com',
  emailSupport: 'support@posalfast.com',

  // Social Media
  facebook: 'https://facebook.com/posalfast',
  twitter: 'https://twitter.com/posalfast',
  instagram: 'https://instagram.com/posalfast',

  // Business Hours
  hoursWeekday: '08:00 - 18:00',
  hoursSaturday: '09:00 - 13:00',
  hoursSunday: 'Closed',

  // Hero Section
  heroTitle: 'Freight that lands when we said it would.',
  heroSubtitle:
    'One contract covers collection at your supplier, HMRC clearance and delivery to your door. CDS entries are filed before the vessel berths at Felixstowe, Southampton or London Gateway — and a coordinator in London answers their own phone when something changes.',
  heroCTA: 'Track your freight',

  // About Section
  aboutTitle: 'We answer the phone at 8am and again at 8pm.',
  aboutDescription:
    'Posalfast is a UK freight forwarder clearing and moving commercial freight for importers, exporters and distributors. Our coordinators run dedicated lanes between the UK, Europe and North America — filing CDS entries at Felixstowe, Southampton and Heathrow, and keeping every consignment scanned, insured and visible from collection to signature.',
  yearsExperience: '13+',

  // Stats
  statClients: '2,400+',
  statCountries: '150+',
  statDeliveries: '320K+',
  statYears: '13+',

  // Footer
  footerAbout:
    'Posalfast Logistics Ltd moves commercial freight by road, ocean and air from our London head office — UK customs cleared before arrival, covered in full and tracked scan by scan, with one coordinator accountable for the outcome.',
  copyrightText: 'Posalfast Logistics Ltd. All rights reserved.',

  // Colors
  primaryColor: 'red',
};
