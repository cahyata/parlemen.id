export type LegislativeStageIndex = 0 | 1 | 2 | 3 | 4;

export const LEGISLATIVE_STAGES = [
  {
    index: 0,
    short: 'Prolegnas',
    title: 'Perencanaan (Prolegnas)',
    description: 'Penetapan masuk ke Daftar Prolegnas Prioritas Tahunan atau Jangka Menengah oleh Baleg DPR bersama Pemerintah & DPD.',
  },
  {
    index: 1,
    short: 'Penyusunan',
    title: 'Penyusunan & Harmonisasi',
    description: 'Penyusunan Naskah Akademik & Draf RUU, pengharmonisasian di Baleg, serta penetapan sebagai RUU Usul Inisiatif di Paripurna.',
  },
  {
    index: 2,
    short: 'Tingkat I',
    title: 'Pembicaraan Tingkat I',
    description: 'Pembahasan intensif di Komisi/Baleg/Pansus bersama Menteri terkait: Pengantar Musyawarah, pembahasan DIM, dan Pandangan Mini Fraksi.',
  },
  {
    index: 3,
    short: 'Tingkat II',
    title: 'Pembicaraan Tingkat II (Paripurna)',
    description: 'Penyampaian laporan hasil Pembicaraan Tingkat I, pendapat akhir fraksi-fraksi, dan pengambilan keputusan persetujuan bersama di Rapat Paripurna.',
  },
  {
    index: 4,
    short: 'Pengesahan',
    title: 'Pengesahan & Pengundangan',
    description: 'Penandatanganan oleh Presiden menjadi Undang-Undang dan pengundangan dalam Lembaran Negara Republik Indonesia.',
  },
] as const;

export interface DimHighlight {
  cluster: string;
  article: string;
  issue: string;
  dprPosition: string;
  govPosition: string;
  status: 'Disepakati' | 'Dalam Pembahasan Timus' | 'Pending';
}

export interface BillDocument {
  title: string;
  type: 'Naskah Akademik' | 'Draf RUU' | 'DIM Fraksi' | 'Risalah Panja' | 'Lembaran Negara';
  date: string;
  size: string;
}

export interface Bill {
  id: string;
  title: string;
  shortTitle: string;
  category: 'Prolegnas Prioritas 2026' | 'Kumulatif Terbuka' | 'RUU APBN' | 'Prolegnas 2025–2029';
  proposer: 'Inisiatif DPR RI' | 'Inisiatif Pemerintah' | 'Inisiatif DPD RI';
  committee: string;
  stage: LegislativeStageIndex;
  stageStatus: 'Sedang Dibahas' | 'Menunggu Surpres' | 'Terbuka Masukan Publik' | 'Disetujui Paripurna' | 'Diundangkan';
  lastUpdated: string;
  summary: string;
  academicPaperUrl: string;
  dimProgress?: {
    total: number;
    agreed: number;
    pending: number;
  };
  dimHighlights?: DimHighlight[];
  documents?: BillDocument[];
  timeline: {
    date: string;
    event: string;
    actor: string;
  }[];
  factionPositions: {
    faction: string;
    color: string;
    stance: 'Mendukung' | 'Mendukung dengan Catatan' | 'Menolak Sebagian' | 'Menunggu DIM';
    note: string;
  }[];
}

export interface Member {
  id: string;
  name: string;
  faction: string;
  factionShort: string;
  factionColor: string;
  dapil: string;
  regionKeywords: string[];
  akd: string[];
  role: string;
  attendanceRate: number;
  billsSponsored: number;
  interventionsCount: number;
  bio: string;
  recentActivities: {
    date: string;
    type: 'Rapat Kerja' | 'Paripurna' | 'RDPU' | 'Kunker';
    title: string;
  }[];
}

export interface ParliamentarySession {
  id: string;
  time: string;
  date: string;
  type: 'Rapat Paripurna' | 'Rapat Kerja (Raker)' | 'RDPU' | 'Rapat Dengar Pendapat' | 'Rapat Banggar';
  akd: string;
  title: string;
  location: string;
  status: 'Berlangsung' | 'Terjadwal' | 'Selesai';
  liveStreamAvailable: boolean;
  agendaItems: string[];
}

export interface HansardEntry {
  id: string;
  sessionTitle: string;
  date: string;
  akd: string;
  speaker: string;
  faction: string;
  factionColor: string;
  topic: string;
  excerpt: string;
  decisionTag?: string;
}

export interface AKD {
  id: string;
  code: string;
  name: string;
  category: 'Komisi' | 'Badan';
  chair: string;
  chairFaction: string;
  scope: string;
  partners: string[];
}

