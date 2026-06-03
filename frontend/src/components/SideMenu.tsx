import { useState, useEffect, useCallback } from 'react';
import type { Page } from '../App';

interface MenuItem {
  key: string;
  label: string;
  svg: JSX.Element;
  badge?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activePage: Page;
  onNavigate: (page: Page | string) => void;
}

const MENU_ITEMS: MenuItem[] = [
  {
    key: 'home',
    label: '首页',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    key: 'timeline',
    label: '时光轴',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    badge: '12',
  },
  {
    key: 'stats',
    label: '统计分析',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    key: 'labels',
    label: '标签管理',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    key: 'settings',
    label: '设置',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
];

export default function SideMenu({ isOpen, onClose, activePage, onNavigate }: Props) {
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 280);
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, handleClose]);

  const handleNavigate = (key: string) => {
    onNavigate(key);
    handleClose();
  };

  if (!isOpen && !closing) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
        onClick={handleClose}
        style={{ opacity: isOpen && !closing ? 1 : 0 }}
      />

      {/* Menu panel */}
      <aside
        className="fixed top-0 left-0 h-full w-[280px] bg-surface z-50 flex flex-col shadow-ambient-lg border-r border-border transition-transform duration-300"
        style={{
          transform: isOpen && !closing ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {/* Header */}
        <div className="px-6 py-8 border-b border-border">
          <div className="w-12 h-12 rounded-full bg-bg-secondary border border-border flex items-center justify-center mb-3">
            <span className="text-lg font-semibold text-primary">陶</span>
          </div>
          <h2 className="text-base font-semibold text-primary">陶俊辉</h2>
          <p className="text-sm text-muted mt-0.5">AI Native Explorer</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {MENU_ITEMS.map((item) => {
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavigate(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all mb-0.5 ${
                  isActive
                    ? 'bg-accent-light text-accent font-medium'
                    : 'text-muted hover:text-primary hover:bg-bg-secondary'
                }`}
              >
                <span className="w-5 h-5 flex-shrink-0" style={{ stroke: 'currentColor' }}>
                  {item.svg}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-accent/10 text-accent">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border">
          <p className="text-[10px] text-muted/60 tracking-wider text-center">
            钦会 Dium v0.1.0 · AI Native
          </p>
        </div>
      </aside>
    </>
  );
}
