import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  inputPreset?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  inputPreset = '',
}) => {
  const [text, setText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputPreset) {
      setText(inputPreset);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [inputPreset]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');

    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateIsMobile();
    mediaQuery.addEventListener('change', updateIsMobile);

    return () => {
      mediaQuery.removeEventListener('change', updateIsMobile);
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 132)}px`;
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    onSendMessage(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-[var(--border)] bg-[rgba(250,249,246,0.96)] px-4 py-3 lg:px-6 lg:py-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl">
        <div className="flex items-end gap-3 rounded-[18px] border border-[var(--border)] bg-white px-3 py-3 shadow-[0_4px_16px_rgba(40,35,25,0.03)] transition-colors duration-150 focus-within:border-[#FF641E]/35 focus-within:ring-2 focus-within:ring-[#FF641E]/10">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isMobile ? 'Escribe tu mensaje...' : 'Escribe tu mensaje para soporte técnico...'}
            className="min-h-[48px] w-full resize-none bg-transparent px-1 py-2 text-[15px] leading-6 text-[#252525] placeholder:text-[#A19D96] focus:outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[14px] transition-all duration-150 ${
              !text.trim() || isLoading
                ? 'cursor-not-allowed bg-[#E5E0D8] text-[#A19D96] opacity-70'
                : 'bg-[#FF641E] text-white shadow-[0_10px_24px_rgba(255,100,30,0.18)] hover:bg-[#EA5413] active:translate-y-[1px]'
            }`}
            title="Enviar mensaje"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-2 hidden items-center justify-between px-1 text-[11px] text-[#A19D96] sm:flex">
          <span className="inline-flex items-center gap-1.5">
            <CornerDownLeft className="h-3.5 w-3.5" />
            <kbd className="rounded border border-[var(--border)] bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#74706A]">
              Enter
            </kbd>
            para enviar
          </span>
          <span>
            <kbd className="rounded border border-[var(--border)] bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#74706A]">
              Shift + Enter
            </kbd>
            {' '}salto de línea
          </span>
        </div>
      </form>
    </div>
  );
};
