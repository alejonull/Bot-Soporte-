import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
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

  const markdownClassName =
    'space-y-3 text-sm leading-relaxed break-words text-slate-100 ' +
    '[&>p]:m-0 [&>p+*]:mt-3 [&>ul]:my-2 [&>ol]:my-2 [&>ul]:pl-5 [&>ol]:pl-5 ' +
    '[&>ul]:space-y-1 [&>ol]:space-y-1 [&>li]:my-1 [&>li>p]:m-0 ' +
    '[&>strong]:font-semibold [&>strong]:text-slate-50 [&>em]:italic [&>em]:text-slate-50 ' +
    '[&>br]:block [&>br]:h-0';

  return (
    <div
      className={`flex w-full mb-4 space-x-3 max-w-full ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-sm ring-1 ring-blue-500/20">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
      )}

      <div
        className={`relative group max-w-[85%] sm:max-w-[78%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm transition-all ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none font-normal'
            : message.isError
            ? 'bg-rose-950/40 border border-rose-500/30 text-rose-200 rounded-bl-none'
            : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-bl-none'
        }`}
      >
        {!isUser && (
          <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-slate-700/50 text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1 text-blue-400 font-semibold">
              Soporte Técnico
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

        {isUser && (
          <div className="flex items-center justify-end text-[10px] text-blue-200/80 mb-1">
            <span>{formatTime(message.timestamp)}</span>
          </div>
        )}

        <div
          className={
            isUser
              ? 'text-sm leading-relaxed whitespace-pre-wrap break-words'
              : message.isError
              ? 'text-sm leading-relaxed break-words'
              : markdownClassName
          }
        >
          {message.isError && !isUser ? (
            <div className="flex items-start gap-2 text-rose-300 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="prose prose-invert max-w-none prose-p:my-0 prose-ul:my-2 prose-ol:my-2 prose-li:my-1">
                <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]} skipHtml>
                  {message.text}
                </ReactMarkdown>
              </div>
            </div>
          ) : !isUser ? (
            <ReactMarkdown
              remarkPlugins={[remarkBreaks, remarkGfm]}
              skipHtml
              components={{
                p: ({ children }) => <p className="m-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-slate-50">{children}</strong>,
                em: ({ children }) => <em className="italic text-slate-50">{children}</em>,
                ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
                ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
                li: ({ children }) => <li className="my-1">{children}</li>,
                br: () => <br />,
              }}
            >
              {message.text}
            </ReactMarkdown>
          ) : (
            message.text
          )}
        </div>
      </div>

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
