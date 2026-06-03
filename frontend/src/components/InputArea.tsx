import { useState, useRef, useEffect, type KeyboardEvent } from 'react';

type AIStatus = 'standby' | 'listening' | 'processing' | 'complete';

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
  aiStatus: AIStatus;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
}

export default function InputArea({ onSend, disabled, aiStatus, onVoiceStart, onVoiceStop }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isListening = aiStatus === 'listening';

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [value]);

  const handleSend = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasText = value.trim().length > 0;

  return (
    <div className="flex-shrink-0 px-4 py-4">
      <div className="max-w-[600px] mx-auto">
        {isListening ? (
          /* Recording waveform */
          <div className="flex items-center justify-center gap-1 h-12 px-6 bg-surface border border-accent/30 rounded-3xl shadow-ambient">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-accent"
                style={{
                  height: '16px',
                  animation: 'waveform 0.5s ease-in-out infinite alternate',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
            <button
              onClick={onVoiceStop}
              className="ml-4 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
              aria-label="停止录音"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
          </div>
        ) : (
          /* Capsule text input */
          <div className="relative flex items-center bg-surface border border-border rounded-3xl h-12 pl-1 pr-4 transition-all duration-300 focus-within:border-accent/40 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]">
            <button
              onClick={onVoiceStart}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mr-0.5 text-muted hover:text-accent hover:bg-accent-light transition-colors active:scale-95"
              aria-label="语音输入"
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-sm text-primary placeholder:text-muted py-1 leading-relaxed self-center"
              placeholder="键入事务..."
              style={{ minHeight: 24, maxHeight: 120 }}
            />
            <button
              onClick={handleSend}
              disabled={!hasText || disabled}
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ml-2 transition-all active:scale-95 ${
                hasText && !disabled
                  ? 'bg-accent text-white hover:bg-accent-hover'
                  : 'text-muted/40 cursor-not-allowed'
              }`}
              aria-label="发送"
            >
              {disabled && hasText ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-30" />
                  <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
