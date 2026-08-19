import React from 'react';
import { PanelRight, RefreshCw, Sparkles } from 'lucide-react';

interface HeaderProps {
  onResetSession: () => void;
  onToggleMobilePanel?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onResetSession,
  onToggleMobilePanel,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[rgba(250,249,246,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1680px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-[var(--border)] bg-[#FFF3EA] text-[#FF641E] shadow-[0_8px_20px_rgba(40,35,25,0.06)] sm:h-10 sm:w-10">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#FAF9F6] bg-[#4FA45F]" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-[16px] font-semibold tracking-tight text-[#252525] sm:text-[22px]">
              Soporte Tecnico
            </h1>
            <p className="mt-0.5 hidden text-xs text-[#74706A] sm:block">
              Workspace de soporte
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleMobilePanel}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--border)] bg-white text-[#252525] shadow-[0_8px_20px_rgba(40,35,25,0.04)] transition-colors duration-150 hover:border-[#FF641E]/30 hover:bg-[#FFF3EA] hover:text-[#FF641E] lg:hidden"
            aria-label="Abrir panel"
          >
            <PanelRight className="h-4 w-4" />
          </button>

          <span className="hidden items-center gap-2 rounded-full border border-[#DDE0D8] bg-white px-3.5 py-2 text-xs font-medium text-[#252525] sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-[#4FA45F]" />
            En linea
          </span>

          <button
            onClick={onResetSession}
            className="inline-flex h-10 items-center gap-2 rounded-[14px] bg-[#FF641E] px-3.5 py-2.5 text-sm font-medium text-white shadow-[0_10px_24px_rgba(255,100,30,0.18)] transition-colors duration-150 hover:bg-[#EA5413] active:translate-y-[1px]"
            title="Reiniciar sesión de chat"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Nueva Consulta</span>
            <span className="sr-only sm:hidden">Nueva Consulta</span>
          </button>
        </div>
      </div>
    </header>
  );
};
