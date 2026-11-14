import { beforeEach, describe, expect, it } from 'vitest';
import { readWatchlist } from '../utils/watchlist';

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

describe('watchlist storage helper', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: createMemoryStorage(),
      configurable: true,
    });
  });

  it('mengembalikan watchlist kosong saat storage belum terisi', () => {
    expect(readWatchlist()).toEqual({ billIds: [], memberIds: [] });
  });

  it('membaca daftar billIds dan memberIds yang valid dari localStorage', () => {
    localStorage.setItem(
      'parlemen_id_watchlist_v1',
      JSON.stringify({ billIds: ['ruu-perampasan-aset'], memberIds: ['anggota-1', 123] }),
    );
    expect(readWatchlist()).toEqual({
      billIds: ['ruu-perampasan-aset'],
      memberIds: ['anggota-1'],
    });
  });

  it('aman saat JSON di localStorage rusak', () => {
    localStorage.setItem('parlemen_id_watchlist_v1', '{bukan-json');
    expect(readWatchlist()).toEqual({ billIds: [], memberIds: [] });
  });
});
