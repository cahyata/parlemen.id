import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  FileText,
  Users,
  Calendar,
  MessageSquare,
  ArrowRight,
  MapPin,
  Scale,
  Wallet,
  Eye,
  Radio,
  Mic,
  Clock,
} from 'lucide-react';
import { AKD_LIST, BILLS, HANSARD_ENTRIES, MEMBERS, TODAY_SESSIONS } from '../data/parliamentData';
import { BillStageStepper } from '../components/BillStageStepper';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dapilQuery, setDapilQuery] = useState('');
  const navigate = useNavigate();

  const handleGlobalSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    window.dispatchEvent(new CustomEvent('parlemen:open-search', { detail: { query: q } }));
  };

  const handleDapilSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/anggota?dapil=${encodeURIComponent(dapilQuery.trim())}`);
  };

  return (
    <div>
      {/* 1. Spacious Editorial Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F4] to-[#F7F5F0] pt-14 pb-20 sm:pt-20 sm:pb-24">
        <div className="pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-[#7A1822]/10 blur-[110px]" />
        <div className="pointer-events-none absolute top-10 right-0 h-[360px] w-[360px] rounded-full bg-[#C28E0E]/14 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-widest text-[#7A1822]">
                Dewan Perwakilan Rakyat Republik Indonesia
              </p>

              <h1 className="mt-4 font-editorial text-4xl font-bold tracking-tight text-[#14171F] sm:text-6xl leading-[1.08]">
                Parlemen terbuka untuk{' '}
                <span className="bg-gradient-to-r from-[#7A1822] via-[#9E222E] to-[#C28E0E] bg-clip-text text-transparent">
                  mengawal setiap pasal
                </span>{' '}
                dan keputusan.
              </h1>

              <p className="mt-6 text-base sm:text-lg text-[#5A6472] leading-[1.75] max-w-xl">
                Telusuri perjalanan pembuatan Undang-Undang, periksa poin perubahan pasal, baca catatan lengkap jalannya rapat, dan temukan wakil rakyat dari daerah Anda.
              </p>

              {/* Frosted Glass Search Bar */}
              <form
                onSubmit={handleGlobalSearch}
                className="mt-9 glass-surface p-2.5 transition-shadow focus-within:shadow-[0_24px_60px_-14px_rgba(122,24,34,0.2)] max-w-2xl"
              >
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1 flex items-center rounded-xl bg-white/90 px-4">
                    <Search className="pointer-events-none h-5 w-5 shrink-0 text-[#7A1822]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari topik sehari-hari (korupsi, bpjs, ojol, notulen) atau nama RUU..."
                      className="w-full bg-transparent py-3.5 pl-3 pr-2 text-sm sm:text-base text-[#14171F] placeholder:text-[#5A6472]/70 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8D1D29] to-[#5B1219] px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-[0_12px_28px_-6px_rgba(122,24,34,0.45)] hover:shadow-[0_16px_32px_-6px_rgba(122,24,34,0.6)] hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    Cari Data
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>

              {/* Quiet Inline Links */}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#5A6472]">
                <span className="font-semibold text-[#14171F]">Populer:</span>
                <Link to="/legislasi/ruu-perampasan-aset" className="hover:text-[#7A1822] hover:underline">
                  RUU Perampasan Aset
                </Link>
                <Link to="/legislasi/ruu-kedaulatan-data-ai" className="hover:text-[#7A1822] hover:underline">
                  RUU Tata Kelola AI
                </Link>
                <Link to="/akd" className="hover:text-[#7A1822] hover:underline">
                  Komisi I–XIII
                </Link>
                <Link to="/sidang" className="hover:text-[#7A1822] hover:underline">
                  Catatan Sidang
                </Link>
              </div>
            </div>

            {/* Right Velvet Snapshot Card */}
            <div className="lg:col-span-5">
              <div className="velvet-surface relative overflow-hidden text-white">
                <div className="pointer-events-none absolute -top-14 -right-14 h-44 w-44 rounded-full bg-[#C28E0E]/25 blur-3xl" />

                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src="/assets/dpr-building.webp"
                    alt="Kompleks Parlemen Republik Indonesia di Senayan, Jakarta"
                    width={1067}
                    height={592}
                    decoding="async"
                    fetchPriority="high"
                    className="h-full w-full object-cover object-center opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B070C] via-[#2B070C]/40 to-transparent" />
                  <div className="absolute top-4 left-5 inline-flex items-center gap-2 rounded-full bg-black/45 backdrop-blur-md px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#FDE68A]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Kompleks Parlemen Senayan
                  </div>
                </div>

                <div className="relative p-7 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-dark rounded-2xl p-4">
                      <div className="font-mono-num text-2xl sm:text-3xl font-bold text-[#FDE68A]">
                        {BILLS.length}
                      </div>
                      <div className="mt-1 text-xs text-white/80">RUU Terdaftar</div>
                    </div>
                    <div className="glass-dark rounded-2xl p-4">
                      <div className="font-mono-num text-2xl sm:text-3xl font-bold text-white">
                        13 + 7
                      </div>
                      <div className="mt-1 text-xs text-white/80">Komisi & Badan</div>
                    </div>
                    <div className="glass-dark rounded-2xl p-4">
                      <div className="font-mono-num text-2xl sm:text-3xl font-bold text-emerald-300">
                        8
                      </div>
                      <div className="mt-1 text-xs text-white/80">Fraksi DPR RI</div>
                    </div>
                    <div className="glass-dark rounded-2xl p-4">
                      <div className="font-mono-num text-2xl sm:text-3xl font-bold text-white">
                        80
                      </div>
                      <div className="mt-1 text-xs text-white/80">Wilayah (Dapil)</div>
                    </div>
                  </div>

                  <Link
                    to="/partisipasi"
                    className="mt-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-[#C28E0E] to-[#A17408] px-5 py-3.5 text-xs font-bold text-white shadow-[0_10px_24px_-6px_rgba(194,142,14,0.5)] hover:brightness-110 transition-all"
                  >
                    <span>Kirim Aspirasi atau Masukan RUU</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 Layanan Utama (Band Terpisah agar Hero Lega) */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              to: '/legislasi',
              icon: FileText,
              gradient: 'from-[#7A1822] to-[#5B1219]',
              title: 'Pantau RUU & UU',
              desc: 'Lihat progres RUU dari daftar prioritas hingga pengesahan Paripurna.',
            },
            {
              to: '/anggota',
              icon: Users,
              gradient: 'from-[#1D4ED8] to-[#1E3A8A]',
              title: 'Cari Wakil Rakyat',
              desc: 'Temukan anggota DPR berdasarkan kota, wilayah pilih, dan partai.',
            },
            {
              to: '/sidang',
              icon: Calendar,
              gradient: 'from-[#0F5132] to-[#0A3622]',
              title: 'Jadwal & Catatan Sidang',
              desc: 'Agenda rapat hari ini, siaran TV Parlemen, dan catatan resmi sidang.',
            },
            {
              to: '/partisipasi',
              icon: MessageSquare,
              gradient: 'from-[#B8860B] to-[#8C6404]',
              title: 'Suara Warga',
              desc: 'Kirim masukan pasal RUU atau aduan publik ke Badan Aspirasi.',
            },
          ].map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="elevated-surface-interactive group flex flex-col justify-between p-7"
            >
              <div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-md group-hover:scale-105 transition-transform`}
                >
                  <card.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 font-sans text-base font-bold text-[#14171F] group-hover:text-[#7A1822] transition-colors">
                  {card.title}
                </h2>
                <p className="mt-2 text-sm text-[#5A6472] leading-relaxed">{card.desc}</p>
              </div>
              <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#7A1822]">
                <span>Buka layanan</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Hari Ini di Kompleks Parlemen Senayan */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7A1822]">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              Agenda Persidangan Terbuka
            </div>
            <h2 className="mt-2 font-editorial text-3xl sm:text-4xl font-bold text-[#14171F]">
              Hari Ini di Kompleks Parlemen Senayan
            </h2>
          </div>
          <Link
            to="/sidang"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#7A1822] hover:underline"
          >
            Semua jadwal & TV Parlemen <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-8 md:grid-cols-2">
          {TODAY_SESSIONS.map((session) => {
            const isLive = session.status === 'Berlangsung';
            return (
              <div
                key={session.id}
                className={`elevated-surface-interactive relative overflow-hidden p-7 sm:p-8 flex flex-col justify-between ${
                  isLive ? 'shadow-[0_24px_50px_-14px_rgba(122,24,34,0.16)]' : ''
                }`}
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

                  <h3 className="mt-4 font-editorial text-xl sm:text-2xl font-bold text-[#14171F] leading-snug">
                    {session.title}
                  </h3>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono-num text-xs text-[#5A6472]">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#7A1822]" />
                      {session.time}
                    </span>
                    <span>•</span>
                    <span className="font-sans">{session.location}</span>
                  </div>

                  <ul className="mt-5 border-l-2 border-[#7A1822]/20 pl-4 space-y-2 text-sm text-[#333B48] leading-relaxed">
                    {session.agendaItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 pt-4 flex items-center justify-between text-xs">
                  <span className="text-[#5A6472]">
                    {session.liveStreamAvailable
                      ? 'Tersedia di TV Parlemen'
                      : 'Rapat Tim Kerja'}
                  </span>
                  <Link
                    to={session.liveStreamAvailable ? `/sidang?live=${session.id}` : '/sidang'}
                    className="font-bold text-[#7A1822] hover:underline"
                  >
                    {session.liveStreamAvailable ? 'Buka Siaran & Ruang Sidang →' : 'Lihat Jadwal Sidang →'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Pelacakan RUU Prioritas + Cari Wilayah (Dapil) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white/75 to-[#F7F5F0] py-20">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left: RUU Prioritas */}
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#7A1822]">
                  Daftar Prioritas & Pembahasan Pasal
                </p>
                <h2 className="mt-2 font-editorial text-3xl sm:text-4xl font-bold text-[#14171F]">
                  Pelacakan RUU Prioritas
                </h2>
              </div>
              <Link
                to="/legislasi"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#7A1822] hover:underline"
              >
                Lihat seluruh {BILLS.length} RUU <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-9 space-y-6">
              {BILLS.slice(0, 3).map((bill) => {
                const dimPct = bill.dimProgress
                  ? Math.round((bill.dimProgress.agreed / bill.dimProgress.total) * 100)
                  : null;

                return (
                  <Link
                    key={bill.id}
                    to={`/legislasi/${bill.id}`}
                    className="elevated-surface-interactive block p-7 sm:p-8"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-[#7A1822]">
                        {bill.proposer} • {bill.committee}
                      </span>
                      {dimPct !== null && (
                        <span className="rounded-full bg-emerald-500/12 px-3 py-1 font-mono-num font-bold text-[#0F5132]">
                          Poin Pasal Disepakati: {dimPct}%
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3.5 font-editorial text-2xl font-bold text-[#14171F] leading-snug">
                      {bill.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-[#5A6472] line-clamp-2 leading-[1.75]">
                      {bill.summary}
                    </p>

                    <div className="mt-6">
                      <BillStageStepper currentStage={bill.stage} compact />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Velvet Dapil Finder */}
          <div className="lg:col-span-4">
            <div className="velvet-surface relative overflow-hidden p-7 sm:p-8 text-white sticky top-28">
              <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#C28E0E]/25 blur-3xl" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#FDE68A]">
                  <MapPin className="h-3.5 w-3.5" />
                  Cari Wilayah • 80 Dapil
                </div>

                <h2 className="mt-3 font-editorial text-2xl sm:text-3xl font-bold text-white leading-tight">
                  Siapa Wakil Rakyat di Daerah Anda?
                </h2>
                <p className="mt-3 text-sm text-white/80 leading-relaxed">
                  Masukkan nama kota, kabupaten, atau provinsi untuk melihat anggota DPR RI dari daerah pemilihan Anda.
                </p>

                <form onSubmit={handleDapilSearch} className="mt-6 space-y-3">
                  <input
                    type="text"
                    value={dapilQuery}
                    onChange={(e) => setDapilQuery(e.target.value)}
                    placeholder="Ketik kota: Bandung, Surabaya, Bali..."
                    className="w-full rounded-xl bg-white/95 px-4 py-3 text-sm text-[#14171F] placeholder:text-[#5A6472] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-[#D49D17] to-[#B8860B] py-3 text-sm font-bold text-white shadow-[0_12px_28px_-6px_rgba(194,142,14,0.55)] hover:brightness-110 transition-all cursor-pointer"
                  >
                    Temukan Wakil Daerah Saya
                  </button>
                </form>

                <div className="mt-5 flex flex-wrap gap-2">
                  {['Bandung', 'Jakarta', 'Surabaya', 'Medan', 'Bali'].map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => navigate(`/anggota?dapil=${encodeURIComponent(city)}`)}
                      className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      {city}
                    </button>
                  ))}
                </div>

                <div className="mt-7 pt-6 border-t border-white/10">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#FDE68A]">
                    Sampel Anggota DPR RI
                  </div>
                  <div className="mt-3.5 space-y-3">
                    {MEMBERS.slice(0, 3).map((m) => (
                      <Link
                        key={m.id}
                        to={`/anggota/${m.id}`}
                        className="glass-dark flex items-center justify-between rounded-xl p-3 hover:bg-white/15 transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="truncate text-sm font-bold text-white">
                            {m.name}
                          </div>
                          <div className="truncate text-[11px] text-white/75">{m.dapil}</div>
                        </div>
                        <span
                          className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
                          style={{ backgroundColor: m.factionColor }}
                        >
                          {m.factionShort}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 3 Fungsi Konstitusional DPR RI */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#7A1822]">
            Tugas Utama DPR RI (UUD 1945)
          </p>
          <h2 className="mt-2 font-editorial text-3xl sm:text-4xl font-bold text-[#14171F]">
            Bagaimana DPR RI Bekerja
          </h2>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              num: '01',
              icon: Scale,
              gradient: 'from-[#7A1822] to-[#4A0D13]',
              title: 'Membuat Undang-Undang',
              desc: 'Menyusun daftar RUU prioritas, membahas naskah bersama Pemerintah di Komisi atau Badan Legislasi, lalu mengesahkannya di Sidang Paripurna.',
              linkTo: '/legislasi',
              linkLabel: 'Telusuri daftar RUU →',
            },
            {
              num: '02',
              icon: Wallet,
              gradient: 'from-[#C28E0E] to-[#8C6404]',
              title: 'Menetapkan Anggaran Negara',
              desc: 'Membahas dan menyetujui RUU APBN bersama Presiden—termasuk alokasi belanja kementerian serta transfer anggaran ke daerah.',
              linkTo: '/legislasi/ruu-apbn-2027',
              linkLabel: 'Lihat UU APBN 2027 →',
            },
            {
              num: '03',
              icon: Eye,
              gradient: 'from-[#0F5132] to-[#08331E]',
              title: 'Mengawasi Pemerintah',
              desc: `Mengawal pelaksanaan aturan dan anggaran lewat rapat kerja bersama menteri di ${AKD_LIST.length} Komisi dan Badan, termasuk menyerap keluhan warga.`,
              linkTo: '/akd',
              linkLabel: 'Lihat Komisi I–XIII →',
            },
          ].map((fn) => (
            <div key={fn.num} className="elevated-surface-interactive relative p-8 flex flex-col justify-between overflow-hidden">
              <div>
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${fn.gradient} text-white shadow-md`}>
                    <fn.icon className="h-5 w-5" />
                  </div>
                  <span className="font-editorial text-4xl font-bold text-[#14171F]/12">
                    {fn.num}
                  </span>
                </div>
                <h3 className="mt-6 font-editorial text-2xl font-bold text-[#14171F]">{fn.title}</h3>
                <p className="mt-3 text-sm text-[#5A6472] leading-[1.75]">{fn.desc}</p>
              </div>
              <Link
                to={fn.linkTo}
                className="mt-7 inline-flex items-center text-xs font-bold text-[#7A1822] hover:underline"
              >
                {fn.linkLabel}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Cuplikan Catatan Sidang Terbaru */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#7A1822]">
              Catatan Resmi Jalannya Rapat (Risalah)
            </p>
            <h2 className="mt-2 font-editorial text-3xl sm:text-4xl font-bold text-[#14171F]">
              Cuplikan Pernyataan & Keputusan Sidang
            </h2>
          </div>
          <Link
            to="/sidang"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#7A1822] hover:underline"
          >
            Lihat seluruh catatan sidang <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-8 md:grid-cols-3">
          {HANSARD_ENTRIES.slice(0, 3).map((entry) => (
            <article
              key={entry.id}
              className="elevated-surface p-7 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-[#7A1822]">{entry.akd}</span>
                  <span className="font-mono-num text-[11px] text-[#5A6472]">{entry.date}</span>
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 min-w-0">
                    <Mic className="h-4 w-4 shrink-0 text-[#7A1822] mt-0.5" />
                    <span className="text-sm font-bold text-[#14171F] leading-snug">{entry.speaker}</span>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
                    style={{ backgroundColor: entry.factionColor }}
                  >
                    {entry.faction}
                  </span>
                </div>

                <blockquote className="mt-5 border-l-2 border-[#7A1822]/30 pl-4 font-editorial text-base italic text-[#14171F] leading-[1.75]">
                  {entry.excerpt}
                </blockquote>
              </div>

              {entry.decisionTag && (
                <div className="mt-6 pt-4 border-t border-[#14171F]/6">
                  <span className="inline-block rounded-xl bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-[#0F5132] leading-snug">
                    {entry.decisionTag}
                  </span>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
