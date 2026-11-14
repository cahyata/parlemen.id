import { describe, expect, it } from 'vitest';
import { QUICK_SUGGESTIONS, searchParliament } from '../utils/parliamentSearch';

describe('searchParliament', () => {
  it('mengembalikan pintasan cepat saat query kosong', () => {
    expect(searchParliament('')).toEqual(QUICK_SUGGESTIONS);
    expect(searchParliament('   ')).toEqual(QUICK_SUGGESTIONS);
  });

  it('memahami istilah awam seperti korupsi, ojol, notulen, dan pembantu', () => {
    const korupsi = searchParliament('korupsi');
    expect(korupsi.some((r) => r.to === '/legislasi/ruu-perampasan-aset')).toBe(true);

    const ojol = searchParliament('ojol');
    expect(ojol.some((r) => r.title.includes('Komisi V'))).toBe(true);

    const notulen = searchParliament('notulen');
    expect(notulen.some((r) => r.category === 'Risalah' || r.to.includes('tab=risalah'))).toBe(true);

    const prt = searchParliament('pembantu');
    expect(prt.some((r) => r.to === '/legislasi/ruu-perlindungan-pekerja-rumah-tangga')).toBe(true);
  });

  it('menemukan dapil, fraksi, dan RUU Prolegnas Prioritas', () => {
    const dapil = searchParliament('Jember');
    expect(dapil.some((r) => r.category === 'Dapil' && r.title.includes('Jawa Timur IV'))).toBe(true);

    const fraksi = searchParliament('Golkar');
    expect(fraksi.some((r) => r.category === 'Fraksi' && r.title.includes('Golkar'))).toBe(true);

    const prolegnas = searchParliament('Penyiaran');
    expect(prolegnas.some((r) => r.category === 'RUU & UU' && r.title.includes('Penyiaran'))).toBe(true);
  });
});
