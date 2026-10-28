import { useLocation } from 'react-router-dom';
import { MapPin, Clock, Phone, Navigation, ArrowUpRight } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { colorClasses, type PrimaryColor } from '../utils/colors';

/**
 * Closing section of the public site: a full-width Google Map with the head
 * office details overlaid. Hidden on the admin portals, where a map is noise.
 */
export default function MapSection() {
  const { settings } = useSettings();
  const { pathname } = useLocation();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;

  if (pathname.startsWith('/admin') || pathname.startsWith('/super-admin')) return null;

  const address = settings.address || 'London, UK';
  const query = encodeURIComponent(address);
  const embedSrc = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const telHref = `tel:${settings.phone.replace(/[^+\d]/g, '')}`;

  return (
    <section className="bg-slate-900 pt-0">
      <div className="relative">
        <iframe
          title={`${settings.siteName} head office on Google Maps`}
          src={embedSrc}
          className="w-full h-[380px] sm:h-[460px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-28 sm:-mt-36 pb-12 sm:pb-16">
            <div className={`bg-white rounded shadow-2xl border-t-4 ${c.border} p-6 sm:p-8 max-w-md`}>
              <p className={`${c.text} font-bold text-xs uppercase tracking-wider mb-2`}>Find us</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
                Come see the operation
              </h2>

              <ul className="space-y-3 text-sm mb-6">
                <li className="flex items-start gap-3 text-slate-600">
                  <MapPin className={`w-4 h-4 ${c.text} mt-0.5 flex-shrink-0`} />
                  <span>{address}</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600">
                  <Clock className={`w-4 h-4 ${c.text} mt-0.5 flex-shrink-0`} />
                  <span>
                    Monday – Friday, {settings.hoursWeekday}
                    <br />
                    Saturday, {settings.hoursSaturday}
                  </span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <Phone className={`w-4 h-4 ${c.text} flex-shrink-0`} />
                  <a href={telHref} className={`font-semibold text-slate-800 ${c.textHover} transition-colors`}>
                    {settings.phone}
                  </a>
                </li>
              </ul>

              <div className="flex flex-wrap gap-3">
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 ${c.bg} ${c.bgHover} text-white text-sm font-semibold px-5 py-2.5 rounded transition-colors`}
                >
                  <Navigation className="w-4 h-4" /> Get directions
                </a>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 text-sm font-semibold px-5 py-2.5 rounded transition-colors"
                >
                  Open in Google Maps <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
