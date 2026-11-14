import {
  AKD_LIST,
  BILLS,
  HANSARD_ENTRIES,
  MEMBERS,
  TODAY_SESSIONS,
} from '../data/parliamentData';
import {
  DAPIL_LIST,
  FRAKSI_LIST,
  PROLEGNAS_PRIORITAS,
} from '../data/referenceData';

export type SearchCategory =
  | 'Panduan & Aksi'
  | 'RUU & UU'
  | 'Anggota'
  | 'Dapil'
  | 'Fraksi'
  | 'Komisi & Badan'
  | 'Sidang'
  | 'Risalah';

export interface SearchResult {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle: string;
  to: string;
  matchedAlias?: string;
}

interface IndexedItem extends SearchResult {
  titleLower: string;
  subtitleLower: string;
  aliases: string[];
  aliasesLower: string[];
  bodyLower: string;
}

const BILL_ALIASES: Record<string, string[]> = {
  'ruu-perampasan-aset': [
    'korupsi',
    'koruptor',
    'sita aset',
    'pencucian uang',
    'tppu',
    'harta haram',
    'uang haram',
    'kpk',
    'suap',
    'dim',
    'poin perubahan pasal',
  ],
  'ruu-perlindungan-pekerja-rumah-tangga': [
    'prt',
    'art',
    'pembantu',
    'asisten rumah tangga',
    'pekerja domestik',
    'upah',
    'gaji',
    'kontrak kerja',
    'paripurna',
    'sah jadi uu',
  ],
  'ruu-kedaulatan-data-ai': [
    'ai',
    'kecerdasan buatan',
    'chatgpt',
    'algoritma',
    'privasi',
    'data pribadi',
    'internet',
    'startup',
    'kreator',
    'hak cipta',
    'siber',
    'digital',
    'komdigi',
  ],
  'ruu-apbn-2027': [
    'anggaran negara',
    'belanja negara',
    'pajak',
    'subsidi',
    'bbm',
    'listrik',
    'bansos',
    'gaji asn',
    'utang negara',
    'ekonomi',
  ],
  'ruu-masyarakat-hukum-adat': [
    'tanah adat',
    'wilayah adat',
    'hutan adat',
    'suku',
    'konflik agraria',
    'sengketa tanah',
    'lingkungan',
  ],
  'ruu-perubahan-uu-mk-kumulatif': [
    'swiss',
    'perjanjian internasional',
    'aset luar negeri',
    'buronan',
    'bantuan hukum',
    'rekening luar negeri',
    'kumulatif terbuka',
  ],
};