export const BILLS: Bill[] = [
  {
    id: 'ruu-perampasan-aset',
    title: 'Rancangan Undang-Undang tentang Perampasan Aset Tindak Pidana',
    shortTitle: 'RUU Perampasan Aset',
    category: 'Prolegnas Prioritas 2026',
    proposer: 'Inisiatif Pemerintah',
    committee: 'Komisi III & Baleg',
    stage: 2,
    stageStatus: 'Terbuka Masukan Publik',
    lastUpdated: '12 November 2026',
    summary:
      'Mengatur mekanisme perampasan aset hasil tindak pidana tanpa harus menunggu putusan pidana terhadap pelaku (non-conviction based asset forfeiture) guna memulihkan kerugian keuangan negara secara efektif dengan tetap menjamin hak pihak ketiga yang beritikad baik.',
    academicPaperUrl: '#naskah-akademik-perampasan-aset',
    dimProgress: { total: 148, agreed: 96, pending: 52 },
    dimHighlights: [
      {
        cluster: 'Bab II — Ruang Lingkup Aset',
        article: 'Pasal 5 ayat (1)',
        issue: 'Batas minimum nilai aset yang dapat diajukan perampasan tanpa pemidanaan',
        dprPosition: 'Mengusulkan batas minimal Rp100 juta atau aset terkait perkara strategis agar proporsional',
        govPosition: 'Menyetujui batas minimal dengan pengecualian tindak pidana pencucian uang lintas batas',
        status: 'Disepakati',
      },
      {
        cluster: 'Bab IV — Perlindungan Pihak Ketiga',
        article: 'Pasal 23 ayat (3)',
        issue: 'Batas waktu pengajuan keberatan pihak ketiga yang beritikad baik di pengadilan negeri',
        dprPosition: 'Memperpanjang tenggat keberatan dari 14 hari menjadi 30 hari kerja sejak pengumuman publik',
        govPosition: 'Mempertimbangkan 21–30 hari kerja agar tidak menghambat kepastian eksekusi',
        status: 'Dalam Pembahasan Timus',
      },
      {
        cluster: 'Bab V — Pengelolaan Aset',
        article: 'Pasal 37',
        issue: 'Audit berkala dan akuntabilitas lembaga pengelola aset sitaan negara',
        dprPosition: 'Wajib diaudit BPK setiap tahun dan dipublikasikan ringkasannya kepada DPR dan publik',
        govPosition: 'Setuju audit BPK dengan mekanisme pelaporan semesteran ke Komisi III',
        status: 'Pending',
      },
    ],
    documents: [
      { title: 'Naskah Akademik RUU Perampasan Aset Tindak Pidana', type: 'Naskah Akademik', date: '18 Jun 2026', size: '2,4 MB PDF' },
      { title: 'Draf Awal RUU Perampasan Aset (Surpres R-21/Pres/06/2026)', type: 'Draf RUU', date: '18 Jun 2026', size: '1,1 MB PDF' },
      { title: 'Kompilasi DIM Gabungan 8 Fraksi (148 Poin)', type: 'DIM Fraksi', date: '15 Sep 2026', size: '3,8 MB PDF' },
      { title: 'Risalah Panja Komisi III — Pembahasan Bab I s.d. III', type: 'Risalah Panja', date: '04 Nov 2026', size: '920 KB PDF' },
    ],
    timeline: [
      { date: '12 Nov 2026', event: 'Rapat Panja Pembahasan DIM Bab IV (Perlindungan Pihak Ketiga)', actor: 'Panja Komisi III & Kemenkum' },
      { date: '28 Okt 2026', event: 'RDPU bersama Pakar Hukum Pidana, KPK, PPATK, dan Koalisi Masyarakat Sipil', actor: 'Komisi III' },
      { date: '15 Sep 2026', event: 'Penyerahan Daftar Inventarisasi Masalah (DIM) dari Fraksi-Fraksi', actor: '8 Fraksi DPR RI' },
      { date: '18 Jun 2026', event: 'Pembacaan Surat Presiden (Surpres) & Penugasan Pembahasan di Paripurna', actor: 'Rapat Paripurna' },
    ],
    factionPositions: [
      { faction: 'Fraksi Gerindra', color: '#B91C1C', stance: 'Mendukung', note: 'Mendorong penguatan pengawasan hakim dalam penyitaan non-pidana.' },
      { faction: 'Fraksi PDI-P', color: '#991B1B', stance: 'Mendukung dengan Catatan', note: 'Memastikan mekanisme uji keberatan yang adil bagi pihak ketiga.' },
      { faction: 'Fraksi Golkar', color: '#CA8A04', stance: 'Mendukung', note: 'Menekankan sinkronisasi dengan KUHAP baru dan UU Tipikor.' },
      { faction: 'Fraksi PKS', color: '#EA580C', stance: 'Mendukung dengan Catatan', note: 'Menuntut batas nilai aset minimal dan audit lembaga pengelola aset.' },
    ],
  },
  {
    id: 'ruu-perlindungan-pekerja-rumah-tangga',
    title: 'Rancangan Undang-Undang tentang Pelindungan Pekerja Rumah Tangga (PPRT)',
    shortTitle: 'RUU PPRT',
    category: 'Prolegnas Prioritas 2026',
    proposer: 'Inisiatif DPR RI',
    committee: 'Badan Legislasi (Baleg)',
    stage: 3,
    stageStatus: 'Disetujui Paripurna',
    lastUpdated: '10 November 2026',
    summary:
      'Memberikan pengakuan hukum, standar perjanjian kerja tertulis, jaminan sosial ketenagakerjaan, waktu istirahat, dan perlindungan dari kekerasan bagi Pekerja Rumah Tangga serta mengatur keseimbangan hak dan kewajiban pemberi kerja.',
    academicPaperUrl: '#naskah-akademik-pprt',
    dimProgress: { total: 84, agreed: 84, pending: 0 },
    documents: [
      { title: 'Naskah Final RUU PPRT Hasil Persetujuan Paripurna ke-9', type: 'Draf RUU', date: '10 Nov 2026', size: '1,4 MB PDF' },
      { title: 'Laporan Akhir Badan Legislasi pada Pembicaraan Tingkat II', type: 'Risalah Panja', date: '10 Nov 2026', size: '680 KB PDF' },
    ],
    timeline: [
      { date: '10 Nov 2026', event: 'Laporan Baleg & Persetujuan Tingkat II pada Rapat Paripurna ke-9', actor: 'Rapat Paripurna' },
      { date: '03 Nov 2026', event: 'Pengambilan Keputusan Tingkat I: Seluruh 8 Fraksi menyetujui draf final', actor: 'Baleg & Kemnaker' },
      { date: '19 Okt 2026', event: 'Tim Perumus (Timus) & Tim Sinkronisasi (Timsin) merampungkan rumusan pasal', actor: 'Timus/Timsin Baleg' },
    ],
    factionPositions: [
      { faction: 'Fraksi PDI-P', color: '#991B1B', stance: 'Mendukung', note: 'Menyetujui pengesahan untuk perlindungan pekerja sektor informal.' },
      { faction: 'Fraksi PKB', color: '#15803D', stance: 'Mendukung', note: 'Menekankan akses BPJS Ketenagakerjaan bersubsidi.' },
      { faction: 'Fraksi NasDem', color: '#1D4ED8', stance: 'Mendukung', note: 'Menyoroti peran pengawasan dinas ketenagakerjaan daerah.' },
    ],
  },
  {
    id: 'ruu-kedaulatan-data-ai',
    title: 'Rancangan Undang-Undang tentang Tata Kelola Kecerdasan Artifisial & Kedaulatan Data',
    shortTitle: 'RUU Tata Kelola AI',
    category: 'Prolegnas Prioritas 2026',
    proposer: 'Inisiatif DPR RI',
    committee: 'Komisi I',
    stage: 1,
    stageStatus: 'Terbuka Masukan Publik',
    lastUpdated: '14 November 2026',
    summary:
      'Mengatur klasifikasi risiko sistem kecerdasan artifisial, transparansi algoritma pada layanan publik, perlindungan hak cipta kreator lokal, serta infrastruktur komputasi dan kedaulatan data strategis nasional.',
    academicPaperUrl: '#naskah-akademik-ai',
    documents: [
      { title: 'Naskah Akademik RUU Tata Kelola AI & Kedaulatan Data', type: 'Naskah Akademik', date: '04 Sep 2026', size: '3,1 MB PDF' },
      { title: 'Draf RUU Usul Inisiatif DPR RI (Hasil Harmonisasi Baleg)', type: 'Draf RUU', date: '22 Okt 2026', size: '1,6 MB PDF' },
    ],
    timeline: [
      { date: '14 Nov 2026', event: 'Pembukaan Konsultasi Publik Daring & RDPU bersama Asosiasi Startup/Akademisi', actor: 'Komisi I' },
      { date: '22 Okt 2026', event: 'Harmonisasi dan Pembulatan Konsepsi di Badan Legislasi', actor: 'Baleg DPR RI' },
      { date: '04 Sep 2026', event: 'Penyampaian Draf Awal & Naskah Akademik oleh Tim Ahli Komisi I', actor: 'Komisi I & BKD' },
    ],
    factionPositions: [
      { faction: 'Fraksi Golkar', color: '#CA8A04', stance: 'Mendukung dengan Catatan', note: 'Jangan sampai regulasi menghambat inovasi UMKM dan riset kampus.' },
      { faction: 'Fraksi Demokrat', color: '#2563EB', stance: 'Menunggu DIM', note: 'Meminta kejelasan lembaga pengawas independen agar tidak tumpang tindih dengan UU PDP.' },
    ],
  },
  {
    id: 'ruu-apbn-2027',
    title: 'Rancangan Undang-Undang tentang Anggaran Pendapatan dan Belanja Negara Tahun Anggaran 2027',
    shortTitle: 'RUU APBN 2027',
    category: 'RUU APBN',
    proposer: 'Inisiatif Pemerintah',
    committee: 'Badan Anggaran (Banggar)',
    stage: 4,
    stageStatus: 'Diundangkan',
    lastUpdated: '02 November 2026',
    summary:
      'Penetapan postur pendapatan negara, belanja kementerian/lembaga, transfer ke daerah (TKD), serta pembiayaan defisit APBN Tahun Anggaran 2027.',
    academicPaperUrl: '#nota-keuangan-2027',
    dimProgress: { total: 62, agreed: 62, pending: 0 },
    timeline: [
      { date: '02 Nov 2026', event: 'Diundangkan sebagai UU Nomor 18 Tahun 2026 tentang APBN TA 2027', actor: 'Presiden & Setneg' },
      { date: '24 Sep 2026', event: 'Pengesahan Tingkat II dalam Rapat Paripurna DPR RI', actor: 'Rapat Paripurna' },
      { date: '16 Agu 2026', event: 'Pidato Kenegaraan & Penyampaian Nota Keuangan oleh Presiden', actor: 'Rapat Paripurna Istimewa' },
    ],
    factionPositions: [
      { faction: 'Mayoritas Fraksi', color: '#7C1D26', stance: 'Mendukung', note: 'Disetujui dalam Paripurna dengan catatan optimalisasi TKD dan ketahanan pangan.' },
    ],
  },
  {
    id: 'ruu-masyarakat-hukum-adat',
    title: 'Rancangan Undang-Undang tentang Masyarakat Hukum Adat',
    shortTitle: 'RUU Masyarakat Adat',
    category: 'Prolegnas Prioritas 2026',
    proposer: 'Inisiatif DPD RI',
    committee: 'Komisi II & Baleg',
    stage: 2,
    stageStatus: 'Sedang Dibahas',
    lastUpdated: '08 November 2026',
    summary:
      'Menjamin pengakuan wilayah adat, tata cara penetapan kesatuan masyarakat hukum adat yang lebih sederhana, serta perlindungan hak ulayat dan pengetahuan tradisional.',
    academicPaperUrl: '#naskah-akademik-mha',
    dimProgress: { total: 112, agreed: 54, pending: 58 },
    timeline: [
      { date: '08 Nov 2026', event: 'Rapat Kerja Tripartit (DPR, DPD, Pemerintah) membahas Bab Pengakuan Wilayah Adat', actor: 'Panja RUU MHA' },
      { date: '11 Okt 2026', event: 'Kunjungan Kerja Spesifik ke Kalimantan Tengah & Papua Barat', actor: 'Panja RUU MHA' },
    ],
    factionPositions: [
      { faction: 'Fraksi NasDem', color: '#1D4ED8', stance: 'Mendukung', note: 'Mendorong percepatan pemetaan partisipatif tanah ulayat.' },
      { faction: 'Fraksi PAN', color: '#0284C7', stance: 'Mendukung dengan Catatan', note: 'Sinkronisasi dengan UU Kehutanan dan UU Cipta Kerja.' },
    ],
  },
  {
    id: 'ruu-perubahan-uu-mk-kumulatif',
    title: 'Rancangan Undang-Undang tentang Pengesahan Perjanjian Bantuan Hukum Timbal Balik dalam Masalah Pidana dengan Swiss',
    shortTitle: 'RUU Ratifikasi MLA RI–Swiss',
    category: 'Kumulatif Terbuka',
    proposer: 'Inisiatif Pemerintah',
    committee: 'Komisi I & Komisi III',
    stage: 0,
    stageStatus: 'Menunggu Surpres',
    lastUpdated: '06 November 2026',
    summary:
      'RUU kategori Kumulatif Terbuka untuk meratifikasi pembaruan protokol kerja sama bantuan hukum timbal balik (Mutual Legal Assistance) guna mempercepat pelacakan aset lintas yurisdiksi.',
    academicPaperUrl: '#naskah-akademik-mla',
    documents: [
      { title: 'Naskah Penjelasan & Salinan Naskah Perjanjian Internasional', type: 'Naskah Akademik', date: '06 Nov 2026', size: '1,8 MB PDF' },
    ],
    timeline: [
      { date: '06 Nov 2026', event: 'Baleg mencatat masuk daftar RUU Kumulatif Terbuka Perjanjian Internasional', actor: 'Baleg DPR RI' },
    ],
    factionPositions: [
      { faction: 'Fraksi Partai Demokrat', color: '#2563EB', stance: 'Menunggu DIM', note: 'Mendukung ratifikasi sepanjang memperkuat pemulihan aset negara.' },
    ],
  },
];

