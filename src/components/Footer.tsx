import { Link } from 'react-router-dom';
import { Database, ExternalLink, MapPin, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-gradient-to-b from-[#1A080C] via-[#130D14] to-[#0E0F14] text-white">
      <div className="pointer-events-none absolute -top-32 left-1/3 h-80 w-80 rounded-full bg-[#7A1822]/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-[#C28E0E]/12 blur-3xl" />

      <div className="h-1 w-full gold-accent-bar opacity-80" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 p-1.5 shadow-lg">
                <img
                  src={`${import.meta.env.BASE_URL}assets/dpr-logo.svg`}
                  alt="Lambang DPR RI"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="font-editorial text-2xl font-bold tracking-tight leading-none">
                  Parlemen<span className="text-[#FDE68A]">.id</span>
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Open Parliamentary Digital Service
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-300 leading-relaxed">
              Portal informasi terbuka Dewan Perwakilan Rakyat Republik Indonesia untuk memantau pembuatan Undang-Undang, poin perubahan pasal (DIM), catatan lengkap jalannya rapat (risalah), serta profil wakil rakyat di daerah Anda.
            </p>
            <div className="mt-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 backdrop-blur-md px-3.5 py-1.5 text-xs text-gray-200">
                <MapPin className="h-3.5 w-3.5 text-[#FDE68A]" />
                Kompleks Parlemen Senayan, Jakarta 10270
              </span>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#FDE68A]">
              Tugas & Rapat DPR
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-300">
              <li><Link to="/legislasi" className="hover:text-white transition-colors">Pelacakan RUU Prioritas</Link></li>
              <li><Link to="/legislasi/ruu-perampasan-aset" className="hover:text-white transition-colors">Poin Perubahan Pasal (DIM)</Link></li>
              <li><Link to="/sidang" className="hover:text-white transition-colors">Jadwal Sidang & Rapat</Link></li>
              <li><Link to="/sidang" className="hover:text-white transition-colors">Catatan Lengkap Sidang (Risalah)</Link></li>
              <li><Link to="/akd" className="hover:text-white transition-colors">Komisi I–XIII & Badan</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#FDE68A]">
              Perwakilan & Suara Warga
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-300">
              <li><Link to="/anggota" className="hover:text-white transition-colors">Cari Wakil per Wilayah (84 Dapil)</Link></li>
              <li><Link to="/partisipasi" className="hover:text-white transition-colors">Beri Masukan RUU (RDPU)</Link></li>
              <li><Link to="/partisipasi" className="hover:text-white transition-colors">Kirim Pengaduan & Aspirasi (BAM)</Link></li>
              <li><Link to="/akd" className="hover:text-white transition-colors">Kementerian Mitra Komisi</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="glass-dark rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Database className="h-4 w-4" />
                Standar Data Terbuka
              </div>
              <p className="mt-2.5 text-xs text-gray-300 leading-relaxed">
                Dirancang mengacu pada standar keterbukaan informasi parlemen (UU KIP, UU MD3, dan Putusan MK tentang Partisipasi Bermakna).
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-[#FDE68A]" />
                  Open Data v2.6
                </span>
                <a
                  href="https://www.dpr.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-gray-200 hover:text-[#FDE68A]"
                >
                  dpr.go.id <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            © 2026 Parlemen.id - Purwarupa konsep independen (non-resmi) dengan data simulasi. Situs resmi DPR RI:{' '}
            <a
              href="https://www.dpr.go.id"
              target="_blank"
              rel="noreferrer"
              className="text-gray-200 underline hover:text-[#FDE68A]"
            >
              dpr.go.id
            </a>
            .
          </p>
          <p className="font-mono-num">UU No. 17 Tahun 2014 (UU MD3) • Tata Tertib DPR RI</p>
        </div>
      </div>
    </footer>
  );
}
