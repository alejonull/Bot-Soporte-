import React, { useState, useEffect } from 'react';
import { X, Server, Check, AlertTriangle, ExternalLink, Save } from 'lucide-react';

interface WebhookConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSaveUrl: (url: string) => void;
}

export const WebhookConfigModal: React.FC<WebhookConfigModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  onSaveUrl,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setUrlInput(currentUrl || '');
  }, [currentUrl, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUrl(urlInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const envVarName = 'VITE_N8N_WEBHOOK_URL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Configuración del Webhook n8n</h2>
            <p className="text-xs text-slate-400">Conexión con el flujo de soporte técnico</p>
          </div>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSave} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              URL del Webhook de n8n
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://tu-instancia-n8n.com/webhook/..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>

          {/* Explanation Banner */}
          <div className="p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Variable de Entorno</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              En producción o desarrollo local, esta URL se carga automáticamente desde el archivo <code className="text-blue-300 font-mono bg-slate-900 px-1 py-0.5 rounded">.env</code> usando la variable:
            </p>
            <div className="bg-slate-900 p-2 rounded border border-slate-800 font-mono text-[11px] text-emerald-400 select-all">
              {envVarName}={urlInput || 'https://...'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Guardado</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar URL</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