export const MEMBERS: Member[] = [
  {
    id: 'andika-pratama',
    name: 'Dr. H. Andika Pratama, S.H., M.H.',
    faction: 'Fraksi Partai Gerindra',
    factionShort: 'Gerindra',
    factionColor: '#B91C1C',
    dapil: 'Jawa Barat I (Kota Bandung & Kota Cimahi)',
    regionKeywords: ['bandung', 'cimahi', 'jawa barat', 'jabar', '401'],
    akd: ['Komisi III', 'Badan Legislasi'],
    role: 'Anggota Komisi III (Hukum, HAM & Keamanan)',
    attendanceRate: 94,
    billsSponsored: 5,
    interventionsCount: 38,
    bio: 'Akademisi hukum pidana dan mantan praktisi bantuan hukum yang fokus pada reformasi peradilan pidana, transparansi penegakan hukum, dan perlindungan saksi.',
    recentActivities: [
      { date: '12 Nov 2026', type: 'Rapat Kerja', title: 'Pembahasan DIM Bab IV RUU Perampasan Aset bersama Kemenkum' },
      { date: '05 Nov 2026', type: 'RDPU', title: 'Menerima masukan Koalisi Pemantau Peradilan terkait KUHAP' },
      { date: '29 Okt 2026', type: 'Paripurna', title: 'Interupsi mengenai evaluasi anggaran lembaga pemasyarakatan' },
    ],
  },
  {
    id: 'siti-nurhaliza-rahmawati',
    name: 'Siti Nurhaliza Rahmawati, S.Sos., M.Si.',
    faction: 'Fraksi PDI Perjuangan',
    factionShort: 'PDI-P',
    factionColor: '#991B1B',
    dapil: 'DKI Jakarta II (Jakarta Selatan, Jakarta Pusat & Luar Negeri)',
    regionKeywords: ['jakarta', 'jaksel', 'jakpus', 'dki', 'luar negeri', '121'],
    akd: ['Komisi I', 'BKSAP'],
    role: 'Wakil Ketua Komisi I (Pertahanan, Luar Negeri, Komunikasi & Informatika)',
    attendanceRate: 97,
    billsSponsored: 7,
    interventionsCount: 52,
    bio: 'Menjabat sebagai Wakil Ketua Komisi I yang membidangi kebijakan digital, diplomasi parlementer, dan perlindungan warga negara Indonesia di luar negeri.',
    recentActivities: [
      { date: '14 Nov 2026', type: 'RDPU', title: 'Memimpin Konsultasi Publik RUU Tata Kelola AI bersama asosiasi riset' },
      { date: '09 Nov 2026', type: 'Rapat Kerja', title: 'Raker dengan Menkomdigi terkait keamanan siber pusat data nasional' },
      { date: '01 Nov 2026', type: 'Kunker', title: 'Peninjauan layanan keimigrasian & perlindungan PMI di Kuala Lumpur' },
    ],
  },
  {
    id: 'budi-santoso-wijaya',
    name: 'Ir. Budi Santoso Wijaya, M.B.A.',
    faction: 'Fraksi Partai Golkar',
    factionShort: 'Golkar',
    factionColor: '#CA8A04',
    dapil: 'Jawa Timur I (Kota Surabaya & Kab. Sidoarjo)',
    regionKeywords: ['surabaya', 'sidoarjo', 'jawa timur', 'jatim', '601'],
    akd: ['Komisi XI', 'Badan Anggaran'],
    role: 'Anggota Badan Anggaran & Komisi XI (Keuangan & Perencanaan Pembangunan)',
    attendanceRate: 91,
    billsSponsored: 4,
    interventionsCount: 41,
    bio: 'Fokus pada kebijakan fiskal daerah, pembiayaan infrastruktur berkelanjutan, serta penguatan akses kredit usaha rakyat (KUR) bagi UMKM manufaktur.',
    recentActivities: [
      { date: '11 Nov 2026', type: 'Rapat Kerja', title: 'Raker Komisi XI dengan OJK dan BI terkait stabilitas nilai tukar' },
      { date: '03 Nov 2026', type: 'Paripurna', title: 'Penyampaian laporan Panja Asumsi Makro APBN' },
    ],
  },
  {
    id: 'rahmat-hidayat-lubis',
    name: 'H. Rahmat Hidayat Lubis, Lc., M.A.',
    faction: 'Fraksi Partai Keadilan Sejahtera',
    factionShort: 'PKS',
    factionColor: '#EA580C',
    dapil: 'Sumatera Utara I (Kota Medan, Deli Serdang, Serdang Bedagai, Tebing Tinggi)',
    regionKeywords: ['medan', 'deli serdang', 'sumatera utara', 'sumut', 'tebing tinggi', '201'],
    akd: ['Komisi VIII', 'Badan Aspirasi Masyarakat'],
    role: 'Anggota Komisi VIII & Badan Aspirasi Masyarakat (BAM)',
    attendanceRate: 96,
    billsSponsored: 6,
    interventionsCount: 47,
    bio: 'Aktif mengawal isu penyelenggaraan ibadah haji, mitigasi bencana di wilayah Sumatera, serta menindaklanjuti pengaduan masyarakat melalui BAM.',
    recentActivities: [
      { date: '13 Nov 2026', type: 'RDPU', title: 'Audiensi Badan Aspirasi Masyarakat dengan perwakilan guru honorer Sumut' },
      { date: '06 Nov 2026', type: 'Rapat Kerja', title: 'Evaluasi kesiapan logistik BNPB menghadapi musim hujan' },
    ],
  },
  {
    id: 'ayu-lestari-kencana',
    name: 'Ni Luh Ayu Lestari Kencana, S.E.',
    faction: 'Fraksi Partai NasDem',
    factionShort: 'NasDem',
    factionColor: '#1D4ED8',
    dapil: 'Bali (Seluruh Kabupaten/Kota di Provinsi Bali)',
    regionKeywords: ['bali', 'denpasar', 'badung', 'gianyar', 'buleleng', '801'],
    akd: ['Komisi VII', 'Badan Legislasi'],
    role: 'Anggota Komisi VII (Perindustrian, UMKM, Ekonomi Kreatif & Pariwisata)',
    attendanceRate: 93,
    billsSponsored: 5,
    interventionsCount: 29,
    bio: 'Mendorong ekonomi kreatif berbasis budaya lokal, transisi energi bersih di kawasan pariwisata, serta kemudahan perizinan bagi pelaku usaha mikro.',
    recentActivities: [
      { date: '10 Nov 2026', type: 'Paripurna', title: 'Menyampaikan pandangan akhir fraksi pada pengesahan RUU PPRT' },
      { date: '04 Nov 2026', type: 'Rapat Kerja', title: 'Raker bersama Menteri Pariwisata terkait kualitas destinasi berkelanjutan' },
    ],
  },
  {
    id: 'muhammad-faisal-amir',
    name: 'Muhammad Faisal Amir, S.T., M.T.',
    faction: 'Fraksi Partai Kebangkitan Bangsa',
    factionShort: 'PKB',
    factionColor: '#15803D',
    dapil: 'Sulawesi Selatan I (Makassar, Gowa, Takalar, Jeneponto, Bantaeng, Selayar)',
    regionKeywords: ['makassar', 'gowa', 'sulawesi selatan', 'sulsel', '901'],
    akd: ['Komisi V', 'MKD'],
    role: 'Anggota Komisi V (Infrastruktur, Perhubungan & Pembangunan Daerah)',
    attendanceRate: 89,
    billsSponsored: 3,
    interventionsCount: 33,
    bio: 'Insinyur sipil yang mengawal pemerataan konektivitas maritim kawasan timur Indonesia, program perumahan rakyat, dan keselamatan transportasi.',
    recentActivities: [
      { date: '12 Nov 2026', type: 'Rapat Kerja', title: 'Raker Komisi V dengan Menteri Perhubungan mengenai tol laut 2027' },
      { date: '27 Okt 2026', type: 'Kunker', title: 'Pengawasan proyek irigasi dan bendungan di Kabupaten Gowa' },
    ],
  },
  {
    id: 'dimas-aryo-prakoso',
    name: 'Dimas Aryo Prakoso, S.I.P., M.Sc.',
    faction: 'Fraksi Partai Demokrat',
    factionShort: 'Demokrat',
    factionColor: '#2563EB',
    dapil: 'DI Yogyakarta (Sleman, Bantul, Kulon Progo, Gunungkidul, Kota Yogyakarta)',
    regionKeywords: ['yogyakarta', 'jogja', 'sleman', 'bantul', 'diy', '551'],
    akd: ['Komisi I', 'Badan Kerja Sama Antar Parlemen (BKSAP)'],
    role: 'Anggota Komisi I & BKSAP',
    attendanceRate: 95,
    billsSponsored: 4,
    interventionsCount: 36,
    bio: 'Peneliti kebijakan publik dan hubungan internasional yang fokus pada tata kelola ruang digital, literasi siber, dan diplomasi parlementer ASEAN.',
    recentActivities: [
      { date: '14 Nov 2026', type: 'RDPU', title: 'Menyerap masukan civitas akademika UGM terkait RUU Tata Kelola AI' },
      { date: '07 Nov 2026', type: 'Rapat Kerja', title: 'Raker Komisi I dengan Kemenlu mengenai perlindungan WNI di kawasan konflik' },
    ],
  },
  {
    id: 'citra-anggraini-putri',
    name: 'dr. Citra Anggraini Putri, M.K.M.',
    faction: 'Fraksi Partai Amanat Nasional',
    factionShort: 'PAN',
    factionColor: '#0284C7',
    dapil: 'Jawa Tengah V (Kota Surakarta, Kab. Sukoharjo, Klaten, Boyolali)',
    regionKeywords: ['solo', 'surakarta', 'sukoharjo', 'klaten', 'boyolali', 'jawa tengah', 'jateng', '571'],
    akd: ['Komisi IX', 'Badan Musyawarah'],
    role: 'Anggota Komisi IX (Kesehatan, Ketenagakerjaan & Jaminan Sosial)',
    attendanceRate: 92,
    billsSponsored: 5,
    interventionsCount: 44,
    bio: 'Dokter dan pemerhati kesehatan masyarakat yang mengawal transformasi layanan primer puskesmas, pembiayaan JKN-BPJS Kesehatan, serta keselamatan kerja sektor informal.',
    recentActivities: [
      { date: '11 Nov 2026', type: 'Rapat Kerja', title: 'Raker Komisi IX dengan Kemenkes & BPJS Kesehatan soal kelas rawat inap standar' },
      { date: '02 Nov 2026', type: 'Kunker', title: 'Peninjauan kesiapan fasilitas layanan ibu & anak di RSUD Boyolali' },
    ],
  },
];

