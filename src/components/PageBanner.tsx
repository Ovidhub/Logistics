import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { colorClasses, type PrimaryColor } from '../utils/colors';

interface PageBannerProps {
  title: string;
  breadcrumb: string;
  bgImage?: string;
}

export default function PageBanner({
  title,
  breadcrumb,
  bgImage = 'https://images.pexels.com/photos/4170172/pexels-photo-4170172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=1920',
}: PageBannerProps) {
  const { settings } = useSettings();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;

  return (
    <div
      className="bg-cover bg-center py-16 px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.68)), url(${bgImage})`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{title}</h1>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Link to="/" className={`${c.textHover} transition-colors`}>Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className={c.textLight}>{breadcrumb}</span>
        </div>
      </div>
    </div>
  );
}
