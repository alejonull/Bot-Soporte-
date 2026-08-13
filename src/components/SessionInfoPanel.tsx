import React, { useState } from 'react';
import { Key, Shield, Wifi, Clock, Copy, Check, Server, HelpCircle, Terminal } from 'lucide-react';

interface SessionInfoPanelProps {
  sessionId: string;
  webhookUrl: string;
  onOpenSettings: () => void;
}

export const SessionInfoPanel: React.FC<SessionInfoPanelProps> = ({
  sessionId,
  webhookUrl,
  onOpenSettings,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySession = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isConfigured = Boolean(webhookUrl);

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
            Este ID se almacena en tu navegador para dar seguimiento continuo a tu ticket técnico.
          </p>
        </div>
      </div>

      {/* Webhook Status Card */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            Conexión de Servicio
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
              isConfigured
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
            {isConfigured ? 'Conectado' : 'Pendiente'}
          </span>
        </div>

        <div className="space-y-1.5 text-slate-400 text-[11px]">
          <div className="flex justify-between items-center">
            <span>Protocolo:</span>
            <span className="font-mono text-slate-300">HTTPS POST</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Servidor Backend:</span>
            <span className="font-mono text-slate-300">n8n Webhook</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Disponibilidad:</span>
            <span className="text-emerald-400 font-medium">24/7 Automatizado</span>
          </div>
        </div>

        {!isConfigured && (
          <button
            onClick={onOpenSettings}
            className="w-full mt-2 py-1.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 rounded-lg text-xs font-medium transition-colors text-center block"
          >
            Configurar URL de Webhook
          </button>
        )}
      </div>

      {/* Security & Protocol */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3.5 space-y-2">
        <div className="font-semibold text-slate-200 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          Seguridad & Protocolo CCG
        </div>
        <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
          <li>Nunca compartas contraseñas personales.</li>
          <li>Los diagnósticos son confidenciales.</li>
          <li>Comunicación encriptada punto a punto.</li>
        </ul>
      </div>

      {/* Tech Specifications */}
      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
        <div className="flex justify-between">
          <span>Plataforma:</span>
          <span>CCG Engine v2.4</span>
        </div>
        <div className="flex justify-between">
          <span>Canal:</span>
          <span>Web Client UI</span>
        </div>
      </div>

    </aside>
  );
};
