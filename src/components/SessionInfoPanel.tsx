import React, { useState } from 'react';
import { Check, Copy, ShieldCheck } from 'lucide-react';

interface SessionInfoPanelProps {
  sessionId: string;
}

export const SessionInfoPanel: React.FC<SessionInfoPanelProps> = ({
  sessionId,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySession = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="rounded-[20px] border border-[var(--border)] bg-white px-4 py-4 shadow-[0_6px_24px_rgba(40,35,25,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-[#252525]">Sesión actual</h3>
          <p className="mt-0.5 text-xs text-[#74706A]">Identificador y estado operativo</p>
        </div>

        <button
          onClick={handleCopySession}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[#FAF9F6] text-[#74706A] transition-colors duration-150 hover:border-[#FF641E]/30 hover:bg-[#FFF3EA] hover:text-[#FF641E]"
          title="Copiar ID de sesión"
        >
          {copied ? <Check className="h-4 w-4 text-[#4FA45F]" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium text-[#A19D96]">ID de sesión</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF7EF] px-2.5 py-1 text-xs font-medium text-[#4FA45F]">
            <span className="h-2 w-2 rounded-full bg-[#4FA45F]" />
            Servicio operativo
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[#F7F3EE] px-3 py-3">
          <div className="truncate font-mono text-xs text-[#252525]" title={sessionId}>
            {sessionId}
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-2xl border border-[var(--border)] bg-white px-3 py-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#FF641E]" />
          <div>
            <p className="text-sm font-medium text-[#252525]">Conexión protegida mediante HTTPS</p>
            <p className="mt-0.5 text-xs leading-5 text-[#74706A]">
              La sesión permanece aislada y vinculada al flujo actual de soporte.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
