import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { MessageItem } from './MessageItem';
import { Cpu, Terminal, ShieldAlert } from 'lucide-react';

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
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950/60 scroll-smooth">
      {/* Messages */}
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-start space-x-3 mb-4 animate-fade-in">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-sm">
            <Cpu className="w-4 h-4 animate-spin text-blue-200" />
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl rounded-bl-none px-4 py-3 text-slate-300 text-sm shadow-sm flex items-center space-x-3">
            <div className="flex space-x-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span className="text-xs font-medium text-slate-300">
              Bot está analizando tu solicitud...
            </span>
          </div>
        </div>
      )}

      {/* Suggested Quick Topics (shown when conversation is brief) */}
      {messages.length <= 1 && onSelectTopic && (
        <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 max-w-xl mx-auto shadow-inner">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>Consultas Frecuentes de Soporte</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickTopics.map((topic, index) => (
              <button
                key={index}
                onClick={() => onSelectTopic(topic)}
                className="text-left text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white px-3 py-2 rounded-lg border border-slate-700/60 transition-all hover:border-blue-500/40 flex items-center justify-between group"
              >
                <span>{topic}</span>
                <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
