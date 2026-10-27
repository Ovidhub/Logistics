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
  siteName: 'Atrans',
  siteNameAccent: 'A',
  logoIcon: 'truck',
  logoImage: '',
  tagline: 'Freight cleared, tracked and delivered',

  // Contact Info
  address: '92 Bowery St New York, NY 10013',
  phone: '+1 (800) 555-0199',
  phoneSecondary: '+1 (212) 555-0123',
  email: 'support@atrans.com',
  emailSales: 'sales@atrans.com',
  emailSupport: 'info@atrans.com',

  // Social Media
  facebook: 'https://facebook.com/atrans',
  twitter: 'https://twitter.com/atrans',
  instagram: 'https://instagram.com/atrans',

  // Business Hours
  hoursWeekday: '9:00 AM - 6:00 PM',
  hoursSaturday: '10:00 AM - 4:00 PM',
  hoursSunday: 'Closed',

  // Hero Section
  heroTitle: 'Freight that lands when we said it would.',
  heroSubtitle:
    'One contract covers collection, clearance, linehaul and final mile. Track every leg from your phone — and get a human on the line the moment something changes.',
  heroCTA: 'Track your freight',

  // About Section
  aboutTitle: 'We answer the phone at 6am and again at 11pm.',
  aboutDescription:
    'Atrans clears and moves commercial freight for importers, exporters and distributors. Our coordinators run dedicated lanes across North America, Europe and West Africa — and every consignment is scanned, insured and visible from pickup to signature.',
  yearsExperience: '12+',

  // Stats
  statClients: '4,800+',
  statCountries: '150+',
  statDeliveries: '320K+',
  statYears: '12+',

  // Footer
  footerAbout:
    'Atrans moves commercial freight by road, ocean and air — customs cleared before arrival, covered in full and tracked scan by scan, with one coordinator accountable for the outcome.',
  copyrightText: 'Atrans Logistics. All rights reserved.',

  // Colors
  primaryColor: 'red',
};
