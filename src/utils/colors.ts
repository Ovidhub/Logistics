export type PrimaryColor = 'red' | 'blue' | 'emerald' | 'amber' | 'purple' | 'indigo' | 'pink' | 'orange';

// Pre-defined Tailwind class sets to ensure they get included in the build
export const colorClasses: Record<PrimaryColor, {
  bg: string;
  bgHover: string;
  bgLight: string;
  bgDark: string;
  text: string;
  textHover: string;
  textLight: string;
  border: string;
  borderT: string;
  ring: string;
  topbar: string;
}> = {
  red: {
    bg: 'bg-red-600',
    bgHover: 'hover:bg-red-700',
    bgLight: 'bg-red-50',
    bgDark: 'bg-red-700',
    text: 'text-red-600',
    textHover: 'hover:text-red-600',
    textLight: 'text-red-500',
    border: 'border-red-600',
    borderT: 'border-t-red-600',
    ring: 'focus:ring-red-500',
    topbar: 'bg-red-600',
  },
  blue: {
    bg: 'bg-blue-600',
    bgHover: 'hover:bg-blue-700',
    bgLight: 'bg-blue-50',
    bgDark: 'bg-blue-700',
    text: 'text-blue-600',
    textHover: 'hover:text-blue-600',
    textLight: 'text-blue-500',
    border: 'border-blue-600',
    borderT: 'border-t-blue-600',
    ring: 'focus:ring-blue-500',
    topbar: 'bg-blue-600',
  },
  emerald: {
    bg: 'bg-emerald-600',
    bgHover: 'hover:bg-emerald-700',
    bgLight: 'bg-emerald-50',
    bgDark: 'bg-emerald-700',
    text: 'text-emerald-600',
    textHover: 'hover:text-emerald-600',
    textLight: 'text-emerald-500',
    border: 'border-emerald-600',
    borderT: 'border-t-emerald-600',
    ring: 'focus:ring-emerald-500',
    topbar: 'bg-emerald-600',
  },
  amber: {
    bg: 'bg-amber-600',
    bgHover: 'hover:bg-amber-700',
    bgLight: 'bg-amber-50',
    bgDark: 'bg-amber-700',
    text: 'text-amber-600',
    textHover: 'hover:text-amber-600',
    textLight: 'text-amber-500',
    border: 'border-amber-600',
    borderT: 'border-t-amber-600',
    ring: 'focus:ring-amber-500',
    topbar: 'bg-amber-600',
  },
  purple: {
    bg: 'bg-purple-600',
    bgHover: 'hover:bg-purple-700',
    bgLight: 'bg-purple-50',
    bgDark: 'bg-purple-700',
    text: 'text-purple-600',
    textHover: 'hover:text-purple-600',
    textLight: 'text-purple-500',
    border: 'border-purple-600',
    borderT: 'border-t-purple-600',
    ring: 'focus:ring-purple-500',
    topbar: 'bg-purple-600',
  },
  indigo: {
    bg: 'bg-indigo-600',
    bgHover: 'hover:bg-indigo-700',
    bgLight: 'bg-indigo-50',
    bgDark: 'bg-indigo-700',
    text: 'text-indigo-600',
    textHover: 'hover:text-indigo-600',
    textLight: 'text-indigo-500',
    border: 'border-indigo-600',
    borderT: 'border-t-indigo-600',
    ring: 'focus:ring-indigo-500',
    topbar: 'bg-indigo-600',
  },
  pink: {
    bg: 'bg-pink-600',
    bgHover: 'hover:bg-pink-700',
    bgLight: 'bg-pink-50',
    bgDark: 'bg-pink-700',
    text: 'text-pink-600',
    textHover: 'hover:text-pink-600',
    textLight: 'text-pink-500',
    border: 'border-pink-600',
    borderT: 'border-t-pink-600',
    ring: 'focus:ring-pink-500',
    topbar: 'bg-pink-600',
  },
  orange: {
    bg: 'bg-orange-600',
    bgHover: 'hover:bg-orange-700',
    bgLight: 'bg-orange-50',
    bgDark: 'bg-orange-700',
    text: 'text-orange-600',
    textHover: 'hover:text-orange-600',
    textLight: 'text-orange-500',
    border: 'border-orange-600',
    borderT: 'border-t-orange-600',
    ring: 'focus:ring-orange-500',
    topbar: 'bg-orange-600',
  },
};

export function getColor(color: string) {
  return colorClasses[(color as PrimaryColor) in colorClasses ? (color as PrimaryColor) : 'red'];
}
