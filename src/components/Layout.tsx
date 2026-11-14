import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Parlemen.id - Purwarupa Portal Terbuka DPR RI',
    description:
      'Purwarupa portal terbuka DPR RI: lacak status RUU, cari wakil daerah pemilihan, ikuti jadwal & siaran TV Parlemen, serta sampaikan aspirasi warga.',
  },
  '/legislasi': {
    title: 'Daftar RUU & Undang-Undang - Parlemen.id',
    description:
      'Pantau kemajuan 5 tahapan pembahasan Rancangan Undang-Undang (RUU) di DPR RI lengkap dengan daftar poin perubahan pasal (DIM).',
  },
  '/anggota': {
    title: 'Cari Anggota & Daerah Pemilihan - Parlemen.id',
    description:
      'Direktori anggota DPR RI Periode 2024–2029 berdasarkan nama, daerah pemilihan (Dapil), fraksi, dan komisi.',
  },
  '/sidang': {
    title: 'Jadwal Rapat, TV Parlemen & Catatan Sidang - Parlemen.id',
    description:
      'Tonton siaran langsung TV Parlemen, lihat agenda Rapat Paripurna & Rapat Kerja hari ini, dan baca catatan resmi rapat (risalah).',
  },
  '/akd': {
    title: 'Komisi I–XIII & Badan DPR RI - Parlemen.id',
    description:
      'Profil Alat Kelengkapan Dewan (AKD): 13 Komisi dan 7 Badan DPR RI beserta bidang tugas, pimpinan, dan mitra kementerian/lembaga.',
  },
  '/partisipasi': {
    title: 'Suara Warga & Aspirasi Publik - Parlemen.id',
    description:
      'Kirim usulan pasal RUU, pengaduan layanan publik, dan aspirasi daerah pemilihan secara terbuka kepada DPR RI.',
  },
};

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const baseRoute = pathname.startsWith('/legislasi/')
      ? '/legislasi'
      : pathname.startsWith('/anggota/')
        ? '/anggota'
        : pathname;

    const meta = PAGE_META[baseRoute] ?? {
      title: 'Parlemen.id - Purwarupa Portal Terbuka DPR RI',
      description: PAGE_META['/'].description,
    };

    document.title = meta.title;
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute('content', meta.description);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-clip ambient-page-bg text-[#14171F]">
      <Navbar />
      <main className="flex-1 min-w-0">{children}</main>
      <Footer />
    </div>
  );
}