const AKD_ALIASES: Record<string, string[]> = {
  'komisi-1': [
    'tni',
    'militer',
    'tentara',
    'internet',
    'sinyal',
    'blokir',
    'hoaks',
    'penyiaran',
    'tv',
    'judi online',
    'komdigi',
    'luar negeri',
    'keamanan siber',
    'ai',
  ],
  'komisi-2': [
    'ktp',
    'dukcapil',
    'pemilu',
    'pilkada',
    'pns',
    'asn',
    'honorer',
    'pppk',
    'sertifikat tanah',
    'bpn',
    'mafia tanah',
    'kepala daerah',
  ],
  'komisi-3': [
    'polisi',
    'polri',
    'jaksa',
    'pengadilan',
    'hakim',
    'korupsi',
    'kpk',
    'pidana',
    'kuhap',
    'narkoba',
    'hukum',
    'sita aset',
  ],
  'komisi-4': [
    'petani',
    'pupuk',
    'beras',
    'sembako',
    'harga pangan',
    'nelayan',
    'ikan',
    'hutan',
    'kebakaran hutan',
    'sawit',
  ],
  'komisi-5': [
    'jalan rusak',
    'jalan tol',
    'jembatan',
    'ojol',
    'ojek online',
    'transportasi',
    'kereta',
    'bandara',
    'pelabuhan',
    'banjir',
    'rumah subsidi',
    'kpr',
    'dana desa',
  ],
  'komisi-6': [
    'bumn',
    'pln',
    'pertamina',
    'garuda',
    'harga barang',
    'impor',
    'ekspor',
    'koperasi',
    'monopoli',
    'konsumen',
    'penipuan belanja',
  ],
  'komisi-7': [
    'umkm',
    'pedagang kecil',
    'warung',
    'pabrik',
    'industri',
    'pariwisata',
    'wisata',
    'ekonomi kreatif',
  ],
  'komisi-8': [
    'haji',
    'umrah',
    'agama',
    'bansos',
    'pkh',
    'bencana alam',
    'gempa',
    'kekerasan anak',
    'kdrt',
    'perempuan',
  ],
  'komisi-9': [
    'rumah sakit',
    'bpjs',
    'dokter',
    'obat',
    'kesehatan',
    'gaji',
    'ump',
    'umk',
    'phk',
    'buruh',
    'prt',
    'pembantu',
    'tki',
    'pekerja migran',
  ],
  'komisi-10': [
    'sekolah',
    'kuliah',
    'ukt',
    'kampus',
    'guru',
    'dosen',
    'beasiswa',
    'kip',
    'kurikulum',
    'sepak bola',
    'olahraga',
  ],
  'komisi-11': [
    'pajak',
    'ppn',
    'npwp',
    'pinjol',
    'bank',
    'kredit',
    'bunga',
    'inflasi',
    'rupiah',
    'ojk',
    'asuransi',
    'apbn',
  ],
  'komisi-12': [
    'listrik',
    'bbm',
    'bensin',
    'gas lpg',
    'tambang',
    'nikel',
    'batubara',
    'polusi',
    'sampah',
    'energi surya',
    'ebt',
  ],
  'komisi-13': [
    'imigrasi',
    'paspor',
    'visa',
    'lapas',
    'penjara',
    'ham',
    'pelanggaran ham',
    'perlindungan saksi',
  ],
  baleg: [
    'buat uu',
    'daftar prioritas ruu',
    'prolegnas',
    'harmonisasi',
    'rancangan undang-undang',
    'pembentukan uu',
  ],
  banggar: [
    'apbn',
    'uang negara',
    'anggaran belanja',
    'defisit',
    'subsidi',
    'rapbn',
  ],
  bam: [
    'pengaduan',
    'lapor',
    'keluhan warga',
    'aspirasi',
    'petisi',
    'kirim masukan',
    'protes',
  ],
  mkd: [
    'etik anggota',
    'pelanggaran dpr',
    'bolos rapat',
    'kode etik',
    'pengaduan anggota',
  ],
  bamus: ['jadwal rapat', 'agenda sidang', 'penentuan jadwal paripurna'],
  bksap: ['parlemen dunia', 'diplomasi', 'hubungan internasional', 'asean'],
  burt: ['gedung dpr', 'anggaran internal', 'fasilitas anggota', 'tunjangan dpr'],
};

/** Padanan istilah awam -> kata kunci resmi parlemen */
const PLAIN_TERM_SYNONYMS: Record<string, string[]> = {
  notulen: ['risalah', 'catatan rapat', 'transkrip'],
  transkrip: ['risalah', 'catatan rapat', 'notulen'],
  risalah: ['catatan resmi rapat', 'notulen', 'transkrip'],
  lapor: ['pengaduan', 'aspirasi', 'suara warga', 'bam'],
  aduan: ['pengaduan', 'aspirasi', 'suara warga', 'bam'],
  pengaduan: ['lapor', 'aspirasi', 'suara warga', 'bam'],
  keluhan: ['pengaduan', 'aspirasi', 'suara warga', 'bam'],
  aspirasi: ['suara warga', 'bam', 'rdpu', 'kirim masukan'],
  curhat: ['rdpu', 'dengar pendapat', 'suara warga', 'bam'],
  nonton: ['tv parlemen', 'siaran langsung', 'live', 'sidang'],
  live: ['siaran langsung', 'tv parlemen', 'berlangsung'],
  streaming: ['siaran langsung', 'tv parlemen'],
  pasal: ['dim', 'poin perubahan pasal', 'naskah akademik', 'ruu'],
  dim: ['poin perubahan pasal', 'daftar inventarisasi masalah', 'pasal'],
  prolegnas: ['daftar prioritas ruu', 'rencana pembuatan uu', 'baleg'],
  panja: ['kelompok kerja pasal', 'pembahasan tingkat i'],
  rdpu: ['rapat dengar pendapat umum', 'masukan masyarakat', 'audiensi'],
  raker: ['rapat kerja', 'rapat dengan menteri'],
  paripurna: ['sidang pleno', 'pengambilan keputusan akhir'],
  akd: ['komisi', 'badan', 'alat kelengkapan dewan'],
  dapil: ['daerah pemilihan', 'wilayah pemilih', 'kota', 'provinsi'],
  partai: ['fraksi', 'anggota'],
  fraksi: ['partai', 'kelompok partai dpr'],
  wakil: ['anggota dpr', 'dapil', 'daerah pemilihan'],
};

