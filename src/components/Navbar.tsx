import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Radio, Search, ShieldCheck } from 'lucide-react';
import { TODAY_SESSIONS } from '../data/parliamentData';
import { GlobalSearchModal } from './GlobalSearchModal';

const NAV_ITEMS = [
  { to: '/', label: 'Beranda' },
  { to: '/legislasi', label: 'RUU & UU' },
  { to: '/anggota', label: 'Anggota' },
  { to: '/sidang', label: 'Sidang' },
  { to: '/akd', label: 'Komisi & Badan' },
  { to: '/partisipasi', label: 'Suara Warga' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const liveCount = TODAY_SESSIONS.filter((s) => s.status === 'Berlangsung').length;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchInitialQuery('');
        setSearchOpen((prev) => !prev);
      }
    };
    const onOpenSearch = (e: Event) => {
      const custom = e as CustomEvent<{ query?: string }>;
      setSearchInitialQuery(custom.detail?.query ?? '');
      setSearchOpen(true);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('parlemen:open-search', onOpenSearch);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('parlemen:open-search', onOpenSearch);
    };
  }, []);

  const openBlankSearch = () => {
    setSearchInitialQuery('');
    setSearchOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 overflow-x-clip bg-white/75 backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(20,23,31,0.08)]">
      {/* Top Institutional Utility Bar */}
      <div className="bg-senayan-mesh text-white text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-8 min-w-0">
          <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full">
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#C28E0E]/25 px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase text-[#FDE68A]">
              <ShieldCheck className="h-3 w-3 text-[#FDE68A]" />
              DPR RI • 2024–2029
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="text-white/90 font-medium break-words">
              Masa Persidangan II Tahun Sidang 2026–2027
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 font-mono-num text-[11px] text-white/75">
              Sabtu, 14 Nov 2026 • Senayan
            </span>
            <Link
              to="/sidang?live=active"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-0.5 text-[11px] font-semibold text-emerald-200 hover:bg-emerald-400/25 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="font-mono-num">{liveCount}</span> Sidang Berlangsung
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FAF8F4] to-[#EFECE4] p-1.5 shadow-[0_6px_16px_-4px_rgba(122,24,34,0.22),inset_0_1px_0_rgba(255,255,255,0.9)] group-hover:scale-105 transition-transform">
            <img
              src={`${import.meta.env.BASE_URL}assets/dpr-logo.svg`}
              alt="Lambang DPR RI"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-[#14171F] leading-none">
                Parlemen<span className="text-[#7A1822]">.id</span>
              </span>
              <span className="hidden sm:inline-block rounded-full bg-gradient-to-r from-[#C28E0E]/15 to-[#7A1822]/10 px-2 py-0.5 font-mono-num text-[9px] font-bold uppercase tracking-wider text-[#8C6404]">
                Terbuka
              </span>
            </div>
            <div className="mt-0.5 text-[10px] font-semibold tracking-wider text-[#5A6472] uppercase">
              Portal Terbuka DPR RI
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-stretch gap-1 rounded-2xl bg-[#EFECE4]/70 p-1 shadow-[inset_0_1px_2px_rgba(20,23,31,0.05)]">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `inline-flex items-center whitespace-nowrap px-3.5 py-2 text-[13px] font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'bg-white text-[#7A1822] shadow-[0_4px_12px_-2px_rgba(20,23,31,0.08)]'
                    : 'text-[#333B48] hover:text-[#14171F] hover:bg-white/50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={openBlankSearch}
            aria-label="Cari di seluruh portal (Ctrl+K)"
            className="inline-flex items-center gap-2 rounded-xl bg-[#F4F1EA] px-3 py-2 text-xs font-semibold text-[#14171F] shadow-[inset_0_1px_2px_rgba(20,23,31,0.06)] hover:bg-white hover:shadow-sm transition-all cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 text-[#7A1822]" />
            <span className="hidden xl:inline">Cari Portal</span>
            <kbd className="hidden xl:inline-block rounded bg-white/80 px-1.5 py-0.5 font-mono-num text-[10px] font-bold text-[#5A6472]">
              Ctrl K
            </kbd>
          </button>
          <Link
            to="/sidang?live=active"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-[#8D1D29] to-[#5B1219] px-3.5 py-2 text-xs font-bold text-white shadow-[0_8px_20px_-4px_rgba(122,24,34,0.45)] hover:shadow-[0_10px_24px_-4px_rgba(122,24,34,0.6)] hover:-translate-y-0.5 transition-all"
          >
            <Radio className="h-3.5 w-3.5 text-[#FDE68A] animate-pulse" />
            TV Parlemen
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={openBlankSearch}
            className="rounded-xl bg-[#F4F1EA] p-2.5 text-[#7A1822] hover:bg-[#EFECE4] cursor-pointer"
            aria-label="Cari di seluruh portal"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl bg-[#F4F1EA] p-2.5 text-[#14171F] hover:bg-[#EFECE4] cursor-pointer"
            aria-label="Buka menu navigasi"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl px-4 py-3 space-y-1 shadow-xl">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'bg-gradient-to-r from-[#7A1822] to-[#5B1219] text-white shadow-sm'
                    : 'text-[#333B48] hover:bg-[#F4F1EA]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}

      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        initialQuery={searchInitialQuery}
      />
    </header>
  );
}
