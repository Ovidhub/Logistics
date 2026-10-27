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
  tagline: 'Freight forwarding without the guesswork',

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
  heroTitle: 'Your freight, moving. Your customers, informed.',
  heroSubtitle:
    'Road, air and ocean freight with customs handled, cargo insured and live tracking on every load. One team stays accountable from pickup to proof of delivery.',
  heroCTA: 'Track a shipment',

  // About Section
  aboutTitle: 'Logistics built on answers, not excuses.',
  aboutDescription:
    'Atrans has moved freight for growing businesses for over a decade. We pair dependable capacity with a tracking platform that tells you where your cargo is, who has it and when it lands — before you have to ask.',
  yearsExperience: '12+',

  // Stats
  statClients: '4,800+',
  statCountries: '150+',
  statDeliveries: '320K+',
  statYears: '12+',

  // Footer
  footerAbout:
    'Atrans moves freight by road, air and ocean — customs cleared, fully insured and tracked door to door, with one accountable team behind every shipment.',
  copyrightText: 'Atrans Logistics. All rights reserved.',

  // Colors
  primaryColor: 'red',
};
