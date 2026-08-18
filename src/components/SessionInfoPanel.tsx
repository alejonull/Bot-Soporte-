import React, { useState } from 'react';
import { Shield, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';

interface SessionInfoPanelProps {
  sessionId: string;
  onResetSession: () => void;
}

export const SessionInfoPanel: React.FC<SessionInfoPanelProps> = ({
  sessionId,
  onResetSession,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySession = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="panel-surface h-full w-full overflow-y-auto p-3 lg:p-3.5">
      <div className="space-y-3">
        <header className="space-y-1">
          <h2 className="text-base font-semibold tracking-tight text-slate-100">Sesión</h2>
          <p className="text-xs text-slate-400">Información secundaria</p>
        </header>

        <section className="panel-section !p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="section-label">Estado</div>
            <span className="badge badge--success">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Conectado
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-slate-800/80 pt-2.5">
            <span className="text-xs text-slate-400">Atención</span>
            <span className="text-xs font-medium text-emerald-400">Automatizada</span>
          </div>
        </section>

        <section className="panel-section !p-3">
          <div className="section-label">Identificador de sesión</div>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2.5">
            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-xs text-slate-200" title={sessionId}>
                {sessionId}
              </div>
            </div>
            <button
              onClick={handleCopySession}
              className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-700/80 text-slate-400 transition-colors hover:border-cyan-500/40 hover:text-slate-100"
              title="Copiar ID de sesión"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </section>

        <details className="panel-section group !p-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
            <div className="section-label flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              Seguridad
            </div>
            <Sparkles className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-2 space-y-2 text-[11px] leading-relaxed text-slate-500">
            <p>No compartas contraseñas ni códigos de verificación.</p>
          </div>
        </details>
      </div>
    </aside>
  );
};
