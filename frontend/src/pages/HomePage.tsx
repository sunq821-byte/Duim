import { useState, useEffect, useCallback } from 'react';
import AICore from '../components/AICore';
import ChatFlow from '../components/ChatFlow';
import InputArea from '../components/InputArea';
import { useToast } from '../components/Toast';
import { useChat } from '../hooks/useChat';

type AIStatus = 'standby' | 'listening' | 'processing' | 'complete';

export default function HomePage() {
  const { messages, isLoading, allEntries, messagesEndRef, send, deleteMsgRecord } = useChat();
  const { showToast } = useToast();
  const [aiStatus, setAiStatus] = useState<AIStatus>('standby');

  const [wasLoading, setWasLoading] = useState(false);
  useEffect(() => {
    if (wasLoading && !isLoading) {
      setAiStatus('complete');
      const t = setTimeout(() => setAiStatus('standby'), 2000);
      return () => clearTimeout(t);
    }
    setWasLoading(isLoading);
  }, [isLoading, wasLoading]);

  useEffect(() => {
    if (isLoading) setAiStatus('processing');
  }, [isLoading]);

  const handleVoiceStart = useCallback(() => {
    setAiStatus('listening');
  }, []);

  const handleVoiceStop = useCallback(() => {
    setAiStatus('standby');
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      const ok = await deleteMsgRecord(id);
      showToast(ok ? '已删除' : '删除失败', ok ? 'success' : 'error');
    },
    [deleteMsgRecord, showToast]
  );

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto">
        {!hasMessages ? (
          /* Empty state — just the AI core orb */
          <div className="flex flex-col items-center justify-center min-h-full px-4 py-12">
            <AICore status={aiStatus} onClick={handleVoiceStart} />
          </div>
        ) : (
          <ChatFlow
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
            onDeleteRecord={handleDelete}
            onExampleClick={send}
          />
        )}
      </div>

      <InputArea
        onSend={send}
        disabled={isLoading}
        aiStatus={aiStatus}
        onVoiceStart={handleVoiceStart}
        onVoiceStop={handleVoiceStop}
      />
    </div>
  );
}
