import { describe, expect, it } from 'vitest';
import { BILLS } from '../data/parliamentData';
import {
  DAPIL_LIST,
  FRAKSI_LIST,
  PROLEGNAS_PRIORITAS,
  findMatchingDapils,
} from '../data/referenceData';

describe('Dataset DPR RI (Dapil, Fraksi, Prolegnas)', () => {
  it('memuat tepat 84 dapil dengan total 580 kursi dan ID unik', () => {
    expect(DAPIL_LIST).toHaveLength(84);
    const totalSeats = DAPIL_LIST.reduce((sum, d) => sum + d.seats, 0);
    expect(totalSeats).toBe(580);

    const ids = new Set(DAPIL_LIST.map((d) => d.id));
    expect(ids.size).toBe(84);
  });

  it('memuat tepat 8 fraksi dengan total 580 kursi', () => {
    expect(FRAKSI_LIST).toHaveLength(8);
    const totalSeats = FRAKSI_LIST.reduce((sum, f) => sum + f.seats, 0);
    expect(totalSeats).toBe(580);
  });

  it('menghubungkan billId Prolegnas Prioritas ke RUU yang valid di BILLS', () => {
    expect(PROLEGNAS_PRIORITAS.length).toBeGreaterThanOrEqual(20);
    const billIds = new Set(BILLS.map((b) => b.id));
    for (const item of PROLEGNAS_PRIORITAS) {
      if (item.billId) {
        expect(billIds.has(item.billId)).toBe(true);
      }
    }
  });

  it('findMatchingDapils menemukan dapil dari nama kota maupun alias', () => {
    expect(findMatchingDapils('')).toEqual([]);
    expect(findMatchingDapils('Bandung').some((d) => d.name === 'Jawa Barat I')).toBe(true);
    expect(findMatchingDapils('Sorong').some((d) => d.name === 'Papua Barat Daya')).toBe(true);
    expect(findMatchingDapils('Solo').some((d) => d.name === 'Jawa Tengah V')).toBe(true);
  });
});