export const TODAY_SESSIONS: ParliamentarySession[] = [
  {
    id: 'sidang-1',
    time: '09:30 – 12:30 WIB',
    date: '14 November 2026',
    type: 'Rapat Paripurna',
    akd: 'Paripurna DPR RI',
    title: 'Rapat Paripurna ke-10 Masa Persidangan II Tahun Sidang 2026–2027',
    location: 'Gedung Nusantara II, Ruang Rapat Paripurna',
    status: 'Selesai',
    liveStreamAvailable: true,
    agendaItems: [
      'Penyampaian Ikhtisar Hasil Pemeriksaan Semester (IHPS) I Tahun 2026 oleh BPK RI',
      'Persetujuan Perpanjangan Waktu Pembahasan 2 RUU Prioritas',
      'Pelantikan Pengganti Antarwaktu (PAW) Anggota DPR RI',
    ],
  },
  {
    id: 'sidang-2',
    time: '13:30 – 16:30 WIB',
    date: '14 November 2026',
    type: 'RDPU',
    akd: 'Komisi I',
    title: 'Rapat Dengar Pendapat Umum (RDPU) RUU Tata Kelola Kecerdasan Artifisial',
    location: 'Gedung Nusantara I, Ruang Rapat Komisi I',
    status: 'Berlangsung',
    liveStreamAvailable: true,
    agendaItems: [
      'Mendengarkan masukan Koalisi Riset AI Universitas Indonesia, ITB, dan UGM',
      'Masukan asosiasi industri kreatif terkait perlindungan hak cipta data latih AI',
    ],
  },
  {
    id: 'sidang-3',
    time: '14:00 – 17:00 WIB',
    date: '14 November 2026',
    type: 'Rapat Kerja (Raker)',
    akd: 'Komisi III',
    title: 'Rapat Panja Pembahasan DIM RUU Perampasan Aset bersama Kemenkum & Kejaksaan Agung',
    location: 'Gedung Nusantara II, Ruang Panja B',
    status: 'Berlangsung',
    liveStreamAvailable: false,
    agendaItems: [
      'Pendalaman DIM Klaster IV: Mekanisme Pengelolaan Aset Sitaan & Lelang',
      'Sinkronisasi ketentuan perlindungan pihak ketiga beritikad baik',
    ],
  },
  {
    id: 'sidang-4',
    time: '10:00 – 13:00 WIB',
    date: '15 November 2026',
    type: 'Rapat Banggar',
    akd: 'Badan Anggaran (Banggar)',
    title: 'Rapat Kerja Evaluasi Penyerapan Belanja K/L Triwulan III & Proyeksi Akhir Tahun',
    location: 'Gedung Nusantara II, Ruang Rapat Banggar',
    status: 'Terjadwal',
    liveStreamAvailable: true,
    agendaItems: [
      'Paparan Menteri Keuangan terkait realisasi Transfer ke Daerah (TKD)',
      'Evaluasi program subsidi energi tepat sasaran',
    ],
  },
];

