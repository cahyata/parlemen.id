import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  ClipboardList,
  FileText,
  Landmark,
  MessageSquarePlus,
  Send,
  ShieldCheck,
} from 'lucide-react';
import {
  AKD_LIST,
  BILLS,
  INITIAL_ASPIRATION_TICKETS,
  type AspirationTicket,
} from '../data/parliamentData';
import { PageHeader } from '../components/PageHeader';

const STORAGE_KEY = 'parlemen_id_aspirations_v1';

export function PartisipasiPage() {
  const [searchParams] = useSearchParams();
  const initialRuuId = searchParams.get('ruu') ?? '';
  const initialDapil = searchParams.get('dapil') ?? '';

  const [channel, setChannel] = useState<'Masukan RUU (RDPU)' | 'Aspirasi BAM'>(
    initialDapil && !initialRuuId ? 'Aspirasi BAM' : 'Masukan RUU (RDPU)',
  );

  const openBills = BILLS.filter((b) => b.stage < 4);
  const [selectedRuu, setSelectedRuu] = useState<string>(
    openBills.some((b) => b.id === initialRuuId) ? initialRuuId : (openBills[0]?.id ?? ''),
  );
  const [selectedKomisi, setSelectedKomisi] = useState<string>('Komisi I');
  const [senderName, setSenderName] = useState('');
  const [organization, setOrganization] = useState('');
  const [dapil, setDapil] = useState(initialDapil);
  const [subject, setSubject] = useState('');
  const [summary, setSummary] = useState('');

  const [tickets, setTickets] = useState<AspirationTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as AspirationTicket[];
    } catch {
      // ignore storage errors
    }
    return INITIAL_ASPIRATION_TICKETS;
  });

  const [submittedTicket, setSubmittedTicket] = useState<AspirationTicket | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch {
      // ignore storage errors
    }
  }, [tickets]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !subject.trim() || !summary.trim()) return;

    const billObj = BILLS.find((b) => b.id === selectedRuu);
    const prefix = channel === 'Masukan RUU (RDPU)' ? 'RDPU' : 'BAM';
    const randomNum = Math.floor(1000 + Math.random() * 8999);
    const newTicket: AspirationTicket = {
      id: `${prefix}-2026-${randomNum}`,
      submittedAt: '14 Nov 2026',
      channel,
      target:
        channel === 'Masukan RUU (RDPU)'
          ? `${billObj?.shortTitle ?? 'RUU'} (${billObj?.committee ?? 'Baleg'})`
          : `${selectedKomisi} (via BAM)`,
      senderName: senderName.trim(),
      organization: organization.trim() || undefined,
      dapil: dapil.trim() || undefined,
      subject: subject.trim(),
      summary: summary.trim(),
      status: 'Diterima BAM / Baleg',
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSubmittedTicket(newTicket);
    setSubject('');
    setSummary('');
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Suara Warga' }]}
        eyebrow="Hak Masukan Publik & Badan Aspirasi Masyarakat (BAM)"
        title="Suara Warga & Aspirasi Publik"
        description="Kirim masukan tertulis untuk RUU yang sedang dibahas (dibahas dalam Rapat Dengar Pendapat Umum / RDPU) atau laporkan aspirasi kebijakan publik Anda ke Badan Aspirasi Masyarakat (BAM) DPR RI."
      />

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="elevated-surface p-7 sm:p-9">
            <div className="inline-flex flex-wrap gap-2 rounded-2xl bg-[#EFECE4] p-1.5">
              {(['Masukan RUU (RDPU)', 'Aspirasi BAM'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setChannel(tab)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    channel === tab
                      ? 'bg-gradient-to-r from-[#8D1D29] to-[#5B1219] text-white shadow-md'
                      : 'text-[#14171F] hover:bg-white/60'
                  }`}
                >
                  {tab === 'Masukan RUU (RDPU)' ? (
                    <FileText className="h-4 w-4" />
                  ) : (
                    <MessageSquarePlus className="h-4 w-4" />
                  )}
                  {tab}
                </button>
              ))}
            </div>

            {submittedTicket && (
              <div className="mt-5 rounded-2xl bg-emerald-500/12 p-4 text-xs sm:text-sm text-emerald-950">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700 mt-0.5" />
                  <div>
                    <div className="font-bold">
                      Masukan berhasil diregistrasi dengan nomor tiket{' '}
                      <span className="font-mono-num underline">{submittedTicket.id}</span>
                    </div>
                    <p className="mt-1 text-xs text-emerald-900">
                      Tujuan: <strong>{submittedTicket.target}</strong>. Anda dapat memantau status penelaahan pada daftar pelacakan di sebelah kanan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {channel === 'Masukan RUU (RDPU)' ? (
                <div>
                  <label htmlFor="ruu-select" className="block text-xs font-bold uppercase tracking-wider text-[#14171F]">
                    Pilih RUU Sasaran Masukan
                  </label>
                  <select
                    id="ruu-select"
                    value={selectedRuu}
                    onChange={(e) => setSelectedRuu(e.target.value)}
                    className="mt-1.5 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 text-sm font-medium text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:bg-white focus:outline-none"
                  >
                    {openBills.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.shortTitle} - {b.committee} ({b.stageStatus})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label htmlFor="komisi-select" className="block text-xs font-bold uppercase tracking-wider text-[#14171F]">
                    Komisi / Bidang Tujuan (Penelaahan via BAM)
                  </label>
                  <select
                    id="komisi-select"
                    value={selectedKomisi}
                    onChange={(e) => setSelectedKomisi(e.target.value)}
                    className="mt-1.5 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 text-sm font-medium text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:bg-white focus:outline-none"
                  >
                    {AKD_LIST.filter((a) => a.category === 'Komisi').map((a) => (
                      <option key={a.id} value={a.code}>
                        {a.code} - {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="sender-name" className="block text-xs font-bold uppercase tracking-wider text-[#14171F]">
                    Nama Lengkap Pengusul *
                  </label>
                  <input
                    id="sender-name"
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Contoh: Dr. Ratna Sari Dewi"
                    className="mt-1.5 w-full rounded-xl bg-[#F4F1EA] px-4 py-2.5 text-sm text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="org-name" className="block text-xs font-bold uppercase tracking-wider text-[#14171F]">
                    Instansi / Komunitas (Opsional)
                  </label>
                  <input
                    id="org-name"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Kampus, Asosiasi, LSM, atau Pribadi"
                    className="mt-1.5 w-full rounded-xl bg-[#F4F1EA] px-4 py-2.5 text-sm text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dapil-input" className="block text-xs font-bold uppercase tracking-wider text-[#14171F]">
                  Daerah Pemilihan / Kota Asal (Opsional)
                </label>
                <input
                  id="dapil-input"
                  type="text"
                  value={dapil}
                  onChange={(e) => setDapil(e.target.value)}
                  placeholder="Contoh: Jawa Barat I (Kota Bandung)"
                  className="mt-1.5 w-full rounded-xl bg-[#F4F1EA] px-4 py-2.5 text-sm text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="subject-input" className="block text-xs font-bold uppercase tracking-wider text-[#14171F]">
                  {channel === 'Masukan RUU (RDPU)'
                    ? 'Pasal / Pokok Usulan Perubahan DIM *'
                    : 'Judul Aspirasi / Pengaduan Kebijakan *'}
                </label>
                <input
                  id="subject-input"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    channel === 'Masukan RUU (RDPU)'
                      ? 'Misal: Usulan revisi Pasal 14 tentang kewajiban keterbukaan data latih'
                      : 'Misal: Pemerataan kuota PPPK tenaga kesehatan di wilayah kepulauan'
                  }
                  className="mt-1.5 w-full rounded-xl bg-[#F4F1EA] px-4 py-2.5 text-sm text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="summary-input" className="block text-xs font-bold uppercase tracking-wider text-[#14171F]">
                  Uraian Argumentasi & Bukti Pendukung *
                </label>
                <textarea
                  id="summary-input"
                  rows={4}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Tuliskan pokok argumentasi hukum, dampak sosial-ekonomi, atau usulan rumusan alternatif..."
                  className="mt-1.5 w-full rounded-xl bg-[#F4F1EA] px-4 py-2.5 text-sm text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="soft-well flex items-start gap-2.5 p-3.5 text-xs text-[#5A6472]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#0F5132] mt-0.5" />
                <span>
                  Sesuai prinsip <em>Meaningful Participation</em> (Putusan MK No. 91/PUU-XVIII/2020), setiap masukan tercatat untuk ditelaah oleh Badan Keahlian DPR & AKD pembahas.
                </span>
              </div>

              <button
                type="submit"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8D1D29] to-[#5B1219] px-7 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-6px_rgba(122,24,34,0.45)] hover:shadow-[0_16px_32px_-6px_rgba(122,24,34,0.6)] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Send className="h-4 w-4" />
                Kirim ke Portal Aspirasi DPR RI
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Tracker & Open Consultations */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="elevated-surface p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-[#7A1822]" />
                <h2 className="font-editorial text-2xl font-bold text-[#14171F]">
                  Pelacakan Aspirasi Publik
                </h2>
              </div>
              <span className="rounded-full bg-[#7A1822]/12 px-3 py-1 font-mono-num text-xs font-bold text-[#7A1822]">
                {tickets.length} Tiket
              </span>
            </div>
            <p className="mt-1 text-xs text-[#5A6472]">
              Daftar masukan terbaru yang masuk melalui portal RDPU dan Badan Aspirasi Masyarakat (BAM).
            </p>

            <div className="mt-6 space-y-4 max-h-[540px] overflow-y-auto pr-1">
              {tickets.map((t) => (
                <div key={t.id} className="pb-4 border-b border-[#14171F]/8 last:border-b-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className="font-mono-num font-bold text-[#7A1822]">{t.id}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-bold ${
                        t.status === 'Dijadwalkan RDPU'
                          ? 'bg-emerald-500/15 text-emerald-800'
                          : t.status === 'Diteruskan ke Komisi Terkait'
                            ? 'bg-blue-500/15 text-blue-800'
                            : 'bg-amber-500/15 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-bold text-[#14171F]">{t.subject}</div>
                  <div className="mt-1 text-xs font-semibold text-[#7A1822]">{t.target}</div>
                  <p className="mt-2 text-xs text-[#5A6472] leading-[1.7]">{t.summary}</p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#5A6472]">
                    <span>
                      Pengusul: <strong className="text-[#14171F]">{t.senderName}</strong>
                      {t.organization ? ` (${t.organization})` : ''}
                    </span>
                    <span className="font-mono-num">{t.submittedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-surface p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5A6472]">
              <Landmark className="h-4 w-4 text-[#7A1822]" />
              RUU Terbuka Masukan Saat Ini
            </div>
            <div className="mt-4 space-y-2.5">
              {BILLS.filter((b) => b.stageStatus === 'Terbuka Masukan Publik').map((b) => (
                <Link
                  key={b.id}
                  to={`/legislasi/${b.id}`}
                  className="block rounded-xl bg-white/90 p-3.5 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="text-xs font-bold text-[#14171F]">{b.shortTitle}</div>
                  <div className="mt-0.5 font-mono-num text-[11px] text-[#5A6472]">
                    {b.committee} • Tahap {b.stage + 1}/5
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
