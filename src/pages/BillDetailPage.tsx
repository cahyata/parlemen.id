import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Landmark,
  MessageSquarePlus,
  Scale,
  Users,
} from 'lucide-react';
import { BILLS, LEGISLATIVE_STAGES } from '../data/parliamentData';
import { Breadcrumb } from '../components/Breadcrumb';
import { BillStageStepper } from '../components/BillStageStepper';

export function BillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bill = BILLS.find((b) => b.id === id);
  const [downloadedDoc, setDownloadedDoc] = useState<string | null>(null);

  if (!bill) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-editorial text-3xl font-bold text-[#14171F]">RUU Tidak Ditemukan</h1>
        <p className="mt-2 text-sm text-[#5A6472]">
          Data rancangan undang-undang dengan kode <code className="font-mono-num">{id}</code> tidak tersedia.
        </p>
        <Link
          to="/legislasi"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8D1D29] to-[#5B1219] px-5 py-2.5 text-sm font-bold text-white shadow-md"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Pelacakan RUU
        </Link>
      </div>
    );
  }

  const currentStageInfo = LEGISLATIVE_STAGES[bill.stage];
  const dimPct = bill.dimProgress
    ? Math.round((bill.dimProgress.agreed / bill.dimProgress.total) * 100)
    : null;

  return (
    <div>
      {/* Atmospheric Header Band */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FAF8F4] to-[#F7F5F0] shadow-[0_12px_36px_-22px_rgba(20,23,31,0.06)]">
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#7A1822]/8 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#C28E0E]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
          <Breadcrumb
            items={[
              { label: 'RUU & Pembahasan', to: '/legislasi' },
              { label: bill.shortTitle },
            ]}
          />

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-[#7A1822]/10 px-3 py-1 font-bold text-[#7A1822]">
              {bill.category}
            </span>
            <span className="font-semibold text-[#5A6472]">{bill.proposer}</span>
            <span className="text-[#5A6472]/50">•</span>
            <span className="rounded-full bg-emerald-500/12 px-3 py-1 font-bold text-[#0F5132]">
              {bill.stageStatus}
            </span>
          </div>

          <h1 className="mt-4 font-editorial text-3xl sm:text-5xl font-bold text-[#14171F] leading-[1.12] max-w-4xl">
            {bill.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-2 text-xs text-[#5A6472]">
            <span className="inline-flex items-center gap-1.5">
              <Landmark className="h-4 w-4 text-[#7A1822]" />
              Komisi / Badan Pembahas: <strong className="text-[#14171F]">{bill.committee}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono-num">
              <Calendar className="h-4 w-4 text-[#7A1822]" />
              Pembaruan: <strong className="text-[#14171F]">{bill.lastUpdated}</strong>
            </span>
          </div>

          {/* 5-Stage Legislative Progress Glass Card */}
          <div className="mt-10 glass-surface p-7 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5A6472]">
                Posisi Tahapan Pembentukan UU
              </span>
              <span className="font-mono-num text-xs font-bold text-[#7A1822]">
                Tahap {bill.stage + 1} dari 5: {currentStageInfo.title}
              </span>
            </div>
            <BillStageStepper currentStage={bill.stage} />
            <p className="mt-5 text-xs sm:text-sm text-[#5A6472] leading-[1.7] pt-4 border-t border-[#14171F]/8">
              <strong className="text-[#14171F]">Deskripsi Tahap Aktif:</strong> {currentStageInfo.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Split */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="elevated-surface p-7 sm:p-9">
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14171F]">
              Ringkasan Substansi RUU
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#14171F]/85 leading-[1.75]">{bill.summary}</p>
          </div>

          {bill.dimProgress && (
            <div className="elevated-surface p-7 sm:p-9">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-xl">
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14171F]">
                    Daftar Poin Perubahan Pasal (DIM)
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#5A6472] leading-[1.7]">
                    DIM (Daftar Inventarisasi Masalah) adalah daftar poin usulan perubahan pasal yang dibahas bersama antara DPR RI dan Pemerintah sebelum disahkan.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/12 px-3.5 py-1 font-mono-num text-xs font-bold text-[#0F5132]">
                  {dimPct}% Disepakati
                </span>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-6 py-5 border-y border-[#14171F]/8 text-center sm:text-left">
                <div>
                  <div className="font-mono-num text-2xl sm:text-3xl font-bold text-[#14171F]">{bill.dimProgress.total}</div>
                  <div className="mt-1 text-xs font-medium text-[#5A6472]">Total Poin DIM</div>
                </div>
                <div>
                  <div className="font-mono-num text-2xl sm:text-3xl font-bold text-[#0F5132]">{bill.dimProgress.agreed}</div>
                  <div className="mt-1 text-xs font-medium text-[#0F5132]">Disepakati Panja</div>
                </div>
                <div>
                  <div className="font-mono-num text-2xl sm:text-3xl font-bold text-amber-800">{bill.dimProgress.pending}</div>
                  <div className="mt-1 text-xs font-medium text-amber-800">Masih Dibahas</div>
                </div>
              </div>

              {bill.dimHighlights && bill.dimHighlights.length > 0 && (
                <div className="mt-8 space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A6472]">
                    Matriks Perbandingan Klaster DIM Utama
                  </h3>
                  <div className="divide-y divide-[#14171F]/8">
                    {bill.dimHighlights.map((item) => (
                      <div key={item.article} className="py-6 first:pt-2 last:pb-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono-num text-xs font-bold text-[#7A1822]">
                            {item.cluster} • {item.article}
                          </span>
                          <span
                            className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${
                              item.status === 'Disepakati'
                                ? 'bg-emerald-500/12 text-[#0F5132]'
                                : item.status === 'Dalam Pembahasan Timus'
                                  ? 'bg-amber-500/12 text-amber-800'
                                  : 'bg-[#EFECE4] text-[#5A6472]'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="mt-2.5 text-sm sm:text-base font-bold text-[#14171F]">{item.issue}</div>
                        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 text-xs sm:text-sm">
                          <div className="border-l-2 border-[#7A1822]/40 pl-4">
                            <div className="text-xs font-bold text-[#7A1822]">Usulan Fraksi DPR RI</div>
                            <p className="mt-1.5 text-[#5A6472] leading-[1.7]">{item.dprPosition}</p>
                          </div>
                          <div className="border-l-2 border-[#14171F]/20 pl-4">
                            <div className="text-xs font-bold text-[#14171F]">Tanggapan Pemerintah</div>
                            <p className="mt-1.5 text-[#5A6472] leading-[1.7]">{item.govPosition}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Kronologi Pembahasan */}
          <div className="elevated-surface p-7 sm:p-9">
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14171F]">
              Kronologi & Risalah Proses
            </h2>
            <ol className="mt-7 relative border-l-2 border-[#7A1822]/20 ml-3 space-y-7">
              {bill.timeline.map((item, idx) => (
                <li key={item.event} className="ml-6">
                  <span
                    className={`absolute -left-[9px] mt-1 flex h-4 w-4 items-center justify-center rounded-full shadow-sm ${
                      idx === 0
                        ? 'bg-gradient-to-br from-[#8D1D29] to-[#5B1219]'
                        : 'bg-gradient-to-br from-[#198754] to-[#0F5132]'
                    }`}
                  />
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#5A6472]">
                    <span className="font-mono-num font-bold text-[#14171F]">{item.date}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#7A1822]">{item.actor}</span>
                  </div>
                  <p className="mt-1.5 text-sm sm:text-base font-medium text-[#14171F] leading-[1.65]">{item.event}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Pandangan Mini / Posisi Fraksi */}
          <div className="elevated-surface p-7 sm:p-9">
            <div className="flex items-center gap-2.5">
              <Users className="h-5 w-5 text-[#7A1822]" />
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14171F]">
                Posisi & Pandangan Fraksi
              </h2>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-[#5A6472] leading-[1.65]">
              Ringkasan sikap fraksi dalam Pandangan Mini Tingkat I atau Pendapat Akhir Tingkat II.
            </p>
            <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {bill.factionPositions.map((fp) => (
                <div key={fp.faction} className="border-l-2 pl-4" style={{ borderColor: fp.color }}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#14171F]">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: fp.color }} />
                      {fp.faction}
                    </span>
                    <span className="text-[11px] font-bold text-[#0F5132]">
                      {fp.stance}
                    </span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-[#5A6472] leading-[1.65]">{fp.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="velvet-surface relative overflow-hidden p-7 sm:p-8 text-white">
            <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-[#C28E0E]/20 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-[#FDE68A]">
                <Scale className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-widest">Hak Masukan Warga</span>
              </div>
              <h3 className="mt-3 font-editorial text-2xl font-bold text-white">
                Berikan Masukan untuk RUU Ini
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-white/80 leading-[1.7]">
                Sesuai prinsip partisipasi publik yang bermakna, masyarakat, akademisi, dan organisasi dapat mengirimkan usulan pasal atau catatan terhadap Naskah Akademik sebelum pengesahan.
              </p>
              <Link
                to={`/partisipasi?ruu=${bill.id}`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D49D17] to-[#B8860B] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-6px_rgba(194,142,14,0.45)] hover:brightness-110 transition-all"
              >
                <MessageSquarePlus className="h-4 w-4" />
                Kirim Usulan / Masukan DIM
              </Link>
            </div>
          </div>

          <div className="elevated-surface p-7">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-[#14171F]">
              Dokumen Resmi RUU
            </h3>
            <p className="mt-1.5 text-xs text-[#5A6472] leading-relaxed">
              Arsip terbuka Naskah Akademik, Draf RUU, dan Kompilasi DIM.
            </p>
            <div className="mt-5 divide-y divide-[#14171F]/8">
              {(bill.documents ?? [
                { title: `Naskah Akademik ${bill.shortTitle}`, type: 'Naskah Akademik', date: bill.lastUpdated, size: '1,9 MB PDF' },
              ]).map((doc) => (
                <button
                  key={doc.title}
                  type="button"
                  onClick={() => setDownloadedDoc(doc.title)}
                  className="w-full text-left flex items-start justify-between gap-3 py-3.5 first:pt-1 last:pb-1 hover:text-[#7A1822] transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <FileText className="h-4 w-4 shrink-0 text-[#7A1822] mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#14171F] group-hover:text-[#7A1822] leading-snug">{doc.title}</div>
                      <div className="mt-1 font-mono-num text-[11px] text-[#5A6472]">
                        {doc.type} • {doc.date} • {doc.size}
                      </div>
                    </div>
                  </div>
                  <Download className="h-4 w-4 shrink-0 text-[#5A6472] group-hover:text-[#7A1822]" />
                </button>
              ))}
            </div>
            {downloadedDoc && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-500/10 p-3.5 text-xs text-emerald-950 leading-relaxed">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
                <span>
                  Pratinjau dokumen terbuka <strong>{downloadedDoc}</strong> siap diakses dalam format Open Parliamentary Data.
                </span>
              </div>
            )}
          </div>

          <div className="glass-surface p-7 text-xs text-[#5A6472] space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-[#14171F]">
              <Clock className="h-4 w-4 text-[#7A1822]" />
              Standar Tata Tertib DPR RI
            </div>
            <p className="leading-[1.7]">
              Setiap RUU dibahas melalui dua tingkat pembicaraan: Tingkat I (Komisi/Baleg/Pansus bersama Pemerintah) dan Tingkat II (pengambilan keputusan dalam Rapat Paripurna).
            </p>
            <Link to="/akd" className="inline-block pt-1 font-bold text-[#7A1822] hover:underline">
              Lihat profil {bill.committee} →
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
