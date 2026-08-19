import React, { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from './types';
import { getOrCreateSessionId, resetSessionId } from './utils/session';
import { sendChatMessage, getWebhookUrl } from './services/chatService';
import { analyzeConversation, NexuAnalysis } from './services/nexuService';
import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { NexuPanel } from './components/NexuPanel';
import { SessionInfoPanel } from './components/SessionInfoPanel';
import { X } from 'lucide-react';

export default function App() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [presetTopic, setPresetTopic] = useState<string>('');
  const [nexuAnalysis, setNexuAnalysis] = useState<NexuAnalysis | null>(null);
  const [isNexuLoading, setIsNexuLoading] = useState<boolean>(false);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  const initialWelcomeMessage: ChatMessage = {
    id: 'welcome-01',
    sender: 'assistant',
    text: 'Hola, soy el asistente virtual. Cuéntame qué problema estás teniendo con tu equipo y te ayudaré a revisarlo.',
    timestamp: new Date(),
  };

  useEffect(() => {
    const sid = getOrCreateSessionId();
    setSessionId(sid);
    setMessages([initialWelcomeMessage]);
  }, []);

  useEffect(() => {
    if (!isMobilePanelOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closePanel = () => {
      setIsMobilePanelOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    };

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        closePanel();
      }
    };

    if (mediaQuery.matches) {
      closePanel();
    }

    document.addEventListener('keydown', handleKeyDown);
    mediaQuery.addEventListener('change', handleViewportChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      mediaQuery.removeEventListener('change', handleViewportChange);
    };
  }, [isMobilePanelOpen]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsgId = `user-${Date.now()}`;
      const newUserMessage: ChatMessage = {
        id: userMsgId,
        sender: 'user',
        text: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setIsLoading(true);

      try {
        const botAnswer = await sendChatMessage(text, sessionId, getWebhookUrl());

        const botMsgId = `bot-${Date.now()}`;
        const newBotMessage: ChatMessage = {
          id: botMsgId,
          sender: 'assistant',
          text: botAnswer,
          timestamp: new Date(),
        };

        const updatedMessages = [...messages, newUserMessage, newBotMessage];
        setMessages(updatedMessages);

        setIsNexuLoading(true);

        try {
          const conversationForNexu = updatedMessages
            .filter((message) => !message.isError)
            .map((message) => ({
              role:
                message.sender === 'user'
                  ? ('user' as const)
                  : ('assistant' as const),
              content: message.text,
            }));

          const analysis = await analyzeConversation(conversationForNexu);

          setNexuAnalysis(analysis);

          console.log('NEXU ANALYSIS:', analysis);
        } catch (nexuError) {
          console.error('Error al analizar conversaciòn con NEXU:', nexuError);
        } finally {
          setIsNexuLoading(false);
        }
      } catch (error) {
        console.error('Error al enviar mensaje desde App:', error);

        const errorMsgId = `error-${Date.now()}`;
        const errorMessage: ChatMessage = {
          id: errorMsgId,
          sender: 'assistant',
          text: 'No fue posible contactar el servicio de soporte. Inténtalo nuevamente.',
          timestamp: new Date(),
          isError: true,
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId, messages]
  );

  const handleResetSession = useCallback(() => {
    const newSid = resetSessionId();
    setSessionId(newSid);
    setMessages([
      {
        ...initialWelcomeMessage,
        id: `welcome-${Date.now()}`,
        timestamp: new Date(),
      },
    ]);
    setNexuAnalysis(null);
    setIsNexuLoading(false);
  }, []);

  const handleSelectTopic = (topic: string) => {
    setPresetTopic(topic);
  };

  return (
    <div className="app-shell flex min-h-[100dvh] w-full flex-col overflow-hidden text-[#252525] antialiased lg:h-screen lg:w-screen">
      <Header
        onResetSession={handleResetSession}
        onToggleMobilePanel={() => setIsMobilePanelOpen((prev) => !prev)}
      />

      <main className="app-workspace flex-1 min-h-0 overflow-hidden">
        <div className="workspace-grid h-full min-h-0 w-full">
          <section className="workspace-panel workspace-panel--chat min-w-0 flex">
            <div className="flex h-full min-h-0 w-full flex-col">
              <MessageList
                messages={messages}
                isLoading={isLoading}
                onSelectTopic={handleSelectTopic}
              />

              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                inputPreset={presetTopic}
              />
            </div>
          </section>

          <section className="workspace-panel workspace-panel--right hidden min-w-0 lg:block">
            <NexuPanel
              analysis={nexuAnalysis}
              isLoading={isNexuLoading}
              sessionId={sessionId}
            />
          </section>
        </div>
      </main>

      <div
        className={`fixed inset-0 z-40 lg:hidden ${isMobilePanelOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!isMobilePanelOpen}
      >
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ease-out ${
            isMobilePanelOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobilePanelOpen(false)}
        />

        <aside
          className={`absolute right-0 top-0 flex h-full w-[90vw] max-w-[420px] flex-col border-l border-[var(--border)] bg-[rgba(250,249,246,0.98)] shadow-[0_24px_60px_rgba(40,35,25,0.16)] transition-transform duration-300 ease-out ${
            isMobilePanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-4">
            <div className="min-w-0">
              <h2 className="truncate text-[16px] font-semibold tracking-tight text-[#252525]">
                NEXU
              </h2>
              <p className="mt-0.5 text-xs text-[#74706A]">Análisis del caso</p>
            </div>

            <button
              type="button"
              onClick={() => setIsMobilePanelOpen(false)}
              className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[#74706A] transition-colors duration-150 hover:border-[#FF641E]/30 hover:bg-[#FFF3EA] hover:text-[#FF641E]"
              aria-label="Cerrar panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4">
            <div className="space-y-4 pb-4">
              <NexuPanel
                analysis={nexuAnalysis}
                isLoading={isNexuLoading}
                sessionId={sessionId}
                showSessionInfo={false}
                isDrawer
              />

              <SessionInfoPanel sessionId={sessionId} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
