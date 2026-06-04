export interface SiteSettings {
  // Branding
  siteName: string;
  siteNameAccent: string; // first letter highlighted
  logoIcon: string; // emoji or icon identifier
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
  tagline: 'Digital & Trusted Transport Logistic Company',

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
  heroTitle: 'Digital & Trusted Transport Logistic Company',
  heroSubtitle:
    'We provide reliable, fast, and secure logistics solutions worldwide. Track your shipments in real-time with our advanced tracking system.',
  heroCTA: 'Track Your Shipment',

  // About Section
  aboutTitle: 'We are proud of our workforce and have worked hard.',
  aboutDescription:
    'Atrans is a leading global logistics provider, delivering integrated freight and supply chain solutions. With over a decade of experience, we ensure your cargo reaches its destination safely and on time.',
  yearsExperience: '12+',

  // Stats
  statClients: '15K+',
  statCountries: '150+',
  statDeliveries: '50K+',
  statYears: '12+',

  // Footer
  footerAbout:
    'Digital & trusted transport logistic company providing reliable shipping solutions worldwide with full tracking capabilities.',
  copyrightText: 'Atrans Logistics. All rights reserved.',

  // Colors
  primaryColor: 'red',
};
