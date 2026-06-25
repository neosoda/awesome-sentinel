import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateShort(date: Date | string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const TOOL_TYPE_LABELS: Record<string, string> = {
  self_hosted: 'Self-Hosted',
  saas: 'SaaS',
  cli: 'CLI',
  desktop: 'Desktop',
  mobile: 'Mobile',
  api: 'API',
  library: 'Library',
  browser_extension: 'Extension',
  devtool: 'Dev Tool',
  other: 'Autre',
}

export const TOOL_STATUS_LABELS: Record<string, string> = {
  to_test: 'À tester',
  tested: 'Testé',
  recommended: 'Recommandé',
  abandoned: 'Abandonné',
  watching: 'À surveiller',
}

export const TOOL_TYPE_COLORS: Record<string, string> = {
  self_hosted: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  saas: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  cli: 'bg-green-500/20 text-green-300 border-green-500/30',
  desktop: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  mobile: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  api: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  library: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  browser_extension: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  devtool: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  other: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
}

export const TOOL_STATUS_COLORS: Record<string, string> = {
  to_test: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  tested: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  recommended: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  abandoned: 'bg-red-500/20 text-red-300 border-red-500/30',
  watching: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

export const PUBLIC_TOOL_TYPE_COLORS: Record<string, string> = {
  self_hosted: 'bg-[#E8DEF8] text-[#1D192B] border-transparent',
  saas: 'bg-[#FFD8E4] text-[#31111D] border-transparent',
  cli: 'bg-[#D8E2FF] text-[#001A43] border-transparent',
  desktop: 'bg-[#F9DEDC] text-[#410E0B] border-transparent',
  mobile: 'bg-[#EADDFF] text-[#21005D] border-transparent',
  api: 'bg-[#CCE8E4] text-[#07201E] border-transparent',
  library: 'bg-[#F2E5A7] text-[#211B00] border-transparent',
  browser_extension: 'bg-[#E8DEF8] text-[#1D192B] border-transparent',
  devtool: 'bg-[#D5E8CF] text-[#10200D] border-transparent',
  other: 'bg-[#E6E1E5] text-[#1D1B20] border-transparent',
}

export const PUBLIC_TOOL_STATUS_COLORS: Record<string, string> = {
  to_test: 'bg-[#E6E1E5] text-[#1D1B20] border-transparent',
  tested: 'bg-[#D8E2FF] text-[#001A43] border-transparent',
  recommended: 'bg-[#D5E8CF] text-[#10200D] border-transparent',
  abandoned: 'bg-[#F9DEDC] text-[#410E0B] border-transparent',
  watching: 'bg-[#F2E5A7] text-[#211B00] border-transparent',
}
