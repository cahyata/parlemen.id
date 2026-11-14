import type { ReactNode } from 'react';
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
}

export function PageHeader({ breadcrumbs, eyebrow, title, description, aside }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FAF8F4] to-[#F7F5F0]">
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#7A1822]/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-[#C28E0E]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <Breadcrumb items={breadcrumbs} />

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#7A1822]">{eyebrow}</p>
            <h1 className="mt-2.5 font-editorial text-3xl font-bold tracking-tight text-[#14171F] sm:text-5xl leading-[1.12]">
              {title}
            </h1>
            <p className="mt-4 text-sm sm:text-base text-[#5A6472] leading-[1.75]">{description}</p>
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