export const HANSARD_ENTRIES: HansardEntry[] = [
  {
    id: 'h-1',
    sessionTitle: 'RDPU Komisi I — RUU Tata Kelola AI',
    date: '14 Nov 2026 • 14:15 WIB',
    akd: 'Komisi I',
    speaker: 'Siti Nurhaliza Rahmawati, S.Sos., M.Si.',
    faction: 'PDI-P',
    factionColor: '#991B1B',
    topic: 'Transparansi Algoritma & Hak Cipta Kreator',
    excerpt:
      '“Kami di Komisi I memandang bahwa pengaturan AI tidak boleh hanya menyalin kerangka negara lain. Kewajiban transparansi data latih harus melindungi karya jurnalistik, seni, dan riset lokal tanpa membebani pengembang rintisan dalam negeri dengan biaya kepatuhan yang mematikan.”',
    decisionTag: 'Masuk dalam Catatan Penyusunan Draf Pasal 14',
  },
  {
    id: 'h-2',
    sessionTitle: 'Panja RUU Perampasan Aset — Komisi III',
    date: '12 Nov 2026 • 15:40 WIB',
    akd: 'Komisi III',
    speaker: 'Dr. H. Andika Pratama, S.H., M.H.',
    faction: 'Gerindra',
    factionColor: '#B91C1C',
    topic: 'Pembuktian Terbalik & Hak Pihak Ketiga',
    excerpt:
      '“Prinsip perampasan aset tanpa pemidanaan harus tetap tunduk pada penetapan pengadilan yang terbuka. Pihak ketiga yang memperoleh aset secara sah dan beritikad baik wajib diberi ruang pembuktian dalam jangka waktu yang cukup sebelum aset dilelang negara.”',
    decisionTag: 'DIM #89 Disetujui dengan Perbaikan Redaksi',
  },
  {
    id: 'h-3',
    sessionTitle: 'Rapat Paripurna ke-9 — Pengesahan RUU PPRT',
    date: '10 Nov 2026 • 11:20 WIB',
    akd: 'Paripurna DPR RI',
    speaker: 'Ni Luh Ayu Lestari Kencana, S.E.',
    faction: 'NasDem',
    factionColor: '#1D4ED8',
    topic: 'Pendapat Akhir Fraksi terhadap RUU PPRT',
    excerpt:
      '“Setelah penantian panjang lebih dari dua dekade, persetujuan RUU PPRT hari ini menegaskan kehadiran negara bagi jutaan pekerja rumah tangga. Kami meminta pemerintah segera menerbitkan peraturan pelaksana dalam waktu paling lama 6 bulan sejak diundangkan.”',
    decisionTag: 'Disetujui Menjadi Undang-Undang',
  },
  {
    id: 'h-4',
    sessionTitle: 'Audiensi Badan Aspirasi Masyarakat (BAM)',
    date: '13 Nov 2026 • 10:50 WIB',
    akd: 'Badan Aspirasi Masyarakat',
    speaker: 'H. Rahmat Hidayat Lubis, Lc., M.A.',
    faction: 'PKS',
    factionColor: '#EA580C',
    topic: 'Tindak Lanjut Pengaduan Formasi Guru Honorer',
    excerpt:
      '“Badan Aspirasi Masyarakat akan meneruskan seluruh berkas pengaduan ini secara resmi kepada Komisi X dan Kementerian Pendidikan Dasar dan Menengah agar ada kejelasan kuota pengangkatan pada formasi daerah tertinggal.”',
    decisionTag: 'Diteruskan ke Komisi X untuk Raker',
  },
  {
    id: 'h-5',
    sessionTitle: 'Raker Komisi IX bersama Menteri Kesehatan & Direksi BPJS',
    date: '11 Nov 2026 • 13:45 WIB',
    akd: 'Komisi IX',
    speaker: 'dr. Citra Anggraini Putri, M.K.M.',
    faction: 'PAN',
    factionColor: '#0284C7',
    topic: 'Implementasi Kelas Rawat Inap Standar (KRIS) & Rujukan Daerah',
    excerpt:
      '“Kami meminta Kementerian Kesehatan memastikan seluruh RSUD tipe C di kabupaten telah memenuhi 12 kriteria sarana KRIS sebelum penyesuaian iuran diberlakukan, agar tidak terjadi penumpukan rujukan di kota besar.”',
    decisionTag: 'Kesimpulan Raker Poin 3: Audit Kesiapan RSUD per Q1 2027',
  },
  {
    id: 'h-6',
    sessionTitle: 'RDPU Komisi I — RUU Tata Kelola AI',
    date: '14 Nov 2026 • 14:40 WIB',
    akd: 'Komisi I',
    speaker: 'Dimas Aryo Prakoso, S.I.P., M.Sc.',
    faction: 'Demokrat',
    factionColor: '#2563EB',
    topic: 'Koordinasi Pengawas AI dan UU Perlindungan Data Pribadi',
    excerpt:
      '“Kita tidak perlu membentuk birokrasi baru yang gemuk. Pengawasan risiko tinggi AI dapat disinergikan dengan otoritas pelindungan data pribadi sehingga kepastian regulasi bagi industri teknologi tetap terjaga.”',
    decisionTag: 'Masuk dalam Matriks Perbandingan Kelembagaan',
  },
];

