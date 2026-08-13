import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { User, Cpu, Copy, Check, AlertCircle } from 'lucide-react';

interface MessageItemProps {
  message: ChatMessage;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const formatTime = (date: Date) => {
    try {
      return new Intl.DateTimeFormat('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return date.toLocaleTimeString();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex w-full mb-4 space-x-3 max-w-full ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-sm ring-1 ring-blue-500/20">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Message Container */}
      <div
        className={`relative group max-w-[85%] sm:max-w-[78%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm transition-all ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none font-normal'
            : message.isError
            ? 'bg-rose-950/40 border border-rose-500/30 text-rose-200 rounded-bl-none'
            : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-bl-none'
        }`}
      >
        {/* Header inside Assistant bubble */}
        {!isUser && (
          <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-slate-700/50 text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1 text-blue-400 font-semibold">
              CCG Soporte Técnico
            </span>
            <div className="flex items-center space-x-1">
              <span className="text-[10px] text-slate-400">{formatTime(message.timestamp)}</span>
              <button
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-slate-200 rounded"
                title="Copiar mensaje"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        )}

        {/* User Header */}
        {isUser && (
          <div className="flex items-center justify-end text-[10px] text-blue-200/80 mb-1">
            <span>{formatTime(message.timestamp)}</span>
          </div>
        )}

        {/* Message Content */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.isError && (
            <div className="flex items-start gap-2 text-rose-300 font-medium mb-1">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{message.text}</span>
            </div>
          )}
          {!message.isError && message.text}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-lg bg-slate-700 text-slate-200 flex items-center justify-center ring-1 ring-slate-600/50">
            <User className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
};
