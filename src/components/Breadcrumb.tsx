import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-[#525B66]">
      <Link to="/" className="hover:text-[#7C1D26] hover:underline">
        Beranda
      </Link>
      {items.map((item, idx) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-[#DFDCD4]" />
          {item.to && idx < items.length - 1 ? (
            <Link to={item.to} className="hover:text-[#7C1D26] hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-[#1A1D21]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
