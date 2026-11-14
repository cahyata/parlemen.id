import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  FileText,
  Landmark,
  Mail,
  MessageSquarePlus,
  Printer,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  AKD_LIST,
  BILLS,
  INITIAL_ASPIRATION_TICKETS,
  type AspirationTicket,
  type Bill,
} from '../data/parliamentData';
import { MEMBERS_580, findMatchingDapils } from '../data/referenceData';
import { PageHeader } from '../components/PageHeader';

const STORAGE_KEY = 'parlemen_id_aspirations_v1';
const INITIAL_TICKET_IDS = new Set(INITIAL_ASPIRATION_TICKETS.map((t) => t.id));

function formatTodayId(): string {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function buildDraftMessage(params: {
  channel: 'Masukan RUU (RDPU)' | 'Aspirasi BAM';
  bill?: Bill;
  komisi: string;
  dimRef: string;
  dapil: string;
  senderName: string;
  organization: string;
  subject: string;
  summary: string;
  matchedMembers: string[];
}): { emailSubject: string; body: string } {
  const targetLabel =
    params.channel === 'Masukan RUU (RDPU)'
      ? `${params.bill?.shortTitle ?? 'RUU'} (${params.bill?.committee ?? 'Baleg'})`
      : `${params.komisi} melalui Badan Aspirasi Masyarakat (BAM)`;

  const recipientLine =
    params.matchedMembers.length > 0
      ? `Yth. ${params.matchedMembers.join(', ')} (Anggota DPR RI${params.dapil ? ` Dapil ${params.dapil}` : ''})`
      : `Yth. Pimpinan & Anggota ${params.channel === 'Masukan RUU (RDPU)' ? (params.bill?.committee ?? 'Baleg DPR RI') : `${params.komisi} / BAM DPR RI`}`;

  const subjectLine =
    params.subject.trim() ||
    (params.channel === 'Masukan RUU (RDPU)'
      ? `Masukan Publik atas ${params.bill?.shortTitle ?? 'Pembahasan RUU'}`
      : `Aspirasi Kebijakan Publik untuk ${params.komisi}`);

  const lines = [
    recipientLine,
    'di Gedung Nusantara, Senayan, Jakarta',
    '',
    'Dengan hormat,',
    '',
    `Saya ${params.senderName.trim() || '[Nama Lengkap Anda]'}${params.organization.trim() ? ` dari ${params.organization.trim()}` : ''}${params.dapil.trim() ? ` (Domisili/Dapil: ${params.dapil.trim()})` : ''} bermaksud menyampaikan masukan tertulis terkait ${targetLabel}.`,
    ...(params.channel === 'Masukan RUU (RDPU)' && params.dimRef
      ? [`Fokus Pasal / Klaster DIM: ${params.dimRef}`]
      : []),
    '',
    `Pokok Usulan: ${subjectLine}`,
    '',
    'Uraian & Argumentasi:',
    params.summary.trim() || '[Tuliskan poin argumentasi, data pendukung, atau usulan rumusan pasal di sini]',
    '',
    'Besar harapan kami masukan ini dapat menjadi bahan pertimbangan dalam rapat pembahasan maupun Rapat Dengar Pendapat Umum (RDPU).',
    '',
    'Hormat kami,',
    params.senderName.trim() || '[Nama Lengkap Anda]',
  ];

  return {
    emailSubject: `[Aspirasi Warga] ${subjectLine}`,
    body: lines.join('\n'),
  };
}

export function PartisipasiPage() {
  const [searchParams] = useSearchParams();
  const initialRuuId = searchParams.get('ruu') ?? '';
  const initialDapil = searchParams.get('dapil') ?? '';

  const [channel, setChannel] = useState<'Masukan RUU (RDPU)' | 'Aspirasi BAM'>(
    initialDapil && !initialRuuId ? 'Aspirasi BAM' : 'Masukan RUU (RDPU)',
  );

  const openBills = useMemo(() => BILLS.filter((b) => b.stage < 4), []);
  const [selectedRuu, setSelectedRuu] = useState<string>(
    openBills.some((b) => b.id === initialRuuId) ? initialRuuId : (openBills[0]?.id ?? ''),
  );
  const [selectedDim, setSelectedDim] = useState<string>('');
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
  const [ticketQuery, setTicketQuery] = useState('');
  const [ticketFilter, setTicketFilter] = useState<'Semua' | 'Masukan RUU (RDPU)' | 'Aspirasi BAM'>('Semua');
  const [copiedDraft, setCopiedDraft] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch {
      // ignore storage errors
    }
  }, [tickets]);

  const activeBill = useMemo(
    () => openBills.find((b) => b.id === selectedRuu),
    [openBills, selectedRuu],
  );

  const activeDimDetail = useMemo(
    () => activeBill?.dimHighlights?.find((d) => `${d.article} (${d.cluster})` === selectedDim),
    [activeBill, selectedDim],
  );

  const matchedDapilMembers = useMemo(() => {
    const q = dapil.trim().toLowerCase();
    if (q.length < 3) return [];
    const matchedDapils = new Set(findMatchingDapils(q).map((d) => d.name.toLowerCase()));
    return MEMBERS_580.filter(
      (m) => m.dapil.toLowerCase().includes(q) || matchedDapils.has(m.dapil.toLowerCase()),
    ).slice(0, 4);
  }, [dapil]);

  const draftMessage = useMemo(
    () =>
      buildDraftMessage({
        channel,
        bill: activeBill,
        komisi: selectedKomisi,
        dimRef: selectedDim,
        dapil,
        senderName,
        organization,
        subject,
        summary,
        matchedMembers: matchedDapilMembers.map((m) => m.name),
      }),
    [
      channel,
      activeBill,
      selectedKomisi,
      selectedDim,
      dapil,
      senderName,
      organization,
      subject,
      summary,
      matchedDapilMembers,
    ],
  );

  const filteredTickets = useMemo(() => {
    const q = ticketQuery.trim().toLowerCase();
    return tickets.filter((t) => {
      if (ticketFilter !== 'Semua' && t.channel !== ticketFilter) return false;
      if (!q) return true;
      return (
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.target.toLowerCase().includes(q) ||
        t.senderName.toLowerCase().includes(q) ||
        (t.dimRef?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [tickets, ticketQuery, ticketFilter]);

  const hasCustomTickets = useMemo(
    () =>
      tickets.length !== INITIAL_ASPIRATION_TICKETS.length ||
      tickets.some((t) => !INITIAL_TICKET_IDS.has(t.id)),
    [tickets],
  );

  const handleRuuChange = (newRuuId: string) => {
    setSelectedRuu(newRuuId);
    setSelectedDim('');
  };

  const handleDimChange = (dimValue: string) => {
    setSelectedDim(dimValue);
    if (!dimValue) return;
    const found = activeBill?.dimHighlights?.find(
      (d) => `${d.article} (${d.cluster})` === dimValue,
    );
    if (found && !subject.trim()) {
      setSubject(`Masukan ${found.article}: ${found.issue}`);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !subject.trim() || !summary.trim()) return;

    const prefix = channel === 'Masukan RUU (RDPU)' ? 'RDPU' : 'BAM';
    const randomNum = Math.floor(1000 + Math.random() * 8999);
    const newTicket: AspirationTicket = {
      id: `${prefix}-2026-${randomNum}`,
      submittedAt: formatTodayId(),
      channel,
      target:
        channel === 'Masukan RUU (RDPU)'
          ? `${activeBill?.shortTitle ?? 'RUU'} (${activeBill?.committee ?? 'Baleg'})`
          : `${selectedKomisi} (via BAM)`,
      dimRef: channel === 'Masukan RUU (RDPU)' && selectedDim ? selectedDim : undefined,
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
    setSelectedDim('');
  };

  const handleCopyDraft = async () => {
    try {
      await navigator.clipboard.writeText(`${draftMessage.emailSubject}\n\n${draftMessage.body}`);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleDeleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    if (submittedTicket?.id === id) {
      setSubmittedTicket(null);
    }
  };

  const handleResetDemoTickets = () => {
    setTickets(INITIAL_ASPIRATION_TICKETS);
    setSubmittedTicket(null);
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
        <div className="lg:col-span-7 min-w-0 space-y-6">
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
                  <div className="flex-1 min-w-0">
                    <div className="font-bold">
                      Masukan tersimpan lokal dengan nomor tiket{' '}
                      <span className="font-mono-num underline">{submittedTicket.id}</span>
                    </div>
                    <p className="mt-1 text-xs text-emerald-900">
                      Tujuan: <strong>{submittedTicket.target}</strong>. Catatan: pada prototipe GitHub Pages ini, tiket disimpan di browser Anda (`localStorage`) sebagai simulasi pelacakan.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-2xs hover:bg-white cursor-pointer"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Cetak / Simpan PDF Bukti
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {channel === 'Masukan RUU (RDPU)' ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="ruu-select" className="block text-xs font-bold uppercase tracking-wider text-[#14171F]">
                      Pilih RUU Sasaran Masukan
                    </label>
                    <select
                      id="ruu-select"
                      value={selectedRuu}
                      onChange={(e) => handleRuuChange(e.target.value)}
                      className="mt-1.5 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 text-sm font-medium text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:bg-white focus:outline-none"
                    >
                      {openBills.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.shortTitle} - {b.committee} ({b.stageStatus})
                        </option>
                      ))}
                    </select>
                  </div>

                  {activeBill?.dimHighlights && activeBill.dimHighlights.length > 0 && (
                    <div>
                      <label htmlFor="dim-select" className="block text-xs font-bold uppercase tracking-wider text-[#14171F]">
                        Pilih Pasal / Klaster DIM Terkait (Opsional)
                      </label>
                      <select
                        id="dim-select"
                        value={selectedDim}
                        onChange={(e) => handleDimChange(e.target.value)}
                        className="mt-1.5 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 text-sm font-medium text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:bg-white focus:outline-none"
                      >
                        <option value="">Usulan Umum / Pasal Lainnya</option>
                        {activeBill.dimHighlights.map((d) => {
                          const val = `${d.article} (${d.cluster})`;
                          return (
                            <option key={val} value={val}>
                              {d.article} ({d.cluster}) - {d.issue}
                            </option>
                          );
                        })}
                      </select>

                      {activeDimDetail && (
                        <div className="mt-2.5 rounded-xl bg-[#EFECE4]/70 p-3.5 text-xs text-[#14171F] space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-[#7A1822]">
                              Konteks {activeDimDetail.article} ({activeDimDetail.cluster})
                            </span>
                            <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-semibold text-[#5A6472]">
                              {activeDimDetail.status}
                            </span>
                          </div>
                          <p className="text-[#5A6472]">
                            <strong>Posisi DPR:</strong> {activeDimDetail.dprPosition}
                          </p>
                          <p className="text-[#5A6472]">
                            <strong>Posisi Pemerintah:</strong> {activeDimDetail.govPosition}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
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
                  placeholder="Contoh: Jawa Barat I, Bandung, Jakarta Selatan, atau Surabaya"
                  className="mt-1.5 w-full rounded-xl bg-[#F4F1EA] px-4 py-2.5 text-sm text-[#14171F] shadow-[inset_0_1px_3px_rgba(20,23,31,0.06)] focus:bg-white focus:outline-none"
                />
                {matchedDapilMembers.length > 0 && (
                  <p className="mt-1.5 text-xs text-[#5A6472]">
                    Wakil dapil terkait:{' '}
                    {matchedDapilMembers.map((m, idx) => (
                      <span key={m.id}>
                        {idx > 0 ? ', ' : ''}
                        <Link to={`/anggota/${m.id}`} className="font-semibold text-[#7A1822] hover:underline">
                          {m.name}
                        </Link>
                      </span>
                    ))}
                  </p>
                )}
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
                Catat ke Daftar Aspirasi
              </button>
            </form>
          </div>

          {/* Draft Letter / Email Generator */}
          <div className="glass-surface p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-editorial text-xl font-bold text-[#14171F]">
                  Draf Surat / Pesan ke Wakil Dapil
                </h2>
                <p className="mt-0.5 text-xs text-[#5A6472]">
                  Otomatis terisi dari form di atas. Salin atau kirim lewat aplikasi email Anda.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-[#14171F] shadow-2xs hover:shadow-sm transition-all cursor-pointer"
                >
                  {copiedDraft ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-700" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#7A1822]" />
                      Salin Draf
                    </>
                  )}
                </button>
                <a
                  href={`mailto:?subject=${encodeURIComponent(draftMessage.emailSubject)}&body=${encodeURIComponent(draftMessage.body)}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#7A1822]/10 px-3.5 py-2 text-xs font-bold text-[#7A1822] hover:bg-[#7A1822]/15 transition-all"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Buka Email
                </a>
              </div>
            </div>

            <pre className="mt-4 max-h-60 overflow-y-auto whitespace-pre-wrap rounded-xl bg-white/80 p-4 font-sans text-xs leading-relaxed text-[#14171F] shadow-[inset_0_1px_2px_rgba(20,23,31,0.05)]">
              <strong className="block text-[#7A1822] mb-2">{draftMessage.emailSubject}</strong>
              {draftMessage.body}
            </pre>
          </div>
        </div>

        {/* Right Column: Live Tracker & Open Consultations */}
        <aside className="lg:col-span-5 min-w-0 space-y-6">
          <div className="elevated-surface p-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <ClipboardList className="h-5 w-5 shrink-0 text-[#7A1822]" />
                <h2 className="font-editorial text-2xl font-bold text-[#14171F] truncate">
                  Pelacakan Aspirasi Publik
                </h2>
              </div>
              <span className="shrink-0 rounded-full bg-[#7A1822]/12 px-3 py-1 font-mono-num text-xs font-bold text-[#7A1822]">
                {filteredTickets.length} Tiket
              </span>
            </div>
            <p className="mt-1 text-xs text-[#5A6472]">
              Daftar masukan yang masuk melalui portal RDPU dan Badan Aspirasi Masyarakat (BAM).
            </p>

            {/* Search & Filter Controls */}
            <div className="mt-4 space-y-2.5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5A6472]" />
                <input
                  type="text"
                  value={ticketQuery}
                  onChange={(e) => setTicketQuery(e.target.value)}
                  placeholder="Cari nomor tiket, RUU, atau pengusul..."
                  className="w-full rounded-xl bg-[#F4F1EA] pl-9 pr-3 py-2 text-xs text-[#14171F] shadow-[inset_0_1px_2px_rgba(20,23,31,0.05)] focus:bg-white focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {(['Semua', 'Masukan RUU (RDPU)', 'Aspirasi BAM'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setTicketFilter(f)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                        ticketFilter === f
                          ? 'bg-[#7A1822] text-white'
                          : 'bg-[#F4F1EA] text-[#5A6472] hover:text-[#14171F]'
                      }`}
                    >
                      {f === 'Masukan RUU (RDPU)' ? 'RDPU' : f === 'Aspirasi BAM' ? 'BAM' : 'Semua'}
                    </button>
                  ))}
                </div>
                {hasCustomTickets && (
                  <button
                    type="button"
                    onClick={handleResetDemoTickets}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5A6472] hover:text-[#7A1822] cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset Demo
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-4 max-h-[540px] overflow-y-auto pr-1">
              {filteredTickets.length === 0 ? (
                <div className="rounded-xl bg-[#F4F1EA]/70 p-4 text-center text-xs text-[#5A6472]">
                  Tidak ada tiket yang cocok dengan pencarian Anda.
                </div>
              ) : (
                filteredTickets.map((t) => (
                  <div key={t.id} className="pb-4 border-b border-[#14171F]/8 last:border-b-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="font-mono-num font-bold text-[#7A1822]">{t.id}</span>
                      <div className="flex items-center gap-1.5">
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
                        {!INITIAL_TICKET_IDS.has(t.id) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteTicket(t.id)}
                            title="Hapus tiket lokal"
                            aria-label={`Hapus tiket ${t.id}`}
                            className="rounded-md p-1 text-[#5A6472] hover:bg-red-500/10 hover:text-[#7A1822] cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-sm font-bold text-[#14171F]">{t.subject}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#7A1822]">
                      <span>{t.target}</span>
                      {t.dimRef && (
                        <span className="rounded-md bg-[#7A1822]/10 px-2 py-0.5 text-[11px] font-bold text-[#7A1822]">
                          {t.dimRef}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-[#5A6472] leading-[1.7]">{t.summary}</p>
                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5A6472]">
                      <span>
                        Pengusul: <strong className="text-[#14171F]">{t.senderName}</strong>
                        {t.organization ? ` (${t.organization})` : ''}
                      </span>
                      <span className="font-mono-num">{t.submittedAt}</span>
                    </div>
                  </div>
                ))
              )}
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
