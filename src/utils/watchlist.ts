import { useCallback, useEffect, useState } from 'react';

const WATCHLIST_STORAGE_KEY = 'parlemen_id_watchlist_v1';
const WATCHLIST_EVENT = 'parlemen:watchlist-changed';

export interface WatchlistState {
  billIds: string[];
  memberIds: string[];
}

const EMPTY_WATCHLIST: WatchlistState = {
  billIds: [],
  memberIds: [],
};

export function readWatchlist(): WatchlistState {
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!raw) return EMPTY_WATCHLIST;
    const parsed = JSON.parse(raw) as Partial<WatchlistState>;
    return {
      billIds: Array.isArray(parsed.billIds)
        ? parsed.billIds.filter((x): x is string => typeof x === 'string')
        : [],
      memberIds: Array.isArray(parsed.memberIds)
        ? parsed.memberIds.filter((x): x is string => typeof x === 'string')
        : [],
    };
  } catch {
    return EMPTY_WATCHLIST;
  }
}

function saveWatchlist(next: WatchlistState): void {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(WATCHLIST_EVENT));
  } catch {
    // ignore storage errors
  }
}

export function useWatchlist() {
  const [state, setState] = useState<WatchlistState>(() => readWatchlist());

  useEffect(() => {
    const sync = () => setState(readWatchlist());
    window.addEventListener(WATCHLIST_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(WATCHLIST_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isBillWatched = useCallback(
    (id: string) => state.billIds.includes(id),
    [state.billIds],
  );

  const isMemberWatched = useCallback(
    (id: string) => state.memberIds.includes(id),
    [state.memberIds],
  );

  const toggleBill = useCallback((id: string) => {
    const current = readWatchlist();
    const exists = current.billIds.includes(id);
    const next: WatchlistState = {
      ...current,
      billIds: exists
        ? current.billIds.filter((x) => x !== id)
        : [id, ...current.billIds],
    };
    setState(next);
    saveWatchlist(next);
  }, []);

  const toggleMember = useCallback((id: string) => {
    const current = readWatchlist();
    const exists = current.memberIds.includes(id);
    const next: WatchlistState = {
      ...current,
      memberIds: exists
        ? current.memberIds.filter((x) => x !== id)
        : [id, ...current.memberIds],
    };
    setState(next);
    saveWatchlist(next);
  }, []);

  const clearWatchlist = useCallback(() => {
    setState(EMPTY_WATCHLIST);
    saveWatchlist(EMPTY_WATCHLIST);
  }, []);

  return {
    billIds: state.billIds,
    memberIds: state.memberIds,
    totalCount: state.billIds.length + state.memberIds.length,
    isBillWatched,
    isMemberWatched,
    toggleBill,
    toggleMember,
    clearWatchlist,
  };
}
