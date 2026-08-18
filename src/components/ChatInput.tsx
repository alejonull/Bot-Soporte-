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
    <div className="border-t border-slate-800/80 bg-slate-950/90 px-4 py-3 lg:px-6 lg:py-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl">
        <div className="flex items-end gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/90 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition-colors focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isMobile ? 'Describe tu problema...' : 'Describe tu problema técnico aquí...'}
            className="min-h-[48px] w-full resize-none bg-transparent px-1 py-2 text-[15px] leading-6 text-slate-100 placeholder:text-slate-500 focus:outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all ${
              !text.trim() || isLoading
                ? 'cursor-not-allowed bg-slate-800 text-slate-500 opacity-60'
                : 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 active:scale-95'
            }`}
            title="Enviar mensaje"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="mt-2 hidden items-center justify-between px-1 text-[11px] text-slate-500 sm:flex">
          <span className="inline-flex items-center gap-1.5">
            <CornerDownLeft className="h-3.5 w-3.5" />
            <kbd className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">Enter</kbd>
            para enviar
          </span>
          <span>
            <kbd className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">Shift + Enter</kbd>
            {' '}salto de línea
          </span>
        </div>
      </form>
    </div>
  );
};
