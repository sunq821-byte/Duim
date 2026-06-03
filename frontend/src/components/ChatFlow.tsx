import { useEffect, type RefObject } from 'react';
import type { Message } from '../hooks/useChat';
import MessageBubble from './MessageBubble';

interface Props {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
  onDeleteRecord: (id: number) => void;
  onExampleClick: (text: string) => void;
}

export default function ChatFlow({ messages, isLoading, messagesEndRef, onDeleteRecord }: Props) {
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, messagesEndRef]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} onDelete={onDeleteRecord} />
      ))}
      {isLoading && (
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
            </svg>
          </div>
          <div className="bg-bg-secondary border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-ambient">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: '0s' }} />
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
