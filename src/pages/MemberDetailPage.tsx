import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  Info,
  Landmark,
  MapPin,
  MessageSquare,
  Send,
  Users,
  Vote,
} from 'lucide-react';
import { DAPIL_BY_NAME, MEMBERS_580 } from '../data/referenceData';
import { Breadcrumb } from '../components/Breadcrumb';
import { useWatchlist } from '../utils/watchlist';

export function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const member = MEMBERS_580.find((m) => m.id === id);
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

  const watched = isMemberWatched(member.id);
  const dapilInfo = DAPIL_BY_NAME.get(member.dapil.toLowerCase());
  const sameDapilMembers = MEMBERS_580.filter(
    (m) => m.dapil.toLowerCase() === member.dapil.toLowerCase() && m.id !== member.id,
  );

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
                <span className="rounded-full bg-[#EFECE4] px-3 py-1 font-mono-num text-xs font-bold text-[#14171F]">
                  No. Anggota #{member.seatNo}
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
              <p className="mt-2 text-sm sm:text-base font-medium text-[#5A6472]">
                Anggota DPR RI Periode 2024-2029
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#5A6472]">
                <Link
                  to={`/anggota?dapil=${encodeURIComponent(member.dapil)}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#14171F] hover:text-[#7A1822]"
                >
                  <MapPin className="h-3.5 w-3.5 text-[#7A1822]" />
                  Dapil {member.dapil}
                </Link>
                {member.komisi && (
                  <>
                    <span className="text-[#5A6472]/50">•</span>
                    <Link
                      to={`/akd?q=${encodeURIComponent(member.komisi)}`}
                      className="font-bold text-[#7A1822] hover:underline"
                    >
                      {member.komisi}
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 glass-surface px-6 py-5 shrink-0 text-center">
              <div>
                <div className="font-mono-num text-xl sm:text-2xl font-bold text-[#14171F]">#{member.seatNo}</div>
                <div className="mt-1 text-[11px] font-medium text-[#5A6472]">No. Anggota</div>
              </div>
              <div>
                <div className="font-mono-num text-xl sm:text-2xl font-bold text-[#0F5132]">
                  {member.votes ?? '-'}
                </div>
                <div className="mt-1 text-[11px] font-medium text-[#5A6472]">Suara Sah Pemilu</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="font-mono-num text-xl sm:text-2xl font-bold text-[#7A1822]">
                  {member.komisi ?? '-'}
                </div>
                <div className="mt-1 text-[11px] font-medium text-[#5A6472]">Penugasan Komisi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8 min-w-0">
          {member.note && (
            <div className="elevated-surface p-7 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7A1822]">
                <Info className="h-4 w-4" />
                Catatan Jabatan / Pergantian
              </div>
              <p className="mt-3 text-sm sm:text-base text-[#14171F] leading-[1.75]">{member.note}</p>
            </div>
          )}

          {dapilInfo && (
            <div className="elevated-surface p-7 sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-5 w-5 text-[#7A1822]" />
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14171F]">
                    Cakupan Wilayah Dapil {dapilInfo.name}
                  </h2>
                </div>
                <span className="rounded-full bg-[#7A1822]/12 px-3 py-1 font-mono-num text-xs font-bold text-[#7A1822]">
                  {dapilInfo.seats} Kursi DPR RI
                </span>
              </div>
              <p className="mt-2 text-xs font-semibold text-[#5A6472]">
                Provinsi {dapilInfo.province} • Wilayah {dapilInfo.islandGroup}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {dapilInfo.regions.map((reg) => (
                  <span
                    key={reg}
                    className="rounded-xl bg-[#FAF8F4] px-3 py-1.5 text-xs font-medium text-[#14171F]"
                  >
                    {reg}
                  </span>
                ))}
              </div>
            </div>
          )}

          {sameDapilMembers.length > 0 && (
            <div className="elevated-surface p-7 sm:p-9">
              <div className="flex items-center gap-2.5">
                <Users className="h-5 w-5 text-[#7A1822]" />
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14171F]">
                  Wakil Lain di Dapil {member.dapil} ({sameDapilMembers.length})
                </h2>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {sameDapilMembers.map((peer) => (
                  <Link
                    key={peer.id}
                    to={`/anggota/${peer.id}`}
                    className="rounded-2xl bg-[#FAF8F4] p-4 hover:bg-white hover:shadow-sm transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#14171F] truncate">{peer.name}</div>
                      <div className="mt-0.5 text-xs text-[#5A6472] truncate">
                        {peer.komisi ?? 'DPR RI'} • #{peer.seatNo}
                      </div>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
                      style={{ backgroundColor: peer.factionColor }}
                    >
                      {peer.factionShort}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8 min-w-0">
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

          <div className="elevated-surface p-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5A6472]">
              <Landmark className="h-4 w-4 text-[#7A1822]" />
              Penugasan & Data Resmi
            </div>
            {member.komisi ? (
              <div className="flex items-center justify-between py-2 border-b border-[#14171F]/8 text-sm">
                <span className="font-bold text-[#14171F]">{member.komisi}</span>
                <Link
                  to={`/akd?q=${encodeURIComponent(member.komisi)}`}
                  className="text-xs font-bold text-[#7A1822] hover:underline"
                >
                  Lihat AKD →
                </Link>
              </div>
            ) : (
              <p className="text-xs text-[#5A6472]">Penugasan komisi belum tercantum pada sumber data tabel.</p>
            )}
            {member.votes && (
              <div className="flex items-center justify-between py-2 border-b border-[#14171F]/8 text-xs">
                <span className="inline-flex items-center gap-1.5 text-[#5A6472]">
                  <Vote className="h-3.5 w-3.5 text-[#0F5132]" />
                  Perolehan Suara Pemilu 2024
                </span>
                <strong className="font-mono-num text-[#14171F]">{member.votes}</strong>
              </div>
            )}
            <p className="text-xs text-[#5A6472] leading-relaxed">
              Rekam kehadiran rapat dan riwayat lengkap masing-masing anggota tersedia pada situs resmi DPR RI.
            </p>
            <a
              href="https://www.dpr.go.id/anggota"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A1822] hover:underline"
            >
              Buka Direktori Resmi dpr.go.id
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </aside>
      </section>
    </div>
  );
}
