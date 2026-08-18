import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { MessageItem } from './MessageItem';
import { Cpu, Sparkles } from 'lucide-react';

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
    <div className="chat-scrollbar flex-1 overflow-y-auto px-4 pt-4 pb-3.5 lg:px-6 lg:pt-6">
      <div className="space-y-3.5">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-[#FFD8BF] bg-[#FFF3EA] text-[#FF641E] shadow-[0_4px_16px_rgba(40,35,25,0.04)]">
              <Cpu className="h-4 w-4 animate-spin" />
            </div>

            <div className="max-w-[80%] rounded-2xl rounded-bl-md border border-[#E5E0D8] bg-[#F7F3EE] px-3.5 py-2.5 text-sm text-[#252525] shadow-[0_2px_10px_rgba(40,35,25,0.03)]">
              <div className="flex items-center gap-1.5 text-[#FF641E]">
                <span className="h-2 w-2 rounded-full bg-[#FF641E] animate-pulse" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-[#EA5413] animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-[#F5B82E] animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
              <div className="mt-2 text-xs font-medium text-[#74706A]">
                Bot está analizando tu solicitud...
              </div>
            </div>
          </div>
        )}

        {messages.length <= 1 && onSelectTopic && (
          <section className="mt-4 rounded-[20px] border border-[var(--border)] bg-[#FAF9F6] p-4 shadow-[0_4px_16px_rgba(40,35,25,0.03)]">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A19D96]">
              <Sparkles className="h-3.5 w-3.5 text-[#FF641E]" />
              Consultas frecuentes
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {quickTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => onSelectTopic(topic)}
                  className="rounded-full border border-[var(--border)] bg-white px-3.5 py-2 text-left text-xs font-medium text-[#252525] transition-colors duration-150 hover:border-[#FFD8BF] hover:bg-[#FFF3EA] hover:text-[#FF641E]"
                >
                  {topic}
                </button>
              ))}
            </div>
          </section>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
