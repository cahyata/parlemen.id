import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Building2, Search, Users, ArrowRight, X } from 'lucide-react';
import { AKD_LIST, BILLS } from '../data/parliamentData';
import { PageHeader } from '../components/PageHeader';

export function AkdPage() {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState<'Semua' | 'Komisi' | 'Badan'>('Semua');
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setQuery(q);
      setCategory('Semua');
    }
  }, [searchParams]);

  const filteredAkds = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AKD_LIST.filter((akd) => {
      if (category !== 'Semua' && akd.category !== category) return false;
      if (q) {
        const hay = `${akd.code} ${akd.name} ${akd.scope} ${akd.chair} ${akd.partners.join(' ')}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [category, query]);

  const komisiCount = AKD_LIST.filter((a) => a.category === 'Komisi').length;
  const badanCount = AKD_LIST.filter((a) => a.category === 'Badan').length;

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Komisi & Badan DPR' }]}
        eyebrow="Unit Kerja Resmi DPR RI (AKD • 2024–2029)"
        title="Komisi I–XIII & Badan-Badan DPR RI"
        description="Alat Kelengkapan Dewan (AKD) adalah unit kerja di DPR RI. Terdapat 13 Komisi yang mengawasi bidang kementerian/lembaga tertentu, serta 7 Badan yang menangani legislasi, anggaran, hingga aspirasi masyarakat."
        aside={
          <div className="flex gap-3 text-center">
            <div className="glass-surface px-5 py-3">
              <div className="font-mono-num text-2xl font-bold text-[#7A1822]">{komisiCount}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A6472]">Komisi</div>
            </div>
            <div className="glass-surface px-5 py-3">
              <div className="font-mono-num text-2xl font-bold text-[#14171F]">{badanCount}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A6472]">Badan</div>
            </div>
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        {/* Search & Category Tabs */}
        <div className="glass-surface p-5 sm:p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {(['Semua', 'Komisi', 'Badan'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setCategory(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  category === tab
                    ? 'bg-gradient-to-r from-[#8D1D29] to-[#5B1219] text-white shadow-md'
                    : 'bg-white/85 text-[#14171F] hover:bg-white'
                }`}
              >
                {tab === 'Semua'
                  ? `Semua AKD (${AKD_LIST.length})`
                  : tab === 'Komisi'
                    ? `Komisi I–XIII (${komisiCount})`
                    : `Badan DPR (${badanCount})`}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A1822]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari komisi, bidang, atau mitra kerja (mis. Kemenkes, OJK, KPK)..."
              className="w-full rounded-xl bg-white/95 py-2.5 pl-10 pr-8 text-sm text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5A6472] hover:text-[#14171F] cursor-pointer"
                aria-label="Hapus pencarian"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* AKD Grid */}
        <div className="mt-9 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {filteredAkds.map((akd) => {
            const relatedBills = BILLS.filter((b) =>
              b.committee.toLowerCase().includes(akd.code.toLowerCase()),
            );

            return (
              <article
                key={akd.id}
                className="elevated-surface-interactive p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-xl bg-gradient-to-r from-[#8D1D29] to-[#5B1219] px-3 py-1 text-xs font-bold text-white shadow-sm">
                      {akd.code}
                    </span>
                    <span className="text-xs font-semibold text-[#5A6472]">
                      {akd.category}
                    </span>
                  </div>

                  <h2 className="mt-4 font-editorial text-xl sm:text-2xl font-bold text-[#14171F] leading-snug">
                    {akd.name}
                  </h2>

                  <p className="mt-2.5 text-sm text-[#5A6472] leading-[1.7]">{akd.scope}</p>

                  <div className="mt-5 flex items-center gap-2 text-xs">
                    <Users className="h-3.5 w-3.5 shrink-0 text-[#7A1822]" />
                    <span className="text-[#5A6472]">Ketua:</span>
                    <strong className="text-[#14171F] truncate">{akd.chair}</strong>
                    <span className="ml-auto shrink-0 font-bold text-[#7A1822]">
                      {akd.chairFaction}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#14171F]/6">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6472]">
                      <Building2 className="h-3.5 w-3.5 text-[#7A1822]" />
                      Mitra Kerja
                    </div>
                    <p className="mt-2 text-xs text-[#333B48] leading-relaxed">
                      {akd.partners.join(' • ')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-3 flex items-center justify-between text-xs">
                  <span className="font-mono-num text-[#5A6472]">
                    {relatedBills.length > 0
                      ? `${relatedBills.length} RUU aktif`
                      : 'Pengawasan & Raker'}
                  </span>
                  <Link
                    to={relatedBills.length > 0 ? `/legislasi?akd=${encodeURIComponent(akd.code)}` : '/sidang'}
                    className="inline-flex items-center gap-1 font-bold text-[#7A1822] hover:underline"
                  >
                    {relatedBills.length > 0 ? 'Lihat RUU' : 'Jadwal Rapat'} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
