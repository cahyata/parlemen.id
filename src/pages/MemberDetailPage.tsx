import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  Bookmark,
  Calendar,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Mic,
  Send,
} from 'lucide-react';
import { HANSARD_ENTRIES, MEMBERS } from '../data/parliamentData';
import { Breadcrumb } from '../components/Breadcrumb';
import { useWatchlist } from '../utils/watchlist';

export function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const member = MEMBERS.find((m) => m.id === id);
  const { isMemberWatched, toggleMember } = useWatchlist();

  if (!member) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-editorial text-3xl font-bold text-[#14171F]">Profil Anggota Tidak Ditemukan</h1>
        <p className="mt-2 text-sm text-[#5A6472]">
          Anggota DPR RI dengan identitas <code className="font-mono-num">{id}</code> tidak ditemukan.
        </p>
        <Link
          to="/anggota"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8D1D29] to-[#5B1219] px-5 py-2.5 text-sm font-bold text-white shadow-md"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Direktori Anggota
        </Link>
      </div>
    );
  }

  const memberQuotes = HANSARD_ENTRIES.filter((h) => h.speaker === member.name);
  const watched = isMemberWatched(member.id);

  return (
    <div>
      {/* Atmospheric Profile Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FAF8F4] to-[#F7F5F0] shadow-[0_12px_36px_-22px_rgba(20,23,31,0.06)]">
        <div
          className="pointer-events-none absolute -top-20 -right-16 h-80 w-80 rounded-full opacity-12 blur-3xl"
          style={{ backgroundColor: member.factionColor }}
        />

        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
          <Breadcrumb
            items={[
              { label: 'Anggota & Dapil', to: '/anggota' },
              { label: member.name },
            ]}
          />

          <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: member.factionColor }}
                >
                  {member.faction}
                </span>
                <button
                  type="button"
                  onClick={() => toggleMember(member.id)}
                  aria-pressed={watched}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                    watched
                      ? 'bg-[#7A1822] text-white shadow-sm'
                      : 'bg-white/90 text-[#14171F] shadow-2xs hover:bg-white hover:text-[#7A1822]'
                  }`}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${watched ? 'fill-current' : ''}`} />
                  {watched ? 'Dipantau di Beranda' : 'Pantau Anggota'}
                </button>
              </div>
              <h1 className="mt-4 font-editorial text-3xl sm:text-5xl font-bold text-[#14171F] leading-[1.12]">
                {member.name}
              </h1>
              <p className="mt-2 text-sm sm:text-base font-medium text-[#5A6472]">{member.role}</p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#5A6472]">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#14171F]">
                  <MapPin className="h-3.5 w-3.5 text-[#7A1822]" />
                  {member.dapil}
                </span>
                <span className="text-[#5A6472]/50">•</span>
                {member.akd.map((item) => (
                  <Link
                    key={item}
                    to="/akd"
                    className="font-bold text-[#7A1822] hover:underline"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5 glass-surface px-6 py-5 shrink-0 text-center">
              <div>
                <div className="font-mono-num text-2xl sm:text-3xl font-bold text-[#0F5132]">{member.attendanceRate}%</div>
                <div className="mt-1 text-[11px] font-medium text-[#5A6472]">Kehadiran</div>
              </div>
              <div>
                <div className="font-mono-num text-2xl sm:text-3xl font-bold text-[#14171F]">{member.billsSponsored}</div>
                <div className="mt-1 text-[11px] font-medium text-[#5A6472]">RUU Dikawal</div>
              </div>
              <div>
                <div className="font-mono-num text-2xl sm:text-3xl font-bold text-[#7A1822]">{member.interventionsCount}</div>
                <div className="mt-1 text-[11px] font-medium text-[#5A6472]">Pendapat Rapat</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="elevated-surface p-7 sm:p-9">
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14171F]">Profil & Fokus Kebijakan</h2>
            <p className="mt-4 text-sm sm:text-base text-[#14171F]/85 leading-[1.75]">{member.bio}</p>
          </div>

          <div className="elevated-surface p-7 sm:p-9">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-5 w-5 text-[#7A1822]" />
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14171F]">
                Aktivitas Parlemen Terbaru
              </h2>
            </div>
            <div className="mt-6 divide-y divide-[#14171F]/8">
              {member.recentActivities.map((act) => (
                <div
                  key={`${act.date}-${act.title}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-5 first:pt-2 last:pb-0"
                >
                  <div>
                    <div className="flex items-center gap-2.5 text-xs">
                      <span className="font-bold text-[#7A1822]">{act.type}</span>
                      <span className="text-[#5A6472]/50">•</span>
                      <span className="font-mono-num font-medium text-[#5A6472]">{act.date}</span>
                    </div>
                    <p className="mt-1.5 text-sm sm:text-base font-semibold text-[#14171F] leading-[1.6]">{act.title}</p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0F5132] hidden sm:block" />
                </div>
              ))}
            </div>
          </div>

          {memberQuotes.length > 0 && (
            <div className="elevated-surface p-7 sm:p-9">
              <div className="flex items-center gap-2.5">
                <Mic className="h-5 w-5 text-[#7A1822]" />
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14171F]">
                  Kutipan Pernyataan di Rapat (Risalah)
                </h2>
              </div>
              <div className="mt-7 space-y-7">
                {memberQuotes.map((q) => (
                  <blockquote key={q.id} className="border-l-3 border-[#7A1822] pl-5 py-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A6472]">
                      <span className="font-bold text-[#14171F]">{q.sessionTitle}</span>
                      <span className="font-mono-num">{q.date}</span>
                    </div>
                    <div className="mt-1.5 text-xs font-bold text-[#7A1822]">Topik: {q.topic}</div>
                    <p className="mt-3 font-editorial text-base sm:text-lg italic text-[#14171F] leading-[1.75]">
                      {q.excerpt}
                    </p>
                    {q.decisionTag && (
                      <div className="mt-3.5 inline-block rounded-full bg-emerald-500/12 px-3 py-1 text-[11px] font-bold text-[#0F5132]">
                        {q.decisionTag}
                      </div>
                    )}
                  </blockquote>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="velvet-surface relative overflow-hidden p-7 sm:p-8 text-white">
            <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-[#C28E0E]/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[#FDE68A]">
                <MessageSquare className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-widest">Kontak & Aspirasi Dapil</span>
              </div>
              <h3 className="mt-3 font-editorial text-2xl font-bold text-white">
                Sampaikan Aspirasi Daerah Pemilihan
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-white/80 leading-[1.7]">
                Kirim pengaduan layanan publik atau usulan kebijakan terkait wilayah <strong>{member.dapil}</strong> melalui Badan Aspirasi Masyarakat (BAM).
              </p>
              <Link
                to={`/partisipasi?dapil=${encodeURIComponent(member.dapil)}`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D49D17] to-[#B8860B] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-6px_rgba(194,142,14,0.45)] hover:brightness-110 transition-all"
              >
                <Send className="h-4 w-4" />
                Kirim Aspirasi ke BAM
              </Link>
            </div>
          </div>

          <div className="elevated-surface p-7">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5A6472]">
              <Award className="h-4 w-4 text-[#7A1822]" />
              Penugasan AKD
            </div>
            <ul className="mt-5 divide-y divide-[#14171F]/8 text-sm">
              {member.akd.map((item) => (
                <li key={item} className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1">
                  <span className="font-bold text-[#14171F]">{item}</span>
                  <Link to="/akd" className="text-xs font-bold text-[#7A1822] hover:underline">
                    Lihat →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
