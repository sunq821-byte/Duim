import { useState, useEffect, type FC } from 'react';
import { useToast } from './Toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsSheet: FC<Props> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.body.style.filter = 'invert(0.92) hue-rotate(180deg)';
      document.body.style.transition = 'filter 0.5s ease';
      showToast('已切换深色模式 (实验性)', 'info');
    } else {
      document.body.style.filter = '';
      showToast('已切换浅色模式', 'info');
    }
  };

  const handleAction = (action: string) => {
    const messages: Record<string, string> = {
      voice: '语音设置 (即将推出)',
      data: '数据管理 (即将推出)',
      notifications: '通知管理 (即将推出)',
      about: '关于钦会 Dium v0.1.0',
    };
    showToast(messages[action] || '即将推出', 'info');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl shadow-ambient-lg animate-sheet-up max-h-[70vh] overflow-y-auto">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-5 pb-8">
          <h2 className="text-base font-semibold text-primary mb-5">设置</h2>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between py-3 border-b border-border/60 hover:bg-bg-secondary/50 transition-colors rounded-lg px-2 -mx-2"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
              <span className="text-sm text-primary">深色模式</span>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors duration-300 flex items-center px-0.5 ${darkMode ? 'bg-accent' : 'bg-border'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* Voice settings */}
          <button
            onClick={() => handleAction('voice')}
            className="w-full flex items-center justify-between py-3 border-b border-border/60 hover:bg-bg-secondary/50 transition-colors rounded-lg px-2 -mx-2"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
              <span className="text-sm text-primary">语音与交互</span>
            </div>
            <span className="text-muted text-lg">{'›'}</span>
          </button>

          {/* Data management */}
          <button
            onClick={() => handleAction('data')}
            className="w-full flex items-center justify-between py-3 border-b border-border/60 hover:bg-bg-secondary/50 transition-colors rounded-lg px-2 -mx-2"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
              <span className="text-sm text-primary">数据管理</span>
            </div>
            <span className="text-muted text-lg">{'›'}</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => handleAction('notifications')}
            className="w-full flex items-center justify-between py-3 border-b border-border/60 hover:bg-bg-secondary/50 transition-colors rounded-lg px-2 -mx-2"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <span className="text-sm text-primary">通知</span>
            </div>
            <span className="text-muted text-lg">{'›'}</span>
          </button>

          {/* About */}
          <button
            onClick={() => handleAction('about')}
            className="w-full flex items-center justify-between py-3 hover:bg-bg-secondary/50 transition-colors rounded-lg px-2 -mx-2"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span className="text-sm text-primary">关于</span>
            </div>
            <span className="text-muted text-lg">{'›'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsSheet;
