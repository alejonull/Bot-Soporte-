import React from 'react';
import { ShieldCheck, Cpu, RefreshCw, Settings, Activity } from 'lucide-react';

interface HeaderProps {
  webhookConfigured: boolean;
  onOpenSettings: () => void;
  onResetSession: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  webhookConfigured,
  onOpenSettings,
  onResetSession,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30">
            <Cpu className="w-5 h-5 text-blue-100" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-100 flex items-center gap-2">
               Soporte Técnico
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Servicio Activo
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 inline" />
              Asistencia Técnica & Diagnóstico Corporativo
            </p>
          </div>
        </div>

        {/* Actions & Status */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Webhook Status Indicator / Settings button */}
          <button
            onClick={onOpenSettings}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              webhookConfigured
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/80'
                : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 animate-pulse'
            }`}
            title="Configuración de Webhook n8n"
          >
            <Activity className={`w-3.5 h-3.5 ${webhookConfigured ? 'text-blue-400' : 'text-amber-400'}`} />
            <span className="hidden md:inline">
              {webhookConfigured ? 'Webhook n8n' : 'Configurar Webhook'}
            </span>
            <Settings className="w-3.5 h-3.5 ml-0.5 opacity-70" />
          </button>

          {/* Reset Session / New Chat */}
          <button
            onClick={onResetSession}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all active:scale-95"
            title="Reiniciar Sesión de Chat"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Nueva Consulta</span>
          </button>

        </div>
      </div>
    </header>
  );
};