const GUIDE_ITEMS: IndexedItem[] = [
  {
    id: 'guide-partisipasi',
    category: 'Panduan & Aksi',
    title: 'Suara Warga - Kirim Pengaduan atau Usulan Pasal RUU',
    subtitle: 'Saluran resmi masukan publik (BAM) dan permohonan dengar pendapat (RDPU)',
    to: '/partisipasi',
    aliases: [
      'lapor',
      'aduan',
      'pengaduan',
      'keluhan',
      'protes',
      'usulan warga',
      'kirim masukan',
      'aspirasi',
      'petisi',
      'audiensi',
      'dengar pendapat',
      'rdpu',
      'bam',
    ],
    aliasesLower: [],
    titleLower: '',
    subtitleLower: '',
    bodyLower: '',
  },
  {
    id: 'guide-legislasi',
    category: 'Panduan & Aksi',
    title: 'Daftar RUU & Tahapan Pembuatan Undang-Undang',
    subtitle: 'Lacak prioritas tahunan (Prolegnas), 5 tahap RUU, dan perubahan pasal (DIM)',
    to: '/legislasi',
    aliases: [
      'prolegnas',
      'daftar prioritas',
      'cara buat uu',
      'tahapan ruu',
      'dim',
      'poin perubahan pasal',
      'naskah akademik',
      'panja',
      'draf ruu',
    ],
    aliasesLower: [],
    titleLower: '',
    subtitleLower: '',
    bodyLower: '',
  },
  {
    id: 'guide-anggota',
    category: 'Panduan & Aksi',
    title: 'Cari Wakil Rakyat Berdasarkan Kota / Daerah Pemilihan (Dapil)',
    subtitle: 'Temukan anggota DPR dari wilayah Anda, fraksi/partai, dan rekam kehadirannya',
    to: '/anggota',
    aliases: [
      'dapil',
      'daerah pemilihan',
      'wakil saya',
      'anggota daerah',
      'kota saya',
      'provinsi',
      'fraksi',
      'partai',
      'absensi anggota',
    ],
    aliasesLower: [],
    titleLower: '',
    subtitleLower: '',
    bodyLower: '',
  },
  {
    id: 'guide-sidang',
    category: 'Panduan & Aksi',
    title: 'TV Parlemen & Catatan Resmi Sidang (Risalah)',
    subtitle: 'Tonton siaran langsung rapat atau baca notulen/transkrip pernyataan anggota',
    to: '/sidang?live=active',
    aliases: [
      'nonton rapat',
      'siaran langsung',
      'tv parlemen',
      'streaming',
      'live',
      'risalah',
      'notulen',
      'transkrip',
      'rekaman rapat',
      'jadwal hari ini',
    ],
    aliasesLower: [],
    titleLower: '',
    subtitleLower: '',
    bodyLower: '',
  },
];

