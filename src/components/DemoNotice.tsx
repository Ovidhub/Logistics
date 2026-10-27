import { Link } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import { useDemoMode } from '../utils/demoBackend';

/**
 * Shown only when the PHP API is not deployed (static preview builds such as
 * Vercel). Explains that the data is local to the browser so nobody mistakes a
 * demo shipment for a real one.
 */
export default function DemoNotice() {
  const demo = useDemoMode();
  if (!demo) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
        <FlaskConical className="w-4 h-4 flex-shrink-0" />
        <span className="font-semibold">Preview build with sample data.</span>
        <span className="text-amber-800">
          Tracking and admin changes stay in this browser.
        </span>
        <Link to="/track" className="font-semibold underline underline-offset-2 hover:text-amber-950">
          Try tracking STX7B9K2M4P1
        </Link>
      </div>
    </div>
  );
}
