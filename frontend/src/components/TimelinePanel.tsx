import { useEffect, type FC } from 'react';
import type { ExpenseRecord } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entries: ExpenseRecord[];
  loading: boolean;
  onDelete: (id: number) => void;
}

const TAG_STYLES: Record<string, string> = {
  expense: 'bg-amber-50 text-amber-600',
  income: 'bg-emerald-50 text-emerald-600',
  schedule: 'bg-blue-50 text-blue-600',
};

const TAG_LABELS: Record<string, string> = {
  expense: '账目',
  income: '收入',
  schedule: '日程',
};

const DOT_COLORS: Record<string, string> = {
  expense: 'bg-expense',
  income: 'bg-income',
  schedule: 'bg-schedule',
};

// Group entries by date
function groupByDate(entries: ExpenseRecord[]): [string, ExpenseRecord[]][] {
  const map = new Map<string, ExpenseRecord[]>();
  entries.forEach((e) => {
    const dateLabel = e.time.length >= 10 ? e.time.slice(0, 10) : e.time;
    const list = map.get(dateLabel) || [];
    list.push(e);
    map.set(dateLabel, list);
  });
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

// Format date to a friendly label
function formatDateLabel(date: string): string {
  const today = new Date();
  const d = new Date(date);
  const diff = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return '今天';
  if (diff === 1) return '昨天';
  return date;
}

const TimelinePanel: FC<Props> = ({ isOpen, onClose, entries, loading, onDelete }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const grouped = groupByDate(entries);

  return (
    <>
      {/* Overlay (mobile) */}
      <div
        className="fixed inset-0 bg-black/20 z-40 md:hidden transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="fixed top-0 right-0 h-full w-full sm:w-[340px] bg-surface z-50 flex flex-col shadow-ambient-lg border-l border-border animate-menu-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <h2 className="text-base font-semibold text-primary">时光轴</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-bg-secondary transition-colors"
            aria-label="关闭"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted">
              <svg className="w-8 h-8 animate-spin mb-3" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-30" />
                <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <p className="text-sm">加载中...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-14 h-14 rounded-full bg-bg-secondary flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-primary mb-1">暂无记录</h3>
              <p className="text-sm text-muted">开始记录你的事务</p>
            </div>
          ) : (
            <div className="flex flex-col py-2">
              {grouped.map(([date, records]) => (
                <div key={date}>
                  <div className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">
                    {formatDateLabel(date)} · {date.slice(5)}
                  </div>
                  {records.map((rec) => {
                    const tagType = rec.type === 'income' ? 'income' : rec.type === 'schedule' ? 'schedule' : 'expense';
                    return (
                      <div
                        key={rec.id}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-bg-secondary transition-colors border-b border-border/40 last:border-b-0"
                      >
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${DOT_COLORS[tagType]}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted font-mono">
                              {rec.time.length >= 16 ? rec.time.slice(11, 16) : rec.time.slice(11) || rec.time}
                            </span>
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${TAG_STYLES[tagType]}`}>
                              {TAG_LABELS[tagType]}
                            </span>
                          </div>
                          <div className="text-sm text-primary mt-0.5">
                            {rec.type === 'schedule' ? rec.title : (rec.note || rec.category)}
                          </div>
                        </div>
                        {rec.type !== 'schedule' && (
                          <span className={`text-sm font-semibold font-mono tabular-nums ${
                            rec.type === 'income' ? 'text-income' : 'text-expense'
                          }`}>
                            ¥{rec.amount}
                          </span>
                        )}
                        <button
                          onClick={() => onDelete(rec.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-muted/50 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                          aria-label="删除"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default TimelinePanel;