function buildSearchIndex(): IndexedItem[] {
  const prolegnasByBillId = new Map(
    PROLEGNAS_PRIORITAS.filter((p) => p.billId).map((p) => [p.billId as string, p]),
  );

  const raw: IndexedItem[] = [
    ...GUIDE_ITEMS,
    ...BILLS.map((bill) => {
      const extraKeywords = prolegnasByBillId.get(bill.id)?.keywords ?? [];
      const aliases = [
        ...(BILL_ALIASES[bill.id] ?? []),
        ...extraKeywords,
        'ruu',
        'undang-undang',
        'rancangan',
        bill.category,
        bill.proposer,
      ];
      return {
        id: `bill-${bill.id}`,
        category: 'RUU & UU' as const,
        title: bill.shortTitle,
        subtitle: `${bill.committee} • ${bill.stageStatus}`,
        to: `/legislasi/${bill.id}`,
        aliases,
        aliasesLower: aliases.map((a) => a.toLowerCase()),
        titleLower: `${bill.shortTitle} ${bill.title}`.toLowerCase(),
        subtitleLower: `${bill.committee} ${bill.stageStatus}`.toLowerCase(),
        bodyLower: `${bill.summary} ${bill.committee} ${bill.category}`.toLowerCase(),
      };
    }),
    ...PROLEGNAS_PRIORITAS.filter((p) => !p.billId).map((p) => {
      const aliases = [
        ...p.keywords,
        'prolegnas',
        'prolegnas prioritas',
        'ruu',
        p.proposer,
        p.committee,
      ];
      return {
        id: `prolegnas-${p.id}`,
        category: 'RUU & UU' as const,
        title: p.shortTitle,
        subtitle: `Prolegnas Prioritas • ${p.committee} • ${p.statusSummary}`,
        to: `/legislasi?q=${encodeURIComponent(p.shortTitle)}`,
        aliases,
        aliasesLower: aliases.map((a) => a.toLowerCase()),
        titleLower: `${p.shortTitle} ${p.title}`.toLowerCase(),
        subtitleLower: `prolegnas ${p.committee} ${p.statusSummary}`.toLowerCase(),
        bodyLower: `${p.title} ${p.proposer} ${p.committee}`.toLowerCase(),
      };
    }),
    ...MEMBERS.map((member) => {
      const aliases = [
        'anggota dpr',
        'wakil rakyat',
        'dapil',
        'daerah pemilihan',
        'fraksi',
        'partai',
        member.faction,
        ...member.akd,
      ];
      return {
        id: `member-${member.id}`,
        category: 'Anggota' as const,
        title: member.name,
        subtitle: `${member.faction} • ${member.dapil}`,
        to: `/anggota/${member.id}`,
        aliases,
        aliasesLower: aliases.map((a) => a.toLowerCase()),
        titleLower: member.name.toLowerCase(),
        subtitleLower: `${member.faction} ${member.dapil}`.toLowerCase(),
        bodyLower: `${member.role} ${member.bio} ${member.akd.join(' ')}`.toLowerCase(),
      };
    }),
    ...DAPIL_LIST.map((d) => {
      const regionPreview =
        d.regions.length > 3
          ? `${d.regions.slice(0, 3).join(', ')} (+${d.regions.length - 3} wilayah)`
          : d.regions.join(', ');
      const aliases = [
        'dapil',
        'daerah pemilihan',
        d.province,
        d.islandGroup,
        ...d.regions,
        ...d.keywords,
      ];
      return {
        id: `dapil-${d.id}`,
        category: 'Dapil' as const,
        title: `Dapil ${d.name} (${d.seats} Kursi)`,
        subtitle: `${d.province} • ${regionPreview}`,
        to: `/anggota?dapil=${encodeURIComponent(d.name)}`,
        aliases,
        aliasesLower: aliases.map((a) => a.toLowerCase()),
        titleLower: `dapil ${d.name} ${d.province}`.toLowerCase(),
        subtitleLower: `${d.province} ${d.regions.join(' ')}`.toLowerCase(),
        bodyLower: `${d.regions.join(' ')} ${d.keywords.join(' ')}`.toLowerCase(),
      };
    }),
    ...FRAKSI_LIST.map((f) => {
      const displayName = f.name.toLowerCase().includes(f.shortName.toLowerCase())
        ? f.name
        : `${f.name} (${f.shortName})`;
      const aliases = [
        'fraksi',
        'partai',
        'kursi dpr',
        f.code,
        f.shortName,
        ...f.keywords,
      ];
      return {
        id: `fraksi-${f.id}`,
        category: 'Fraksi' as const,
        title: `${displayName} (${f.seats} Kursi)`,
        subtitle: `${f.code} • ${f.sharePct.toString().replace('.', ',')}% kursi DPR RI 2024-2029`,
        to: `/anggota?fraksi=${encodeURIComponent(f.shortName)}`,
        aliases,
        aliasesLower: aliases.map((a) => a.toLowerCase()),
        titleLower: `${f.name} ${f.shortName} ${f.code}`.toLowerCase(),
        subtitleLower: `${f.code} ${f.shortName}`.toLowerCase(),
        bodyLower: `${f.keywords.join(' ')}`.toLowerCase(),
      };
    }),
    ...AKD_LIST.map((akd) => {
      const aliases = [
        ...(AKD_ALIASES[akd.id] ?? []),
        akd.category === 'Komisi' ? 'komisi dpr' : 'badan dpr',
        'alat kelengkapan dewan',
        'akd',
        ...akd.partners,
      ];
      return {
        id: `akd-${akd.id}`,
        category: 'Komisi & Badan' as const,
        title: `${akd.code} - ${akd.name}`,
        subtitle: akd.scope,
        to: `/akd?q=${encodeURIComponent(akd.code)}`,
        aliases,
        aliasesLower: aliases.map((a) => a.toLowerCase()),
        titleLower: `${akd.code} ${akd.name}`.toLowerCase(),
        subtitleLower: akd.scope.toLowerCase(),
        bodyLower: `${akd.chair} ${akd.partners.join(' ')}`.toLowerCase(),
      };
    }),
    ...TODAY_SESSIONS.map((session) => {
      const aliases = [
        'rapat hari ini',
        'jadwal sidang',
        'siaran langsung',
        'tv parlemen',
        'nonton rapat',
        'live',
        session.type,
        session.status,
      ];
      return {
        id: `session-${session.id}`,
        category: 'Sidang' as const,
        title: session.title,
        subtitle: `${session.akd} • ${session.time} (${session.status})`,
        to: session.liveStreamAvailable ? `/sidang?live=${session.id}` : '/sidang',
        aliases,
        aliasesLower: aliases.map((a) => a.toLowerCase()),
        titleLower: session.title.toLowerCase(),
        subtitleLower: `${session.akd} ${session.location} ${session.status}`.toLowerCase(),
        bodyLower: `${session.agendaItems.join(' ')} ${session.type}`.toLowerCase(),
      };
    }),
    ...HANSARD_ENTRIES.map((entry) => {
      const aliases = [
        'risalah',
        'notulen',
        'catatan rapat',
        'transkrip',
        'pernyataan anggota',
        'kutipan sidang',
        entry.akd,
        entry.faction,
      ];
      return {
        id: `risalah-${entry.id}`,
        category: 'Risalah' as const,
        title: `${entry.topic} (${entry.speaker})`,
        subtitle: `${entry.akd} • ${entry.date}`,
        to: `/sidang?tab=risalah&q=${encodeURIComponent(entry.topic)}`,
        aliases,
        aliasesLower: aliases.map((a) => a.toLowerCase()),
        titleLower: `${entry.topic} ${entry.speaker}`.toLowerCase(),
        subtitleLower: `${entry.akd} ${entry.sessionTitle}`.toLowerCase(),
        bodyLower: `${entry.excerpt} ${entry.decisionTag ?? ''}`.toLowerCase(),
      };
    }),
  ];

  return raw.map((item) => ({
    ...item,
    titleLower: item.titleLower || item.title.toLowerCase(),
    subtitleLower: item.subtitleLower || item.subtitle.toLowerCase(),
    aliasesLower:
      item.aliasesLower.length > 0
        ? item.aliasesLower
        : item.aliases.map((a) => a.toLowerCase()),
  }));
}

