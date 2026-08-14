import React, { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from './types';
import { getOrCreateSessionId, resetSessionId } from './utils/session';
import { sendChatMessage, getWebhookUrl } from './services/chatService';
import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { SessionInfoPanel } from './components/SessionInfoPanel';
import { MessageSquare, Info, ShieldCheck } from 'lucide-react';

export default function App() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [presetTopic, setPresetTopic] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chat' | 'info'>('chat');

  // Initial welcome message requirement
  const initialWelcomeMessage: ChatMessage = {
    id: 'welcome-01',
    sender: 'assistant',
    text: 'Hola, soy el asistente virtual. Cuéntame qué problema estás teniendo con tu equipo y te ayudaré a revisarlo.',
    timestamp: new Date(),
  };

  // Initialize session and state on mount
  useEffect(() => {
    const sid = getOrCreateSessionId();
    setSessionId(sid);
    setMessages([initialWelcomeMessage]);
  }, []);

  // Handler for user sending a message
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

      // 1. Immediately show user message
      setMessages((prev) => [...prev, newUserMessage]);
      setIsLoading(true);

      try {
        const botAnswer = await sendChatMessage(text, sessionId, getWebhookUrl());

        // 3. Append assistant response
        const botMsgId = `bot-${Date.now()}`;
        const newBotMessage: ChatMessage = {
          id: botMsgId,
          sender: 'assistant',
          text: botAnswer,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newBotMessage]);
      } catch (error) {
        console.error('Error al enviar mensaje desde App:', error);

        // Required controlled error message
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
    [isLoading, sessionId]
  );

  // Handler for restarting session
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
  }, []);

  const handleSelectTopic = (topic: string) => {
    setPresetTopic(topic);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden antialiased select-none">
      
      {/* Top Header */}
      <Header
        onResetSession={handleResetSession}
      />

      {/* Mobile Navigation Tabs (for small screens) */}
      <div className="flex lg:hidden bg-slate-900 border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 flex items-center justify-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'chat'
              ? 'border-blue-500 text-blue-400 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat de Soporte</span>
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-2.5 flex items-center justify-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'info'
              ? 'border-blue-500 text-blue-400 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Detalles de Sesión</span>
        </button>
      </div>

      {/* Main Container */}
      <main className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto shadow-2xl bg-slate-950">
        
        {/* Chat Area */}
        <div
          className={`flex-1 flex flex-col h-full overflow-hidden ${
            activeTab === 'chat' ? 'flex' : 'hidden lg:flex'
          }`}
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
        </div>

        {/* Sidebar / Info Panel */}
        <div
          className={`h-full overflow-y-auto ${
            activeTab === 'info' ? 'flex w-full' : 'hidden lg:flex'
          }`}
        >
          <SessionInfoPanel sessionId={sessionId} />
        </div>

      </main>

    </div>
  );
}
