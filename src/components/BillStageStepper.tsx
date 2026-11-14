import { Check } from 'lucide-react';
import { LEGISLATIVE_STAGES, type LegislativeStageIndex } from '../data/parliamentData';

interface BillStageStepperProps {
  currentStage: LegislativeStageIndex;
  compact?: boolean;
}

export function BillStageStepper({ currentStage, compact = false }: BillStageStepperProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {LEGISLATIVE_STAGES.map((stage) => {
          const isCompleted = stage.index < currentStage;
          const isCurrent = stage.index === currentStage;

          return (
            <div key={stage.index} className="flex flex-col">
              {/* Glowing Progress Bar Segment */}
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#E6E1D6] shadow-[inset_0_1px_2px_rgba(20,23,31,0.08)]">
                <div
                  className={`h-full w-full rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-[#0F5132] to-[#198754]'
                      : isCurrent
                        ? 'bg-gradient-to-r from-[#7A1822] via-[#A62431] to-[#C28E0E] shadow-[0_0_12px_rgba(122,24,34,0.5)]'
                        : 'bg-transparent'
                  }`}
                />
              </div>

              {/* Label & Step Badge */}
              <div className="mt-2.5 flex items-start gap-1.5">
                {!compact && (
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono-num text-[10px] font-bold transition-all ${
                      isCompleted
                        ? 'bg-gradient-to-br from-[#198754] to-[#0F5132] text-white shadow-[0_4px_10px_-2px_rgba(15,81,50,0.4)]'
                        : isCurrent
                          ? 'bg-gradient-to-br from-[#8D1D29] to-[#5B1219] text-white shadow-[0_4px_14px_-2px_rgba(122,24,34,0.55)]'
                          : 'bg-[#E6E1D6] text-[#5A6472]'
                    }`}
                  >
                    {isCompleted ? <Check className="h-2.5 w-2.5 stroke-[2.75]" /> : stage.index + 1}
                  </span>
                )}
                <div className="min-w-0">
                  <span
                    className={`block truncate text-[11px] leading-tight ${
                      isCurrent
                        ? 'font-bold text-[#7A1822]'
                        : isCompleted
                          ? 'font-semibold text-[#0F5132]'
                          : 'font-medium text-[#5A6472]'
                    }`}
                  >
                    {stage.short}
                  </span>
                  {!compact && (
                    <span className="hidden sm:block text-[10px] text-[#5A6472]/80 mt-0.5">
                      {isCompleted ? 'Selesai' : isCurrent ? 'Tahap Aktif' : 'Menunggu'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