const SEARCH_INDEX = buildSearchIndex();

export const QUICK_SUGGESTIONS: SearchResult[] = [
  {
    id: 'quick-live',
    category: 'Sidang',
    title: 'Tonton Siaran Langsung TV Parlemen',
    subtitle: 'Langsung buka pemutar sidang yang sedang berlangsung',
    to: '/sidang?live=active',
  },
  {
    id: 'quick-ruu',
    category: 'RUU & UU',
    title: 'RUU Perampasan Aset Tindak Pidana',
    subtitle: 'Pembicaraan Tingkat I • Komisi III DPR RI',
    to: '/legislasi/ruu-perampasan-aset',
    matchedAlias: 'korupsi / sita aset',
  },
  {
    id: 'quick-lapor',
    category: 'Panduan & Aksi',
    title: 'Suara Warga - Kirim Keluhan atau Usulan Pasal',
    subtitle: 'Pengaduan publik & permohonan Rapat Dengar Pendapat (RDPU)',
    to: '/partisipasi',
    matchedAlias: 'lapor / pengaduan / aspirasi',
  },
  {
    id: 'quick-risalah',
    category: 'Risalah',
    title: 'Catatan Resmi Sidang (Risalah)',
    subtitle: 'Notulen & kutipan pernyataan anggota di rapat beserta keputusannya',
    to: '/sidang?tab=risalah',
    matchedAlias: 'notulen / transkrip rapat',
  },
];

