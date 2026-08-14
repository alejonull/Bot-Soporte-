import React, { useState } from 'react';
import { Key, Shield, Copy, Check, Server } from 'lucide-react';

interface SessionInfoPanelProps {
  sessionId: string;
}

export const SessionInfoPanel: React.FC<SessionInfoPanelProps> = ({ sessionId }) => {
  const [copied, setCopied] = useState(false);

  const handleCopySession = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-full lg:w-80 bg-slate-900 border-l border-slate-800 p-4 sm:p-5 flex flex-col space-y-5 text-slate-300 text-xs">
      {/* Session Details Card */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
            <Key className="w-3.5 h-3.5 text-blue-400" />
            Identificador de Sesión
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
            Única
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between bg-slate-900/90 rounded-lg p-2 font-mono text-[11px] text-slate-300 border border-slate-800">
            <span className="truncate max-w-[170px]" title={sessionId}>
              {sessionId}
            </span>
            <button
              onClick={handleCopySession}
              className="ml-2 text-slate-400 hover:text-white transition-colors p-1"
              title="Copiar ID de sesión"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            Guarda este código por si necesitas continuar tu solicitud más adelante.
          </p>
        </div>
      </div>

      {/* Service Status Card */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            Estado del servicio
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Conectado
          </span>
        </div>

        <div className="space-y-1.5 text-slate-400 text-[11px]">
          <div className="flex justify-between items-center">
            <span>Disponibilidad:</span>
            <span className="text-emerald-400 font-medium">Atención automatizada</span>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3.5 space-y-2">
        <div className="font-semibold text-slate-200 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          Seguridad
        </div>
        <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
          <li>Nunca compartas contraseñas personales.</li>
          <li>La información se usa únicamente para atender tu solicitud.</li>
          <li>Conexión segura mediante HTTPS.</li>
          <li>No compartas códigos de verificación ni información bancaria.</li>
        </ul>
      </div>
    </aside>
  );
};