export const AKD_LIST: AKD[] = [
  { id: 'komisi-1', code: 'Komisi I', name: 'Pertahanan, Luar Negeri, Komunikasi & Informatika', category: 'Komisi', chair: 'Utut Adianto', chairFaction: 'PDI-P', scope: 'Pertahanan, Hubungan Luar Negeri, Intelijen, Digital & Penyiaran', partners: ['Kemenhan', 'Kemenlu', 'Kemenkomdigi', 'TNI', 'BIN', 'KPI'] },
  { id: 'komisi-2', code: 'Komisi II', name: 'Pemerintahan Dalam Negeri, Pertanahan & Aparatur', category: 'Komisi', chair: 'Muhammad Rifqinizamy Karsayuda', chairFaction: 'NasDem', scope: 'Pemilu, Otda, ASN, Pertanahan & Reforma Agraria', partners: ['Kemendagri', 'Kementerian ATR/BPN', 'KemenPAN-RB', 'KPU', 'Bawaslu', 'Ombudsman'] },
  { id: 'komisi-3', code: 'Komisi III', name: 'Penegakan Hukum', category: 'Komisi', chair: 'Habiburokhman', chairFaction: 'Gerindra', scope: 'Hukum Pidana, Kejaksaan, Kepolisian, Pemberantasan Korupsi', partners: ['Kejaksaan Agung', 'Polri', 'KPK', 'PPATK', 'Mahkamah Agung', 'MK'] },
  { id: 'komisi-4', code: 'Komisi IV', name: 'Pertanian, Kehutanan & Kelautan', category: 'Komisi', chair: 'Siti Hediati Soeharto', chairFaction: 'Gerindra', scope: 'Ketahanan Pangan, Pertanian, Kehutanan, Perikanan & Kelautan', partners: ['Kementan', 'Kemenhut', 'KKP', 'Bulog', 'Badan Pangan Nasional'] },
  { id: 'komisi-5', code: 'Komisi V', name: 'Infrastruktur & Perhubungan', category: 'Komisi', chair: 'Lasarus', chairFaction: 'PDI-P', scope: 'Pekerjaan Umum, Perumahan, Transportasi, Desa & Daerah Tertinggal', partners: ['Kementerian PU', 'Kementerian PKP', 'Kemenhub', 'Kemendes PDT', 'BMKG', 'Basarnas'] },
  { id: 'komisi-6', code: 'Komisi VI', name: 'Perdagangan, Kawasan Perdagangan & BUMN', category: 'Komisi', chair: 'Anggia Erma Rini', chairFaction: 'PKB', scope: 'Perdagangan Dalam/Luar Negeri, Koperasi, BUMN, Persaingan Usaha', partners: ['Kemendag', 'Kementerian BUMN', 'Kementerian Koperasi', 'KPPU', 'BPKN'] },
  { id: 'komisi-7', code: 'Komisi VII', name: 'Perindustrian, UMKM, Ekonomi Kreatif & Pariwisata', category: 'Komisi', chair: 'Saleh Partaonan Daulay', chairFaction: 'PAN', scope: 'Industri Manufaktur, UMKM, Pariwisata, Ekonomi Kreatif & Sarana Publikasi', partners: ['Kemenperin', 'Kementerian UMKM', 'Kemenpar', 'Kemenekraf', 'TVRI', 'RRI'] },
  { id: 'komisi-8', code: 'Komisi VIII', name: 'Agama, Sosial, Pemberdayaan Perempuan & Bencana', category: 'Komisi', chair: 'Marwan Dasopang', chairFaction: 'PKB', scope: 'Agama, Haji, Sosial, Perlindungan Anak & Penanggulangan Bencana', partners: ['Kemenag', 'Kemensos', 'KemenPPPA', 'BNPB', 'BPKH', 'KPAI'] },
  { id: 'komisi-9', code: 'Komisi IX', name: 'Kesehatan, Ketenagakerjaan & Jaminan Sosial', category: 'Komisi', chair: 'Felicitas Tallulembang', chairFaction: 'Gerindra', scope: 'Kesehatan Masyarakat, Ketenagakerjaan, BPJS, Perlindungan PMI & Gizi', partners: ['Kemenkes', 'Kemnaker', 'BPOM', 'BPJS Kesehatan', 'BPJS Ketenagakerjaan', 'BP2MI'] },
  { id: 'komisi-10', code: 'Komisi X', name: 'Pendidikan, Kebudayaan, Riset & Olahraga', category: 'Komisi', chair: 'Hetifah Sjaifudian', chairFaction: 'Golkar', scope: 'Pendidikan Dasar-Tinggi, Kebudayaan, Riset, Pemuda & Olahraga', partners: ['Kemendikdasmen', 'Kemendiktisaintek', 'Kemenbud', 'Kemenpora', 'BRIN', 'Perpusnas'] },
  { id: 'komisi-11', code: 'Komisi XI', name: 'Keuangan, Perencanaan Pembangunan & Moneter', category: 'Komisi', chair: 'Mukhamad Misbakhun', chairFaction: 'Golkar', scope: 'APBN, Perpajakan, Perbankan, Pasar Modal & Kebijakan Fiskal', partners: ['Kemenkeu', 'Bappenas', 'Bank Indonesia', 'OJK', 'LPS', 'BPS'] },
  { id: 'komisi-12', code: 'Komisi XII', name: 'ESDM, Lingkungan Hidup & Investasi', category: 'Komisi', chair: 'Bambang Patijaya', chairFaction: 'Golkar', scope: 'Energi, Pertambangan, Transisi Energi, Lingkungan Hidup & Hilirisasi', partners: ['Kementerian ESDM', 'Kementerian LH', 'Kementerian Investasi/BKPM', 'SKK Migas', 'BPH Migas'] },
  { id: 'komisi-13', code: 'Komisi XIII', name: 'Reformasi Regulasi, HAM & Keimigrasian', category: 'Komisi', chair: 'Willy Aditya', chairFaction: 'NasDem', scope: 'Hukum & HAM, Pemasyarakatan, Keimigrasian, Kesekretariatan Negara', partners: ['Kemenkum', 'KemenHAM', 'Kemenimipas', 'Setneg', 'Komnas HAM', 'LPSK'] },
  { id: 'baleg', code: 'Baleg', name: 'Badan Legislasi', category: 'Badan', chair: 'Bob Hasan', chairFaction: 'Gerindra', scope: 'Penyusunan Prolegnas, harmonisasi, pembulatan, dan pemantapan konsepsi RUU', partners: ['Kementerian Hukum', 'DPD RI', 'Badan Keahlian DPR'] },
  { id: 'banggar', code: 'Banggar', name: 'Badan Anggaran', category: 'Badan', chair: 'Said Abdullah', chairFaction: 'PDI-P', scope: 'Pembahasan KEM-PPKF, RUU APBN, Perubahan APBN, dan Pertanggungjawaban APBN', partners: ['Kementerian Keuangan', 'Bappenas', 'Bank Indonesia'] },
  { id: 'bam', code: 'BAM', name: 'Badan Aspirasi Masyarakat', category: 'Badan', chair: 'Netty Prasetiyani', chairFaction: 'PKS', scope: 'Menampung, menelaah, dan menindaklanjuti aspirasi serta pengaduan publik kepada AKD terkait', partners: ['Seluruh Komisi DPR RI', 'Ombudsman RI', 'Kementerian/Lembaga Terkait'] },
  { id: 'mkd', code: 'MKD', name: 'Mahkamah Kehormatan Dewan', category: 'Badan', chair: 'Nazaruddin Dek Gam', chairFaction: 'PAN', scope: 'Menjaga serta menegakkan kehormatan dan keluhuran martabat DPR sebagai lembaga perwakilan', partners: ['Internal DPR RI'] },
  { id: 'bamus', code: 'Bamus', name: 'Badan Musyawarah', category: 'Badan', chair: 'Puan Maharani (Ex-officio Pimpinan DPR)', chairFaction: 'PDI-P', scope: 'Menetapkan acara dan jadwal persidangan DPR RI, termasuk jadwal Rapat Paripurna dan penugasan pembahasan RUU ke AKD', partners: ['Pimpinan DPR RI', 'Pimpinan Fraksi & AKD'] },
  { id: 'bksap', code: 'BKSAP', name: 'Badan Kerja Sama Antar Parlemen', category: 'Badan', chair: 'Mardani Ali Sera', chairFaction: 'PKS', scope: 'Membina, mengembangkan, dan meningkatkan hubungan persahabatan dan kerja sama antara DPR RI dengan parlemen negara lain & organisasi internasional (IPU, AIPA)', partners: ['Kementerian Luar Negeri', 'IPU', 'AIPA'] },
  { id: 'burt', code: 'BURT', name: 'Badan Urusan Rumah Tangga', category: 'Badan', chair: 'Rizki Aulia Rahman Natakusumah', chairFaction: 'Demokrat', scope: 'Menetapkan kebijakan kerumahtanggaan, kesejahteraan, serta anggaran operasional dan keterbukaan fasilitas parlemen bersama Setjen DPR RI', partners: ['Sekretariat Jenderal DPR RI', 'Badan Keahlian DPR'] },
];