function expandTokens(rawQuery: string): string[] {
  const baseTokens = rawQuery
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);

  if (baseTokens.length === 0 && rawQuery.trim()) {
    return [rawQuery.trim().toLowerCase()];
  }
  return baseTokens;
}

export function searchParliament(rawQuery: string): SearchResult[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return QUICK_SUGGESTIONS;

  const tokens = expandTokens(q);

  const scored: Array<{ score: number; item: SearchResult }> = [];

  for (const item of SEARCH_INDEX) {
    let score = 0;
    let matchedAlias: string | undefined;
    let matchedCount = 0;

    // Full phrase bonuses
    if (item.titleLower === q) score += 140;
    else if (item.titleLower.startsWith(q)) score += 90;
    else if (item.titleLower.includes(q)) score += 70;

    const exactAliasIdx = item.aliasesLower.findIndex((a) => a === q || a.includes(q));
    if (exactAliasIdx !== -1) {
      score += 55;
      matchedAlias = item.aliases[exactAliasIdx];
    }

    // Per-token matching + synonym expansion
    for (const token of tokens) {
      const variants = [token, ...(PLAIN_TERM_SYNONYMS[token] ?? [])];
      let tokenScore = 0;

      for (let vIdx = 0; vIdx < variants.length; vIdx++) {
        const v = variants[vIdx];
        const isSynonym = vIdx > 0;
        const multiplier = isSynonym ? 0.75 : 1;

        if (item.titleLower.includes(v)) {
          tokenScore = Math.max(tokenScore, 40 * multiplier);
          if (isSynonym && !matchedAlias) matchedAlias = `${token} → ${v}`;
        } else {
          const aliasIdx = item.aliasesLower.findIndex((a) => a.includes(v));
          if (aliasIdx !== -1) {
            tokenScore = Math.max(tokenScore, 32 * multiplier);
            if (!matchedAlias) matchedAlias = item.aliases[aliasIdx];
          } else if (item.subtitleLower.includes(v)) {
            tokenScore = Math.max(tokenScore, 22 * multiplier);
          } else if (item.bodyLower.includes(v)) {
            tokenScore = Math.max(tokenScore, 14 * multiplier);
          }
        }
      }

      if (tokenScore > 0) {
        matchedCount += 1;
        score += tokenScore;
      }
    }

    // Require all tokens to match if multi-word, or full-query match on short queries
    const allTokensMatched = matchedCount === tokens.length;
    if (!allTokensMatched && score < 55) continue;

    if (allTokensMatched && tokens.length > 1) {
      score += 25;
    }

    scored.push({
      score,
      item: {
        id: item.id,
        category: item.category,
        title: item.title,
        subtitle: item.subtitle,
        to: item.to,
        matchedAlias,
      },
    });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 10).map((s) => s.item);
}
