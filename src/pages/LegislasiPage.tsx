import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, FileText, ArrowRight, Info, MessageSquarePlus, X, Bookmark, ListChecks } from 'lucide-react';
import { BILLS, LEGISLATIVE_STAGES, type LegislativeStageIndex } from '../data/parliamentData';
import { PROLEGNAS_PRIORITAS } from '../data/referenceData';
import { BillStageStepper } from '../components/BillStageStepper';
import { PageHeader } from '../components/PageHeader';
import { useWatchlist } from '../utils/watchlist';

const CATEGORIES = ['Semua', 'Prolegnas Prioritas 2026', 'Kumulatif Terbuka', 'RUU APBN'] as const;
const PROPOSERS = ['Semua', 'Inisiatif DPR RI', 'Inisiatif Pemerintah', 'Inisiatif DPD RI'] as const;

export function LegislasiPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const initialAkd = searchParams.get('akd') ?? '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<string>('Semua');
  const [proposer, setProposer] = useState<string>('Semua');
  const [stageFilter, setStageFilter] = useState<LegislativeStageIndex | 'all'>('all');
  const [onlyWatched, setOnlyWatched] = useState(false);
  const [showStageGuide, setShowStageGuide] = useState(false);

  const { billIds, isBillWatched, toggleBill } = useWatchlist();

  const filteredBills = useMemo(() => {
    const q = query.trim().toLowerCase();
    const akd = initialAkd.trim().toLowerCase();
    return BILLS.filter((bill) => {
      if (onlyWatched && !billIds.includes(bill.id)) return false;
      if (category !== 'Semua' && bill.category !== category) return false;
      if (proposer !== 'Semua' && bill.proposer !== proposer) return false;
      if (stageFilter !== 'all' && bill.stage !== stageFilter) return false;
      if (akd && !bill.committee.toLowerCase().includes(akd)) return false;
      if (q) {
        const hay = `${bill.title} ${bill.shortTitle} ${bill.committee} ${bill.summary} ${bill.proposer}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [query, category, proposer, stageFilter, initialAkd, onlyWatched, billIds]);

  const filteredProlegnas = useMemo(() => {
    const q = query.trim().toLowerCase();
    const akd = initialAkd.trim().toLowerCase();
    return PROLEGNAS_PRIORITAS.filter((item) => {
      if (item.billId) return false;
      if (proposer !== 'Semua' && !item.proposer.toLowerCase().includes(proposer.replace('Inisiatif ', '').toLowerCase())) {
        return false;
      }
      if (akd && !item.committee.toLowerCase().includes(akd)) return false;
      if (q) {
        const hay = `${item.shortTitle} ${item.title} ${item.committee} ${item.statusSummary} ${item.keywords.join(' ')}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [query, proposer, initialAkd]);

  const clearAllFilters = () => {
    setQuery('');
    setCategory('Semua');
    setProposer('Semua');
    setStageFilter('all');
    setOnlyWatched(false);
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(query || category !== 'Semua' || proposer !== 'Semua' || stageFilter !== 'all' || initialAkd || onlyWatched);

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'RUU & Pembahasan' }]}
        eyebrow="Fungsi Pembuatan Undang-Undang (Legislasi)"
        title="Pantau RUU & Daftar Prioritas"
        description="Lihat perjalanan setiap Rancangan Undang-Undang (RUU) dari masuk daftar prioritas (Prolegnas), penyusunan naskah di Badan Legislasi, pembahasan poin pasal di Komisi, hingga pengesahan di Sidang Paripurna."
        aside={
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setShowStageGuide(!showStageGuide)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/85 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-[#14171F] shadow-[0_8px_20px_-6px_rgba(20,23,31,0.1)] hover:bg-white transition-all cursor-pointer"
            >
              <Info className="h-4 w-4 text-[#7A1822]" />
              {showStageGuide ? 'Tutup Panduan 5 Tahap' : 'Alur 5 Tahap UU'}
            </button>
            <Link
              to="/partisipasi"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#8D1D29] to-[#5B1219] px-4 py-2.5 text-xs font-bold text-white shadow-[0_10px_24px_-6px_rgba(122,24,34,0.45)] hover:shadow-[0_14px_28px_-6px_rgba(122,24,34,0.6)] transition-all"
            >
              <MessageSquarePlus className="h-4 w-4 text-[#FDE68A]" />
              Kirim Masukan RUU
            </Link>
          </div>
        }
      />

      {/* Interactive 5-Stage Explainer Drawer */}
      {showStageGuide && (
        <section className="bg-gradient-to-r from-[#7A1822]/8 via-[#C28E0E]/8 to-[#7A1822]/8 py-7">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-[#7A1822]">
                Alur Proses Bisnis Legislasi DPR RI (UU No. 13/2022 & Tata Tertib DPR RI)
              </h2>
              <span className="text-xs font-medium text-[#5A6472]">Klik salah satu tahap untuk menyaring daftar RUU</span>
            </div>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
              {LEGISLATIVE_STAGES.map((stage) => {
                const active = stageFilter === stage.index;
                return (
                  <button
                    key={stage.index}
                    type="button"
                    onClick={() => setStageFilter(active ? 'all' : stage.index)}
                    className={`text-left rounded-2xl p-4 transition-all cursor-pointer ${
                      active
                        ? 'bg-gradient-to-br from-[#7A1822] to-[#4A0D13] text-white shadow-[0_16px_32px_-8px_rgba(122,24,34,0.45)]'
                        : 'glass-surface hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full font-mono-num text-[11px] font-bold ${
                          active ? 'bg-[#FDE68A] text-[#4A0D13]' : 'bg-[#7A1822] text-white'
                        }`}
                      >
                        {stage.index + 1}
                      </span>
                      <span className={`text-xs font-bold ${active ? 'text-white' : 'text-[#14171F]'}`}>
                        {stage.title}
                      </span>
                    </div>
                    <p className={`mt-2.5 text-xs leading-relaxed ${active ? 'text-white/85' : 'text-[#5A6472]'}`}>
                      {stage.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Search & Filters */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="glass-surface p-6">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <div className="relative lg:col-span-5">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A1822]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari judul RUU, substansi, atau AKD pembahas..."
                className="w-full rounded-xl bg-white/90 py-2.5 pl-10 pr-3 text-sm text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="lg:col-span-3">
              <label className="sr-only" htmlFor="filter-category">Kategori Prolegnas</label>
              <select
                id="filter-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-white/90 px-3.5 py-2.5 text-sm font-medium text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'Semua' ? 'Semua Kategori Prolegnas' : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="sr-only" htmlFor="filter-proposer">Pengusul</label>
              <select
                id="filter-proposer"
                value={proposer}
                onChange={(e) => setProposer(e.target.value)}
                className="w-full rounded-xl bg-white/90 px-3.5 py-2.5 text-sm font-medium text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:outline-none"
              >
                {PROPOSERS.map((p) => (
                  <option key={p} value={p}>
                    {p === 'Semua' ? 'Semua Pengusul' : p}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="sr-only" htmlFor="filter-stage">Tahapan</label>
              <select
                id="filter-stage"
                value={stageFilter}
                onChange={(e) =>
                  setStageFilter(e.target.value === 'all' ? 'all' : (Number(e.target.value) as LegislativeStageIndex))
                }
                className="w-full rounded-xl bg-white/90 px-3.5 py-2.5 text-sm font-medium text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:outline-none"
              >
                <option value="all">Semua Tahap (1–5)</option>
                {LEGISLATIVE_STAGES.map((s) => (
                  <option key={s.index} value={s.index}>
                    Tahap {s.index + 1}: {s.short}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A6472]">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-[#7A1822]" />
              <span>
                Menampilkan <strong className="font-mono-num text-[#14171F]">{filteredBills.length}</strong> RUU terinci +{' '}
                <strong className="font-mono-num text-[#14171F]">{filteredProlegnas.length}</strong> daftar Prolegnas Prioritas
              </span>
              {initialAkd && (
                <span className="rounded-full bg-[#7A1822]/12 px-2.5 py-0.5 font-bold text-[#7A1822]">
                  AKD: {initialAkd}
                </span>
              )}
              {billIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setOnlyWatched((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-bold transition-all cursor-pointer ${
                    onlyWatched
                      ? 'bg-[#7A1822] text-white'
                      : 'bg-white/90 text-[#14171F] hover:text-[#7A1822]'
                  }`}
                >
                  <Bookmark className={`h-3 w-3 ${onlyWatched ? 'fill-current' : ''}`} />
                  Dipantau ({billIds.length})
                </button>
              )}
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 font-bold text-[#7A1822] hover:underline cursor-pointer"
              >
                <X className="h-3.5 w-3.5" /> Reset semua filter
              </button>
            )}
          </div>
        </div>

        {/* Bill Cards List */}
        {filteredBills.length === 0 ? (
          filteredProlegnas.length > 0 && !onlyWatched ? (
            <div className="mt-8 glass-surface p-6 text-center text-xs sm:text-sm text-[#5A6472]">
              Pencarian cocok dengan <strong className="text-[#14171F]">{filteredProlegnas.length}</strong> RUU pada daftar <strong className="text-[#7A1822]">Prolegnas Prioritas</strong> di bawah.
            </div>
          ) : (
            <div className="mt-8 elevated-surface p-12 text-center">
              <FileText className="mx-auto h-9 w-9 text-[#5A6472]" />
              <h3 className="mt-3 font-editorial text-xl font-bold text-[#14171F]">Tidak ada RUU yang sesuai filter</h3>
              <p className="mt-1 text-sm text-[#5A6472]">
                Coba ubah kata kunci pencarian atau reset filter tahapan/pengusul.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-5 rounded-xl bg-gradient-to-r from-[#8D1D29] to-[#5B1219] px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                Tampilkan Semua RUU
              </button>
            </div>
          )
        ) : (
          <div className="mt-9 space-y-7">
            {filteredBills.map((bill) => {
              const dimPct = bill.dimProgress
                ? Math.round((bill.dimProgress.agreed / bill.dimProgress.total) * 100)
                : null;

              return (
                <article
                  key={bill.id}
                  className="elevated-surface-interactive p-7 sm:p-9"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-bold text-[#7A1822]">
                        {bill.category} • {bill.proposer}
                      </span>
                      <span
                        className={`rounded-full px-3 py-0.5 font-bold ${
                          bill.stageStatus === 'Terbuka Masukan Publik'
                            ? 'bg-emerald-500/15 text-emerald-800'
                            : bill.stageStatus === 'Disetujui Paripurna' || bill.stageStatus === 'Diundangkan'
                              ? 'bg-[#0F5132]/15 text-[#0F5132]'
                              : 'bg-amber-500/15 text-amber-800'
                        }`}
                      >
                        {bill.stageStatus}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono-num text-[#5A6472]">
                        Pembaruan: <strong className="text-[#14171F]">{bill.lastUpdated}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleBill(bill.id)}
                        aria-pressed={isBillWatched(bill.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                          isBillWatched(bill.id)
                            ? 'bg-[#7A1822] text-white shadow-2xs'
                            : 'bg-[#F4F1EA] text-[#14171F] hover:bg-[#7A1822]/10 hover:text-[#7A1822]'
                        }`}
                      >
                        <Bookmark className={`h-3 w-3 ${isBillWatched(bill.id) ? 'fill-current' : ''}`} />
                        {isBillWatched(bill.id) ? 'Dipantau' : 'Pantau'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <Link
                        to={`/legislasi/${bill.id}`}
                        className="font-editorial text-2xl sm:text-3xl font-bold text-[#14171F] hover:text-[#7A1822] transition-colors leading-snug"
                      >
                        {bill.title}
                      </Link>
                      <p className="mt-3 text-sm text-[#5A6472] leading-[1.75]">{bill.summary}</p>
                    </div>

                    <div className="shrink-0 border-l-2 border-[#7A1822]/20 pl-5 text-xs lg:w-64">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A6472]">Komisi / Badan Pembahas</div>
                      <div className="mt-1 text-sm font-bold text-[#14171F]">{bill.committee}</div>
                      {bill.dimProgress && dimPct !== null && (
                        <div className="mt-4">
                          <div className="flex justify-between font-mono-num text-[11px]">
                            <span className="text-[#5A6472]">Poin Pasal (DIM)</span>
                            <span className="font-bold text-[#0F5132]">
                              {bill.dimProgress.agreed}/{bill.dimProgress.total} ({dimPct}%)
                            </span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E5E0D5]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#0F5132] to-[#198754]"
                              style={{ width: `${dimPct}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <BillStageStepper currentStage={bill.stage} />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-[#5A6472]">
                      Posisi saat ini:{' '}
                      <strong className="text-[#7A1822]">{LEGISLATIVE_STAGES[bill.stage].title}</strong>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      {bill.stageStatus === 'Terbuka Masukan Publik' && (
                        <Link
                          to={`/partisipasi?ruu=${bill.id}`}
                          className="text-xs font-bold text-[#0F5132] hover:underline"
                        >
                          Kirim Masukan Publik →
                        </Link>
                      )}
                      <Link
                        to={`/legislasi/${bill.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#8D1D29] to-[#5B1219] px-4 py-2 text-xs font-bold text-white shadow-[0_8px_20px_-6px_rgba(122,24,34,0.45)] hover:shadow-[0_12px_24px_-6px_rgba(122,24,34,0.6)] transition-all"
                      >
                        Lihat Detail & Poin Perubahan <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Expanded Real Prolegnas Prioritas Dataset */}
        {!onlyWatched && filteredProlegnas.length > 0 && (
          <div className="mt-14 deferred-section">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7A1822]">
                  <ListChecks className="h-4 w-4" />
                  Basis Data Prolegnas Prioritas DPR RI
                </div>
                <h2 className="mt-1.5 font-editorial text-2xl sm:text-3xl font-bold text-[#14171F]">
                  RUU Prioritas Lainnya dalam Agenda Pembahasan
                </h2>
              </div>
              <span className="font-mono-num text-xs font-semibold text-[#5A6472]">
                {filteredProlegnas.length} RUU terindeks
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {filteredProlegnas.map((item) => (
                <div key={item.id} className="glass-surface p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="font-bold text-[#7A1822]">{item.committee}</span>
                      <span className="rounded-full bg-[#EFECE4] px-2.5 py-0.5 font-semibold text-[#5A6472]">
                        {item.statusSummary}
                      </span>
                    </div>
                    <h3 className="mt-2 font-editorial text-xl font-bold text-[#14171F] leading-snug">
                      {item.shortTitle}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#5A6472] leading-relaxed">{item.title}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#14171F]/8 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[#5A6472] font-medium">{item.proposer}</span>
                    <Link
                      to={`/akd?q=${encodeURIComponent(item.committee.split('&')[0].trim())}`}
                      className="inline-flex items-center gap-1 font-bold text-[#7A1822] hover:underline"
                    >
                      Lihat AKD Pembahas <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
