import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Landmark,
  MapPin,
  Search,
  Send,
  Users,
  Vote,
  X,
} from 'lucide-react';
import {
  DAPIL_LIST,
  FRAKSI_LIST,
  MEMBERS_580,
  findMatchingDapils,
} from '../data/referenceData';
import { PageHeader } from '../components/PageHeader';
import { useWatchlist } from '../utils/watchlist';

const QUICK_REGIONS = ['Bandung', 'Jakarta', 'Surabaya', 'Medan', 'Bali', 'Makassar', 'Yogyakarta', 'Solo'];
const PAGE_SIZE = 24;

function getInitials(name: string) {
  const clean = name.replace(/^(Dr\.|Drs\.|Dra\.|Ir\.|H\.|Hj\.|dr\.|KH\.|K\.H\.|Prof\.|Tgk\.|Ni Luh|R\.A\.|R\.)\s+/gi, '');
  const parts = clean.split(' ').filter(Boolean);
  return ((parts[0]?.[0] ?? 'A') + (parts[1]?.[0] ?? 'D')).toUpperCase();
}

export function AnggotaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDapil = searchParams.get('dapil') ?? '';
  const initialFraksi = searchParams.get('fraksi') ?? 'Semua';

  const [query, setQuery] = useState(initialDapil);
  const [selectedFaction, setSelectedFaction] = useState(initialFraksi || 'Semua');
  const [selectedKomisi, setSelectedKomisi] = useState('Semua');
  const [onlyWatched, setOnlyWatched] = useState(false);
  const [page, setPage] = useState(1);

  const { memberIds, isMemberWatched, toggleMember } = useWatchlist();

  const factions = useMemo(
    () => ['Semua', ...FRAKSI_LIST.map((f) => f.shortName)],
    [],
  );

  const komisiOptions = useMemo(() => {
    const romanMap = new Map<string, number>([
      ['Komisi I', 1],
      ['Komisi II', 2],
      ['Komisi III', 3],
      ['Komisi IV', 4],
      ['Komisi V', 5],
      ['Komisi VI', 6],
      ['Komisi VII', 7],
      ['Komisi VIII', 8],
      ['Komisi IX', 9],
      ['Komisi X', 10],
      ['Komisi XI', 11],
      ['Komisi XII', 12],
      ['Komisi XIII', 13],
    ]);
    const unique = Array.from(
      new Set(MEMBERS_580.map((m) => m.komisi).filter((k): k is string => Boolean(k))),
    ).sort((a, b) => (romanMap.get(a) ?? 99) - (romanMap.get(b) ?? 99));
    return ['Semua', ...unique];
  }, []);

  const matchingDapils = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    return findMatchingDapils(q);
  }, [query]);

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchedDapilNames = new Set(matchingDapils.map((d) => d.name.toLowerCase()));
    return MEMBERS_580.filter((m) => {
      if (onlyWatched && !memberIds.includes(m.id)) return false;
      if (selectedFaction !== 'Semua' && m.factionShort !== selectedFaction) return false;
      if (selectedKomisi !== 'Semua' && m.komisi !== selectedKomisi) return false;
      if (q) {
        const hay = `${m.name} ${m.dapil} ${m.faction} ${m.factionShort} ${m.komisi ?? ''} ${m.note ?? ''} #${m.seatNo}`.toLowerCase();
        const inMatchedDapil = matchedDapilNames.has(m.dapil.toLowerCase());
        return hay.includes(q) || inMatchedDapil;
      }
      return true;
    });
  }, [query, selectedFaction, selectedKomisi, onlyWatched, memberIds, matchingDapils]);

  useEffect(() => {
    setPage(1);
  }, [query, selectedFaction, selectedKomisi, onlyWatched]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedMembers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredMembers.slice(start, start + PAGE_SIZE);
  }, [filteredMembers, currentPage]);

  const resetFilters = () => {
    setQuery('');
    setSelectedFaction('Semua');
    setSelectedKomisi('Semua');
    setOnlyWatched(false);
    setPage(1);
    setSearchParams({});
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Anggota & Dapil' }]}
        eyebrow={`Sistem Perwakilan (${DAPIL_LIST.length} Dapil Nasional)`}
        title="Cari Wakil Rakyat & Daerah Pemilihan"
        description={`Telusuri seluruh ${MEMBERS_580.length} Anggota DPR RI periode 2024-2029 berdasarkan nama, kota/kabupaten, daerah pemilihan (84 Dapil resmi), 8 fraksi, atau penugasan komisi.`}
        aside={
          <div className="glass-surface p-4 flex items-center gap-4">
            <img
              src={`${import.meta.env.BASE_URL}assets/dpr-seats-2024-2029.svg`}
              alt="Diagram Komposisi 580 Kursi DPR RI 2024-2029"
              className="h-20 w-auto object-contain"
            />
            <div className="text-left">
              <div className="font-mono-num text-xl font-bold text-[#7A1822]">{MEMBERS_580.length} Kursi</div>
              <div className="text-[11px] font-bold text-[#14171F]">{FRAKSI_LIST.length} Fraksi • {DAPIL_LIST.length} Dapil</div>
              <div className="text-[10px] text-[#5A6472]">Periode 2024-2029</div>
            </div>
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        {/* Frosted Glass Dapil Finder Box */}
        <div className="glass-surface p-6 sm:p-7">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <label htmlFor="dapil-search" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7A1822]">
                <MapPin className="h-4 w-4" />
                Cari Nama Anggota, Kota/Kabupaten, atau Dapil
              </label>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A1822]" />
                <input
                  id="dapil-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Contoh: Bandung, Jember, Sorong, Puan Maharani, atau Komisi III..."
                  className="w-full rounded-xl bg-white/95 py-2.5 pl-10 pr-3 text-sm text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:outline-none"
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <label htmlFor="faction-filter" className="block text-xs font-bold uppercase tracking-wider text-[#5A6472]">
                Fraksi DPR RI
              </label>
              <select
                id="faction-filter"
                value={selectedFaction}
                onChange={(e) => setSelectedFaction(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white/95 px-3.5 py-2.5 text-sm font-medium text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:outline-none"
              >
                {factions.map((f) => (
                  <option key={f} value={f}>
                    {f === 'Semua' ? 'Semua 8 Fraksi (580 Kursi)' : `Fraksi ${f}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-3">
              <label htmlFor="akd-filter" className="block text-xs font-bold uppercase tracking-wider text-[#5A6472]">
                Komisi DPR RI
              </label>
              <select
                id="akd-filter"
                value={selectedKomisi}
                onChange={(e) => setSelectedKomisi(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white/95 px-3.5 py-2.5 text-sm font-medium text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:outline-none"
              >
                {komisiOptions.map((k) => (
                  <option key={k} value={k}>
                    {k === 'Semua' ? 'Semua Komisi (I - XIII)' : k}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 8 Fraksi Interactive Seat Pills */}
          <div className="mt-5 pt-4 border-t border-[#14171F]/6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A6472] mb-2">
              Komposisi 8 Fraksi DPR RI (580 Kursi):
            </div>
            <div className="flex flex-wrap gap-2">
              {FRAKSI_LIST.map((f) => {
                const active = selectedFaction === f.shortName;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFaction(active ? 'Semua' : f.shortName)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#14171F] text-white shadow-sm'
                        : 'bg-white/85 text-[#14171F] shadow-2xs hover:bg-white'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
                    <span>{f.shortName}</span>
                    <span className={`font-mono-num text-[11px] ${active ? 'text-[#FDE68A]' : 'text-[#5A6472]'}`}>
                      {f.seats}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-bold text-[#5A6472] mr-1">Wilayah cepat:</span>
              {QUICK_REGIONS.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setQuery(region)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    query.toLowerCase() === region.toLowerCase()
                      ? 'bg-[#7A1822] text-white shadow-sm'
                      : 'bg-white/85 text-[#14171F] shadow-2xs hover:bg-white'
                  }`}
                >
                  {region}
                </button>
              ))}
              {memberIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setOnlyWatched((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    onlyWatched
                      ? 'bg-[#7A1822] text-white shadow-sm'
                      : 'bg-white/90 text-[#7A1822] shadow-2xs hover:bg-white'
                  }`}
                >
                  <Bookmark className={`h-3 w-3 ${onlyWatched ? 'fill-current' : ''}`} />
                  Dipantau ({memberIds.length})
                </button>
              )}
            </div>

            {(query || selectedFaction !== 'Semua' || selectedKomisi !== 'Semua' || onlyWatched) && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#7A1822] hover:underline cursor-pointer"
              >
                <X className="h-3.5 w-3.5" /> Reset pencarian
              </button>
            )}
          </div>
        </div>

        {/* Matched Dapil Info from 84 Dapil Dataset */}
        {matchingDapils.length > 0 && (
          <div className="mt-7 glass-surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7A1822]">
                <MapPin className="h-4 w-4" />
                Info Daerah Pemilihan Resmi ({matchingDapils.length} Dapil Cocok)
              </div>
              <span className="text-[11px] font-medium text-[#5A6472]">
                Data PKPU No. 6/2023 (Total {DAPIL_LIST.length} Dapil)
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {matchingDapils.slice(0, 4).map((d) => (
                <div key={d.id} className="rounded-2xl bg-white/90 p-5 shadow-2xs flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-editorial text-lg font-bold text-[#14171F]">
                        Dapil {d.name}
                      </h3>
                      <span className="rounded-full bg-[#7A1822]/12 px-2.5 py-0.5 font-mono-num text-xs font-bold text-[#7A1822]">
                        {d.seats} Kursi
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] font-semibold text-[#5A6472]">
                      Provinsi {d.province} • Wilayah {d.islandGroup}
                    </div>
                    <p className="mt-2 text-xs text-[#5A6472] leading-relaxed">
                      <strong className="text-[#14171F]">Cakupan:</strong> {d.regions.join(', ')}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#14171F]/6 flex justify-end">
                    <Link
                      to={`/partisipasi?dapil=${encodeURIComponent(d.name)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A1822] hover:underline"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Kirim Aspirasi Dapil {d.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A6472]">
          <span>
            Menampilkan{' '}
            <strong className="font-mono-num text-[#14171F]">
              {filteredMembers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
              {'-'}
              {Math.min(currentPage * PAGE_SIZE, filteredMembers.length)}
            </strong>{' '}
            dari <strong className="font-mono-num text-[#14171F]">{filteredMembers.length}</strong> anggota DPR RI 2024-2029
          </span>
          {totalPages > 1 && (
            <span className="font-mono-num">
              Halaman {currentPage} / {totalPages}
            </span>
          )}
        </div>

        {filteredMembers.length === 0 ? (
          <div className="mt-6 elevated-surface p-12 text-center">
            <Users className="mx-auto h-9 w-9 text-[#5A6472]" />
            <h3 className="mt-3 font-editorial text-xl font-bold text-[#14171F]">
              Tidak ditemukan anggota DPR RI yang cocok
            </h3>
            <p className="mt-1 text-sm text-[#5A6472] max-w-xl mx-auto">
              Coba ubah kata kunci pencarian, fraksi, atau pilihan komisi.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-xl bg-gradient-to-r from-[#8D1D29] to-[#5B1219] px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
            >
              Tampilkan Semua {MEMBERS_580.length} Anggota
            </button>
          </div>
        ) : (
          <>
            <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pagedMembers.map((member) => {
                const watched = isMemberWatched(member.id);
                return (
                  <article
                    key={member.id}
                    className="elevated-surface-interactive relative overflow-hidden flex flex-col justify-between"
                  >
                    <div
                      className="pointer-events-none absolute -top-16 -right-12 h-32 w-32 rounded-full opacity-12 blur-2xl"
                      style={{ backgroundColor: member.factionColor }}
                    />

                    <div className="relative p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-editorial text-base font-bold text-white shadow-md"
                            style={{
                              background: `linear-gradient(135deg, ${member.factionColor}, #14171F)`,
                            }}
                          >
                            {getInitials(member.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                                style={{ backgroundColor: member.factionColor }}
                              >
                                {member.factionShort}
                              </span>
                              <span className="font-mono-num text-[11px] font-semibold text-[#5A6472]">
                                #{member.seatNo}
                              </span>
                            </div>
                            <h2 className="mt-2 font-editorial text-lg sm:text-xl font-bold text-[#14171F] leading-snug">
                              <Link to={`/anggota/${member.id}`} className="hover:text-[#7A1822]">
                                {member.name}
                              </Link>
                            </h2>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleMember(member.id)}
                          aria-pressed={watched}
                          className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                            watched
                              ? 'bg-[#7A1822] text-white shadow-2xs'
                              : 'bg-[#F4F1EA] text-[#14171F] hover:bg-[#7A1822]/10 hover:text-[#7A1822]'
                          }`}
                        >
                          <Bookmark className={`h-3 w-3 ${watched ? 'fill-current' : ''}`} />
                          {watched ? 'Dipantau' : 'Pantau'}
                        </button>
                      </div>

                      <div className="mt-4 space-y-1.5 text-xs text-[#5A6472]">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#7A1822] mt-0.5" />
                          <span>
                            <strong className="text-[#14171F]">Dapil:</strong> {member.dapil}
                          </span>
                        </div>
                        {member.komisi && (
                          <div className="flex items-start gap-2">
                            <Landmark className="h-3.5 w-3.5 shrink-0 text-[#7A1822] mt-0.5" />
                            <span>
                              <strong className="text-[#14171F]">Tugas:</strong> {member.komisi}
                            </span>
                          </div>
                        )}
                        {member.votes && (
                          <div className="flex items-start gap-2">
                            <Vote className="h-3.5 w-3.5 shrink-0 text-[#0F5132] mt-0.5" />
                            <span className="font-mono-num">
                              <strong className="font-sans text-[#14171F]">Suara sah:</strong> {member.votes}
                            </span>
                          </div>
                        )}
                      </div>

                      {member.note && (
                        <p className="mt-3 rounded-xl bg-[#FAF8F4] px-3 py-2 text-[11px] text-[#5A6472] line-clamp-2 leading-relaxed">
                          {member.note}
                        </p>
                      )}
                    </div>

                    <div className="px-6 py-3.5 border-t border-[#14171F]/6 flex items-center justify-between text-xs">
                      <span className="text-[#5A6472] truncate pr-2">{member.faction}</span>
                      <Link
                        to={`/anggota/${member.id}`}
                        className="shrink-0 inline-flex items-center gap-1 font-bold text-[#7A1822] hover:underline"
                      >
                        Detail <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#14171F] shadow-2xs disabled:opacity-40 hover:bg-[#FAF8F4] cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Sebelumnya
                </button>
                <span className="font-mono-num text-xs font-bold text-[#5A6472] px-2">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#14171F] shadow-2xs disabled:opacity-40 hover:bg-[#FAF8F4] cursor-pointer disabled:cursor-not-allowed"
                >
                  Berikutnya
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
