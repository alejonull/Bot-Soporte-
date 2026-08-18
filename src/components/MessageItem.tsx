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
    'space-y-3 text-[15px] leading-7 break-words text-slate-100 ' +
    '[&>p]:m-0 [&>p+*]:mt-3 [&>ul]:my-2 [&>ol]:my-2 [&>ul]:pl-5 [&>ol]:pl-5 ' +
    '[&>ul]:space-y-1 [&>ol]:space-y-1 [&>li]:my-1 [&>li>p]:m-0 ' +
    '[&>strong]:font-semibold [&>strong]:text-slate-50 [&>em]:italic [&>em]:text-slate-50 ' +
    '[&>br]:block [&>br]:h-0';

  return (
    <div className={`flex w-full gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="mt-1 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/10">
            <Cpu className="h-4 w-4" />
          </div>
        </div>
      )}

      <div
        className={`group relative max-w-[86%] rounded-2xl px-3.5 py-3 shadow-sm sm:max-w-[78%] lg:max-w-[74%] ${
          isUser
            ? 'rounded-br-md border border-cyan-500/20 bg-cyan-500/12 text-slate-50'
            : message.isError
            ? 'rounded-bl-md border border-rose-500/30 bg-rose-950/35 text-rose-100'
            : 'rounded-bl-md border border-slate-700/80 bg-slate-900/90 text-slate-100'
        }`}
      >
        <div className="mb-1.5 flex items-center justify-between gap-3 border-b border-slate-800/80 pb-1.5 text-[11px]">
          {isUser ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-cyan-200">
              <User className="h-3.5 w-3.5" />
              Usuario
            </span>
          ) : (
            <span className="font-medium text-cyan-300">Soporte Técnico</span>
          )}

          <div className="flex items-center gap-2 text-slate-500">
            <span>{formatTime(message.timestamp)}</span>
            {!isUser && (
              <button
                onClick={handleCopy}
                className="rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:text-slate-200"
                title="Copiar mensaje"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        </div>

        <div
          className={
            isUser
          ? 'whitespace-pre-wrap break-words text-[14.5px] leading-[1.55]'
          : message.isError
              ? 'text-[14.5px] leading-[1.55] break-words'
              : markdownClassName
          }
        >
          {message.isError && !isUser ? (
            <div className="flex items-start gap-2 text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-400" />
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
        <div className="mt-1 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800 text-slate-200">
            <User className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  );
};
