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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update text if preset topic selected
  useEffect(() => {
    if (inputPreset) {
      setText(inputPreset);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [inputPreset]);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
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
    // Enter without Shift sends message
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
        <div className="relative flex items-end rounded-xl bg-slate-800/90 border border-slate-700/80 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 shadow-inner transition-all">
          
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Describe tu problema técnico aquí... (Presiona Enter para enviar)"
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm px-4 py-3.5 focus:outline-none resize-none max-h-32 min-h-[48px] disabled:opacity-50"
          />

          <div className="flex items-center p-2 space-x-2">
            <button
              type="submit"
              disabled={!text.trim() || isLoading}
              className={`inline-flex items-center justify-center p-2.5 rounded-lg text-white transition-all font-medium ${
                !text.trim() || isLoading
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 active:scale-95'
              }`}
              title="Enviar mensaje"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="flex justify-between items-center px-2 mt-1.5 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3 text-slate-400" />
            <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">Enter</kbd> para enviar
          </span>
          <span>
            <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">Shift + Enter</kbd> para salto de línea
          </span>
        </div>
      </form>
    </div>
  );
};
