import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Copy,
  Check,
  MapPin,
  Mic,
  Radio,
  Search,
  Tv,
  X,
} from 'lucide-react';
import { HANSARD_ENTRIES, TODAY_SESSIONS, type ParliamentarySession } from '../data/parliamentData';
import { PageHeader } from '../components/PageHeader';

const SESSION_TYPES = ['Semua', 'Rapat Paripurna', 'Rapat Kerja (Raker)', 'RDPU', 'Rapat Banggar'] as const;
const SESSION_STATUSES = ['Semua', 'Berlangsung', 'Terjadwal', 'Selesai'] as const;

export function SidangPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'jadwal' | 'risalah'>(() =>
    searchParams.get('tab') === 'risalah' ? 'risalah' : 'jadwal',
  );
  const [typeFilter, setTypeFilter] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [liveSession, setLiveSession] = useState<ParliamentarySession | null>(null);
  const liveTheaterRef = useRef<HTMLElement | null>(null);

  const [hansardQuery, setHansardQuery] = useState(() => searchParams.get('q') ?? '');
  const [hansardAkd, setHansardAkd] = useState('Semua');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const liveParam = searchParams.get('live');
    const tabParam = searchParams.get('tab');
    const qParam = searchParams.get('q');

    if (tabParam === 'risalah') {
      setActiveTab('risalah');
    }
    if (qParam !== null) {
      setHansardQuery(qParam);
    }
    if (liveParam) {
      const target =
        liveParam === 'active'
          ? (TODAY_SESSIONS.find((s) => s.status === 'Berlangsung' && s.liveStreamAvailable) ??
            TODAY_SESSIONS.find((s) => s.liveStreamAvailable) ??
            null)
          : (TODAY_SESSIONS.find((s) => s.id === liveParam) ?? null);
      if (target) {
        setActiveTab('jadwal');
        setLiveSession(target);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (liveSession && liveTheaterRef.current) {
      liveTheaterRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [liveSession]);

  const openLiveSession = (session: ParliamentarySession) => {
    setActiveTab('jadwal');
    setLiveSession(session);
    setSearchParams({ live: session.id }, { replace: true });
    if (liveTheaterRef.current) {
      liveTheaterRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const closeLiveSession = () => {
    setLiveSession(null);
    if (searchParams.has('live')) {
      const next = new URLSearchParams(searchParams);
      next.delete('live');
      setSearchParams(next, { replace: true });
    }
  };

  const filteredSessions = useMemo(() => {
    return TODAY_SESSIONS.filter((s) => {
      if (typeFilter !== 'Semua' && s.type !== typeFilter) return false;
      if (statusFilter !== 'Semua' && s.status !== statusFilter) return false;
      return true;
    });
  }, [typeFilter, statusFilter]);

  const hansardAkds = useMemo(
    () => ['Semua', ...Array.from(new Set(HANSARD_ENTRIES.map((h) => h.akd)))],
    [],
  );

  const filteredHansard = useMemo(() => {
    const q = hansardQuery.trim().toLowerCase();
    return HANSARD_ENTRIES.filter((h) => {
      if (hansardAkd !== 'Semua' && h.akd !== hansardAkd) return false;
      if (q) {
        const hay = `${h.sessionTitle} ${h.speaker} ${h.faction} ${h.topic} ${h.excerpt} ${h.decisionTag ?? ''}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [hansardQuery, hansardAkd]);

  const copyCitation = (id: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Jadwal & Catatan Sidang' }]}
        eyebrow="Transparansi Rapat DPR RI"
        title="Jadwal Rapat, TV Parlemen & Catatan Sidang"
        description="Ikuti agenda Rapat Paripurna, Rapat Kerja bersama Menteri, dan Rapat Dengar Pendapat Umum (RDPU). Baca juga Risalah—yaitu catatan resmi kata demi kata jalannya rapat beserta keputusan yang diambil."
        aside={
          <div className="inline-flex rounded-2xl bg-white/80 backdrop-blur-md p-1.5 shadow-[0_8px_24px_-6px_rgba(20,23,31,0.1)]">
            <button
              type="button"
              onClick={() => setActiveTab('jadwal')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'jadwal'
                  ? 'bg-gradient-to-r from-[#8D1D29] to-[#5B1219] text-white shadow-sm'
                  : 'text-[#14171F] hover:text-[#7A1822]'
              }`}
            >
              Jadwal & TV Parlemen
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('risalah')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'risalah'
                  ? 'bg-gradient-to-r from-[#8D1D29] to-[#5B1219] text-white shadow-sm'
                  : 'text-[#14171F] hover:text-[#7A1822]'
              }`}
            >
              Catatan Sidang (Risalah)
            </button>
          </div>
        }
      />

      {/* Live TV Parlemen Theater */}
      {liveSession && (
        <section
          ref={liveTheaterRef}
          className="scroll-mt-24 relative overflow-hidden bg-senayan-mesh text-white py-8 shadow-2xl"
        >
          <div className="pointer-events-none absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-[#C28E0E]/20 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <Radio className="h-4 w-4 animate-pulse" />
                Siaran Langsung TV Parlemen • {liveSession.akd}
              </div>
              <button
                type="button"
                onClick={closeLiveSession}
                className="rounded-full bg-white/10 p-1.5 text-gray-200 hover:bg-white/20 hover:text-white cursor-pointer"
                aria-label="Tutup pemutar TV Parlemen"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7 relative overflow-hidden rounded-2xl bg-black/55 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between min-h-[250px] shadow-2xl">
                <img
                  src="/assets/dpr-paripurna.webp"
                  alt="Suasana Rapat Paripurna DPR RI"
                  width={1400}
                  height={787}
                  decoding="async"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/60" />

                <div className="relative flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#8D1D29] to-[#5B1219] px-3 py-1 text-[11px] font-bold">
                    <Tv className="h-3.5 w-3.5" /> SIARAN LANGSUNG
                  </span>
                  <span className="text-xs text-white/85">{liveSession.location}</span>
                </div>
                <div className="relative my-6 text-center">
                  <p className="font-editorial text-2xl sm:text-3xl font-bold">{liveSession.title}</p>
                  <p className="mt-2 font-mono-num text-xs text-white/80">
                    {liveSession.date} • {liveSession.time}
                  </p>
                </div>
                <div className="relative flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/15 text-xs text-white/85">
                  <span>Audio & Teks Risalah Real-time Aktif</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('risalah');
                      setLiveSession(null);
                    }}
                    className="font-bold text-[#FDE68A] hover:underline cursor-pointer"
                  >
                    Buka Transkrip Risalah Terkait →
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 glass-dark rounded-2xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#FDE68A]">
                  Agenda Rapat Berjalan
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-gray-100 list-disc pl-4">
                  {liveSession.agendaItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        {activeTab === 'jadwal' ? (
          <div>
            {/* Filters */}
            <div className="glass-surface flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#5A6472] mr-1">Jenis Rapat:</span>
                {SESSION_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTypeFilter(t)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      typeFilter === t
                        ? 'bg-gradient-to-r from-[#8D1D29] to-[#5B1219] text-white shadow-sm'
                        : 'bg-white/85 text-[#14171F] hover:bg-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="session-status" className="text-xs font-bold text-[#5A6472]">
                  Status:
                </label>
                <select
                  id="session-status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#14171F] shadow-2xs focus:outline-none"
                >
                  {SESSION_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Session Cards */}
            <div className="mt-9 grid grid-cols-1 gap-8 md:grid-cols-2">
              {filteredSessions.map((session) => {
                const isLive = session.status === 'Berlangsung';
                return (
                  <article
                    key={session.id}
                    className="elevated-surface-interactive relative overflow-hidden p-7 sm:p-8 flex flex-col justify-between"
                  >
                    {isLive && (
                      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-400/15 blur-2xl" />
                    )}

                    <div className="relative">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#7A1822]">
                          {session.akd} • {session.type}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            isLive
                              ? 'bg-emerald-500/15 text-emerald-800'
                              : session.status === 'Terjadwal'
                                ? 'bg-amber-500/15 text-amber-800'
                                : 'bg-[#EFECE4] text-[#5A6472]'
                          }`}
                        >
                          {isLive && <Radio className="h-3 w-3 text-emerald-600 animate-pulse" />}
                          {session.status}
                        </span>
                      </div>

                      <h2 className="mt-4 font-editorial text-xl sm:text-2xl font-bold text-[#14171F] leading-snug">
                        {session.title}
                      </h2>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 font-mono-num text-xs text-[#5A6472]">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[#7A1822]" /> {session.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-[#7A1822]" /> {session.time}
                        </span>
                        <span className="inline-flex items-center gap-1 font-sans">
                          <MapPin className="h-3.5 w-3.5 text-[#7A1822]" /> {session.location}
                        </span>
                      </div>

                      <ul className="mt-5 border-l-2 border-[#7A1822]/20 pl-4 space-y-2 text-sm text-[#333B48] leading-relaxed">
                        {session.agendaItems.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-3 flex flex-wrap items-center justify-between gap-2">
                      {session.liveStreamAvailable ? (
                        <button
                          type="button"
                          onClick={() => openLiveSession(session)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#8D1D29] to-[#5B1219] px-4 py-2 text-xs font-bold text-white shadow-[0_8px_20px_-6px_rgba(122,24,34,0.45)] hover:shadow-[0_12px_24px_-6px_rgba(122,24,34,0.6)] transition-all cursor-pointer"
                        >
                          <Tv className="h-3.5 w-3.5 text-[#FDE68A]" />
                          {session.status === 'Berlangsung'
                            ? 'Tonton Siaran Langsung'
                            : session.status === 'Selesai'
                              ? 'Putar Ulang Rekaman'
                              : 'Siapkan Pengingat Siaran'}
                        </button>
                      ) : (
                        <span className="text-xs text-[#5A6472]">Rapat Tim Kerja (Notulen Terbit Berkala)</span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setHansardAkd(session.akd);
                          setActiveTab('risalah');
                        }}
                        className="text-xs font-bold text-[#7A1822] hover:underline cursor-pointer"
                      >
                        Lihat Risalah Terkait →
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          /* Arsip Risalah / Hansard Tab */
          <div>
            <div className="glass-surface p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                <div className="relative md:col-span-8">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A1822]" />
                  <input
                    type="text"
                    value={hansardQuery}
                    onChange={(e) => setHansardQuery(e.target.value)}
                    placeholder="Cari kutipan risalah, topik pembahasan, nama anggota, atau keputusan rapat..."
                    className="w-full rounded-xl bg-white/95 py-2.5 pl-10 pr-3 text-sm text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:outline-none"
                  />
                </div>
                <div className="md:col-span-4">
                  <select
                    value={hansardAkd}
                    onChange={(e) => setHansardAkd(e.target.value)}
                    className="w-full rounded-xl bg-white/95 px-3.5 py-2.5 text-sm font-medium text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:outline-none"
                  >
                    {hansardAkds.map((a) => (
                      <option key={a} value={a}>
                        {a === 'Semua' ? 'Semua Forum / AKD' : a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[#5A6472]">
                <span>
                  Menampilkan <strong className="font-mono-num text-[#14171F]">{filteredHansard.length}</strong> catatan resmi jalannya sidang (risalah)
                </span>
                {(hansardQuery || hansardAkd !== 'Semua') && (
                  <button
                    type="button"
                    onClick={() => {
                      setHansardQuery('');
                      setHansardAkd('Semua');
                    }}
                    className="font-bold text-[#7A1822] hover:underline cursor-pointer"
                  >
                    Reset filter risalah
                  </button>
                )}
              </div>
            </div>

            <div className="mt-9 space-y-6">
              {filteredHansard.map((entry) => {
                const citation = `${entry.speaker} (${entry.faction}), "${entry.topic}", ${entry.sessionTitle} (${entry.date}).`;
                return (
                  <article
                    key={entry.id}
                    className="elevated-surface p-7 sm:p-9"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-[#7A1822]">
                        {entry.akd} • {entry.sessionTitle}
                      </span>
                      <span className="font-mono-num text-[#5A6472]">{entry.date}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2.5">
                      <Mic className="h-4 w-4 text-[#7A1822]" />
                      <span className="text-base font-bold text-[#14171F]">{entry.speaker}</span>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                        style={{ backgroundColor: entry.factionColor }}
                      >
                        {entry.faction}
                      </span>
                    </div>

                    <div className="mt-2 text-xs font-semibold text-[#5A6472]">
                      Pokok Bahasan: <span className="text-[#14171F]">{entry.topic}</span>
                    </div>

                    <blockquote className="mt-5 border-l-3 border-[#7A1822]/35 pl-5 font-editorial text-lg sm:text-xl italic text-[#14171F] leading-[1.75] max-w-3xl">
                      {entry.excerpt}
                    </blockquote>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                      {entry.decisionTag ? (
                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-[#0F5132]">
                          {entry.decisionTag}
                        </span>
                      ) : (
                        <span />
                      )}
                      <button
                        type="button"
                        onClick={() => copyCitation(entry.id, citation)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F1EA] px-3.5 py-1.5 text-xs font-bold text-[#14171F] hover:bg-[#7A1822] hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedId === entry.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" /> Kutipan Tersalin
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" /> Salin Kutipan Rapat
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
