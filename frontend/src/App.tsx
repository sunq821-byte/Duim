import { useState, useEffect, useCallback } from 'react';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import RecordsPage from './pages/RecordsPage';
import SideMenu from './components/SideMenu';
import TimelinePanel from './components/TimelinePanel';
import SettingsSheet from './components/SettingsSheet';
import { ToastProvider, useToast } from './components/Toast';
import { fetchEntries, deleteEntry } from './api';
import type { ExpenseRecord } from './types';

export type Page = 'home' | 'stats' | 'records';

function AppInner() {
  const [activePage, setActivePage] = useState<Page>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [timelineEntries, setTimelineEntries] = useState<ExpenseRecord[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (timelineOpen) {
      setTimelineLoading(true);
      fetchEntries()
        .then(setTimelineEntries)
        .catch(() => setTimelineEntries([]))
        .finally(() => setTimelineLoading(false));
    }
  }, [timelineOpen]);

  const handleTimelineDelete = useCallback(async (id: number) => {
    try {
      await deleteEntry(id);
      setTimelineEntries((prev) => prev.filter((e) => e.id !== id));
    } catch { /* ignore */ }
  }, []);

  const handleNavigate = (page: string) => {
    if (page === 'timeline') {
      setTimelineOpen(true);
    } else if (page === 'settings') {
      setSettingsOpen(true);
    } else if (page === 'labels') {
      showToast('标签管理 (即将推出)', 'info');
    } else {
      setActivePage(page as Page);
    }
  };

  return (
    <div className="h-dvh w-full flex flex-col bg-bg-primary relative overflow-hidden">

      {/* Top bar */}
      <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-surface/80 backdrop-blur-xl border-b border-border/60 z-30">
        <button
          onClick={() => setMenuOpen(true)}
          className="w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-[3px] text-muted hover:text-accent transition-colors"
          aria-label="打开菜单"
        >
          <span className="block w-[18px] h-[2px] bg-current rounded-full transition-all" />
          <span className="block w-[18px] h-[2px] bg-current rounded-full transition-all" />
          <span className="block w-[18px] h-[2px] bg-current rounded-full transition-all" />
        </button>

        <span className="text-base font-semibold text-primary tracking-wide">Dium</span>

        <button
          onClick={() => setSettingsOpen(true)}
          className="w-8 h-8 rounded-full bg-bg-secondary border border-border flex items-center justify-center hover:border-accent/30 transition-colors"
          aria-label="用户"
        >
          <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </button>
      </header>

      {/* Page content */}
      <div className={activePage === 'home' ? 'flex-1 min-h-0 flex flex-col' : 'hidden'}>
        <HomePage />
      </div>
      <div className={activePage === 'stats' ? 'flex-1 min-h-0 flex flex-col' : 'hidden'}>
        <StatsPage activePage={activePage} />
      </div>
      <div className={activePage === 'records' ? 'flex-1 min-h-0 flex flex-col' : 'hidden'}>
        <RecordsPage activePage={activePage} />
      </div>

      {/* Side menu */}
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      {/* Timeline panel */}
      <TimelinePanel
        isOpen={timelineOpen}
        onClose={() => setTimelineOpen(false)}
        entries={timelineEntries}
        loading={timelineLoading}
        onDelete={handleTimelineDelete}
      />

      {/* Settings sheet */}
      <SettingsSheet
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}
