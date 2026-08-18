import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { MessageItem } from './MessageItem';
import { Cpu, Terminal } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSelectTopic?: (topic: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  onSelectTopic,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickTopics = [
    'Problemas de conexión o red',
    'Equipo lento o bloqueado',
    'Error en inicio de sesión / Clave',
    'Configuración de correo o VPN',
  ];

  return (
    <div className="chat-scrollbar flex-1 overflow-y-auto px-3.5 pt-4 pb-3.5 lg:px-6 lg:pt-5 space-y-2.5 bg-transparent">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="flex items-start gap-3 animate-fade-in">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/10">
            <Cpu className="h-4 w-4 animate-spin text-cyan-100" />
          </div>

          <div className="max-w-[78%] rounded-2xl rounded-bl-md border border-slate-700/80 bg-slate-900/90 px-3.5 py-2.5 text-sm text-slate-300 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <div className="mt-2 text-xs font-medium text-slate-300">
              Bot está analizando tu solicitud...
            </div>
          </div>
        </div>
      )}

      {messages.length <= 1 && onSelectTopic && (
        <section className="mt-3 rounded-2xl border border-slate-800/80 bg-slate-950/50 p-3.5 shadow-inner">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
            Consultas frecuentes
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {quickTopics.map((topic, index) => (
              <button
                key={index}
                onClick={() => onSelectTopic(topic)}
                className="rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2.5 text-left text-xs text-slate-200 transition-colors hover:border-cyan-500/40 hover:bg-slate-800/80 hover:text-white"
              >
                {topic}
              </button>
            ))}
          </div>
        </section>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
