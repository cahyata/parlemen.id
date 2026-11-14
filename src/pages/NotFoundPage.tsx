import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-[#7C1D26]">404 — Halaman Tidak Ditemukan</p>
      <h1 className="mt-2 font-editorial text-4xl font-bold text-[#1A1D21]">
        Halaman Portal Tidak Tersedia
      </h1>
      <p className="mt-3 text-sm sm:text-base text-[#525B66]">
        Tautan yang Anda tuju tidak ditemukan pada direktori Parlemen.id. Silakan kembali ke beranda atau telusuri layanan RUU, Anggota, dan Risalah Sidang.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md bg-[#7C1D26] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5B1219]"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
        </Link>
        <Link
          to="/legislasi"
          className="rounded-md border border-[#DFDCD4] bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D21] hover:border-[#7C1D26]"
        >
          Buka Pelacakan RUU
        </Link>
      </div>
    </div>
  );
}
