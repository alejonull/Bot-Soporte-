import React, { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from './types';
import { getOrCreateSessionId, resetSessionId } from './utils/session';
import { sendChatMessage, getWebhookUrl } from './services/chatService';
import { analyzeConversation, NexuAnalysis } from './services/nexuService';
import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { SessionInfoPanel } from './components/SessionInfoPanel';
import { MessageSquare, Info, PanelLeft } from 'lucide-react';
import { NexuPanel } from './components/NexuPanel';

export default function App() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [presetTopic, setPresetTopic] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chat' | 'nexu' | 'info'>('chat');
  const [nexuAnalysis, setNexuAnalysis] = useState<NexuAnalysis | null>(null);
  const [isNexuLoading, setIsNexuLoading] = useState<boolean>(false);

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
    <div className="app-shell flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-100 antialiased select-none">
      <Header onResetSession={handleResetSession} />

      <div className="lg:hidden border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
        <div className="grid grid-cols-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`mobile-tab ${activeTab === 'chat' ? 'mobile-tab--active' : ''}`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('nexu')}
            className={`mobile-tab ${activeTab === 'nexu' ? 'mobile-tab--active' : ''}`}
          >
            <PanelLeft className="h-4 w-4" />
            <span>NEXU</span>
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`mobile-tab ${activeTab === 'info' ? 'mobile-tab--active' : ''}`}
          >
            <Info className="h-4 w-4" />
            <span>Detalles</span>
          </button>
        </div>
      </div>

      <main className="app-workspace flex-1 min-h-0 overflow-hidden">
        <div className="workspace-grid h-full min-h-0 w-full">
          <section
            className={`
              workspace-panel workspace-panel--left
              ${activeTab === 'info' ? 'flex' : 'hidden'}
              lg:flex
            `}
          >
            <SessionInfoPanel sessionId={sessionId} onResetSession={handleResetSession} />
          </section>

          <section
            className={`
              workspace-panel workspace-panel--chat min-w-0
              ${activeTab === 'chat' ? 'flex' : 'hidden'}
              lg:flex
            `}
          >
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
          </section>

          <section
            className={`
              workspace-panel workspace-panel--right
              ${activeTab === 'nexu' ? 'flex' : 'hidden'}
              lg:flex
            `}
          >
            <NexuPanel
              analysis={nexuAnalysis}
              isLoading={isNexuLoading}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
