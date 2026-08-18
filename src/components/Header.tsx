import React from 'react';
import { ShieldCheck, Cpu, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onResetSession: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetSession }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1680px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/15">
            <Cpu className="h-5 w-5 text-cyan-100" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-500" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-semibold tracking-tight text-slate-100 sm:text-lg">
                Soporte Técnico
              </h1>
            </div>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              Workspace corporativo de atención y diagnóstico
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Servicio activo
          </span>

          <button
            onClick={onResetSession}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-500/40 hover:bg-slate-800/80 active:scale-95"
            title="Reiniciar sesión de chat"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Nueva Consulta</span>
            <span className="sm:hidden">Nueva</span>
          </button>
        </div>
      </div>
    </header>
  );
};
