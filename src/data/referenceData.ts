import dapilData from './dapil.json';
import fraksiData from './fraksi.json';
import prolegnasData from './prolegnasPrioritas.json';
import members580Data from './members580.json';

export interface DapilEntry {
  id: string;
  name: string;
  province: string;
  islandGroup: string;
  seats: number;
  regions: string[];
  keywords: string[];
}

export interface FraksiEntry {
  id: string;
  code: string;
  shortName: string;
  name: string;
  seats: number;
  sharePct: number;
  color: string;
  keywords: string[];
}

export interface ProlegnasEntry {
  id: string;
  billId?: string;
  shortTitle: string;
  title: string;
  proposer: string;
  committee: string;
  statusSummary: string;
  keywords: string[];
}

export interface MemberRecord {
  id: string;
  seatNo: number;
  name: string;
  dapil: string;
  factionShort: string;
  faction: string;
  factionColor: string;
  komisi?: string;
  votes?: string;
  note?: string;
}

export const DAPIL_LIST: DapilEntry[] = dapilData;
export const FRAKSI_LIST: FraksiEntry[] = fraksiData;
export const PROLEGNAS_PRIORITAS: ProlegnasEntry[] = prolegnasData;
export const MEMBERS_580: MemberRecord[] = members580Data;

export const DAPIL_BY_NAME = new Map<string, DapilEntry>(
  DAPIL_LIST.map((d) => [d.name.toLowerCase(), d]),
);

export function findMatchingDapils(rawQuery: string): DapilEntry[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return [];
  return DAPIL_LIST.filter((d) => {
    const hay = `${d.name} ${d.province} ${d.regions.join(' ')} ${d.keywords.join(' ')}`.toLowerCase();
    return hay.includes(q);
  });
}
