import { useState, useMemo } from 'react';
import type { ExpenseRecord } from '../types';

interface Props {
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

export default function TransactionList({ entries, loading, onDelete }: Props) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.category.includes(q) ||
        (e.title && e.title.toLowerCase().includes(q)) ||
        e.note.toLowerCase().includes(q) ||
        String(e.amount || '').includes(q) ||
        e.time.includes(q)
    );
  }, [entries, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, ExpenseRecord[]>();
    filtered.forEach((e) => {
      const dateLabel = e.time.length >= 10 ? e.time.slice(0, 10) : e.time;
      const list = map.get(dateLabel) || [];
      list.push(e);
      map.set(dateLabel, list);
    });
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted">
        <svg className="w-8 h-8 animate-spin mb-3" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-30" />
          <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="text-sm">加载中...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-bg-secondary flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-primary mb-1">暂无事务记录</h3>
        <p className="text-sm text-muted">回到首页开始记录你的第一笔事务</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="px-4">
        <div className="relative max-w-[400px]">
          <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索事务..."
            className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-3xl text-sm text-primary placeholder:text-muted outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
          />
        </div>
      </div>

      {/* Grouped timeline list */}
      {grouped.map(([date, records]) => (
        <div key={date}>
          <h3 className="px-4 text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            {date}
          </h3>
          <div className="flex flex-col">
            {records.map((rec) => {
              const tagType = rec.type === 'income' ? 'income' : rec.type === 'schedule' ? 'schedule' : 'expense';
              return (
                <div
                  key={rec.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-bg-secondary transition-colors border-b border-border/60 last:border-b-0"
                >
                  {/* Colored dot */}
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${DOT_COLORS[tagType]}`} />

                  {/* Body */}
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

                  {/* Amount */}
                  {rec.type !== 'schedule' && (
                    <span className={`text-sm font-semibold font-mono tabular-nums ${
                      rec.type === 'income' ? 'text-income' : 'text-expense'
                    }`}>
                      ¥{rec.amount}
                    </span>
                  )}

                  {/* Delete */}
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
        </div>
      ))}

      {filtered.length === 0 && search && (
        <p className="text-center text-sm text-muted py-8">未找到匹配的事务</p>
      )}
    </div>
  );
}