export interface AspirationTicket {
  id: string;
  submittedAt: string;
  channel: 'Masukan RUU (RDPU)' | 'Aspirasi BAM';
  target: string;
  senderName: string;
  organization?: string;
  dapil?: string;
  subject: string;
  summary: string;
  status: 'Diterima BAM / Baleg' | 'Telaah Badan Keahlian' | 'Diteruskan ke Komisi Terkait' | 'Dijadwalkan RDPU';
}

export const INITIAL_ASPIRATION_TICKETS: AspirationTicket[] = [
  {
    id: 'BAM-2026-0842',
    submittedAt: '13 Nov 2026',
    channel: 'Aspirasi BAM',
    target: 'Komisi X (via BAM)',
    senderName: 'Forum Guru Honorer Nusantara',
    organization: 'FGHN Wilayah Sumatera Utara',
    dapil: 'Sumatera Utara I',
    subject: 'Kejelasan Kuota Pengangkatan PPPK Guru Daerah Tertinggal 2027',
    summary: 'Mengusulkan penyesuaian formasi afirmasi bagi guru honorer dengan masa pengabdian > 5 tahun pada APBN 2027.',
    status: 'Diteruskan ke Komisi Terkait',
  },
  {
    id: 'RDPU-2026-0319',
    submittedAt: '14 Nov 2026',
    channel: 'Masukan RUU (RDPU)',
    target: 'RUU Tata Kelola AI (Komisi I)',
    senderName: 'Aliansi Jurnalis & Kreator Digital',
    organization: 'AJKD Indonesia',
    subject: 'Usulan Kewajiban Lisensi & Atribusi Data Latih Karya Jurnalistik pada Pasal 14',
    summary: 'Meminta ketentuan persetujuan eksplisit (opt-in) bagi pengembang model AI komersial yang menggunakan arsip media lokal.',
    status: 'Dijadwalkan RDPU',
  },
  {
    id: 'RDPU-2026-0295',
    submittedAt: '10 Nov 2026',
    channel: 'Masukan RUU (RDPU)',
    target: 'RUU Perampasan Aset (Komisi III)',
    senderName: 'Dr. Rina Kusumawardhani',
    organization: 'Pusat Studi Hukum & Antikorupsi',
    subject: 'Jaminan Mekanisme Keberatan Pihak Ketiga Beritikad Baik (Pasal 23)',
    summary: 'Merekomendasikan tenggat 30 hari kerja dan bantuan hukum wajib dalam proses sanggahan penyitaan aset.',
    status: 'Telaah Badan Keahlian',
  },
];
