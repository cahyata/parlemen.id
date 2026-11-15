import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Compass,
  FileText,
  Landmark,
  MapPin,
  Mic,
  Radio,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { searchParliament, type SearchResult } from '../utils/parliamentSearch';

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const CATEGORY_ICON = {
  'Panduan & Aksi': Compass,
  'RUU & UU': FileText,
  Anggota: Users,
  Dapil: MapPin,
  Fraksi: Landmark,
  'Komisi & Badan': Building2,
  Sidang: Radio,
  Risalah: Mic,
} as const;

const AWAM_EXAMPLES = ['korupsi', 'bpjs', 'ojol', 'notulen', 'lapor', 'listrik', 'pembantu'];

export function GlobalSearchModal({
  open,
  onClose,
  initialQuery = '',
}: GlobalSearchModalProps) {
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      setQuery(initialQuery);
      setActiveIndex(0);
      if (!dialog.open) {
        dialog.showModal();
      }
      const timer = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(timer);
    }

    if (dialog.open) {
      dialog.close();
    }
    return undefined;
  }, [open, initialQuery]);

  // Progressive enhancement fallback for browsers without <dialog closedby="any"> (e.g. Safari)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return undefined;

    const outside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    let pressedOutside = false;
    const onPointerDown = (e: PointerEvent) => {
      pressedOutside = outside(e);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (pressedOutside && outside(e) && dialog.open) {
        dialog.close();
      }
      pressedOutside = false;
    };

    dialog.addEventListener('pointerdown', onPointerDown);
    dialog.addEventListener('pointerup', onPointerUp);
    return () => {
      dialog.removeEventListener('pointerdown', onPointerDown);
      dialog.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  const results = useMemo<SearchResult[]>(() => searchParliament(query), [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results.length]);

  const handleSelect = (item: SearchResult) => {
    onClose();
    navigate(item.to);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowDown' && results.length > 0) {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp' && results.length > 0) {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      aria-label="Pencarian cepat portal DPR RI"
      className="search-dialog"
      {...({ closedby: 'any' } as Record<string, string>)}
    >
      <div className="w-full overflow-hidden rounded-3xl bg-white shadow-[0_32px_90px_-16px_rgba(20,23,31,0.38)]">
        {/* Search Input Row */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#14171F]/8">
          <Search className="h-5 w-5 shrink-0 text-[#7A1822]" />
          <input
            ref={inputRef}
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik topik sehari-hari (korupsi, bpjs, ojol, notulen, lapor)..."
            className="w-full bg-transparent text-sm sm:text-base text-[#14171F] placeholder:text-[#5A6472] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded-lg p-1.5 text-[#5A6472] hover:bg-[#F4F1EA] hover:text-[#14171F] cursor-pointer"
              aria-label="Bersihkan kata kunci"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#F4F1EA] px-2.5 py-1 font-mono-num text-[11px] font-bold text-[#5A6472] hover:text-[#14171F] cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Example Chips when Empty */}
        {!query.trim() && (
          <div className="flex flex-wrap items-center gap-2 bg-[#FAF8F4] px-6 py-3 border-b border-[#14171F]/6 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-[#5A6472]">
              <Sparkles className="h-3.5 w-3.5 text-[#C28E0E]" />
              Coba ketik:
            </span>
            {AWAM_EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setQuery(ex)}
                className="rounded-full bg-white px-3 py-1 font-medium text-[#7A1822] shadow-2xs hover:bg-[#7A1822] hover:text-white transition-colors cursor-pointer"
              >
                {ex}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="max-h-[58vh] overflow-y-auto px-4 py-4">
          <div className="px-2 pb-2.5 text-[11px] font-bold uppercase tracking-widest text-[#5A6472]">
            {query.trim() ? `Hasil Paling Relevan (${results.length})` : 'Pintasan Cepat'}
          </div>

          {results.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-[#5A6472]">
              <p>
                Tidak ditemukan hasil untuk <strong className="text-[#14171F]">"{query}"</strong>.
              </p>
              <p className="mt-2 text-xs">
                Coba gunakan kata sehari-hari seperti <em>korupsi</em>, <em>bpjs</em>, <em>jalan rusak</em>, <em>notulen</em>, atau <em>lapor</em>.
              </p>
            </div>
          ) : (
            <ul className="space-y-1.5">
              {results.map((item, idx) => {
                const Icon = CATEGORY_ICON[item.category];
                const isSelected = idx === activeIndex;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => handleSelect(item)}
                      className={`w-full text-left flex items-center gap-3.5 rounded-2xl px-4 py-3.5 transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#FAF6F0]' : 'hover:bg-[#FAF8F4]'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isSelected
                            ? 'bg-[#7A1822] text-white'
                            : 'bg-[#F4F1EA] text-[#7A1822]'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-bold text-[#14171F] truncate">
                            {item.title}
                          </span>
                          <span className="shrink-0 rounded-full bg-[#EFECE4] px-2.5 py-0.5 text-[10px] font-bold text-[#5A6472]">
                            {item.category}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#5A6472] truncate">
                          {item.subtitle}
                          {item.matchedAlias && (
                            <span className="text-[#8C6404] font-medium">
                              {' '}
                              • Terkait: {item.matchedAlias}
                            </span>
                          )}
                        </p>
                      </div>

                      <ArrowRight
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isSelected ? 'text-[#7A1822] translate-x-0.5' : 'text-[#5A6472]/40'
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between bg-[#FAF8F4] px-6 py-3 border-t border-[#14171F]/6 text-[11px] text-[#5A6472]">
          <span>Mendukung istilah awam & istilah resmi DPR • ↑ ↓ pilih, Enter buka</span>
          <span className="hidden sm:inline font-mono-num font-semibold">Ctrl + K</span>
        </div>
      </div>
    </dialog>
  );
}
