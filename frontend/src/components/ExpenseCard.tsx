import { useState } from 'react';
import type { ExpenseRecord } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  '餐饮': 'bg-amber-50 text-amber-600',
  '早餐': 'bg-amber-50 text-amber-600',
  '午餐': 'bg-amber-50 text-amber-600',
  '晚餐': 'bg-amber-50 text-amber-600',
  '零食': 'bg-amber-50 text-amber-600',
  '交通': 'bg-blue-50 text-blue-600',
  '打车': 'bg-blue-50 text-blue-600',
  '地铁': 'bg-blue-50 text-blue-600',
  '公交': 'bg-blue-50 text-blue-600',
  '购物': 'bg-pink-50 text-pink-600',
  '娱乐': 'bg-purple-50 text-purple-600',
  '医疗': 'bg-emerald-50 text-emerald-600',
  '教育': 'bg-orange-50 text-orange-600',
  '住房': 'bg-cyan-50 text-cyan-600',
};

function getCatStyle(cat: string) {
  return CATEGORY_COLORS[cat] || 'bg-stone-50 text-stone-600';
}

interface Props {
  record: ExpenseRecord;
  onDelete: (id: number) => void;
}

export default function ExpenseCard({ record, onDelete }: Props) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => onDelete(record.id), 300);
  };

  return (
    <div
      className={`card transition-all duration-300 ${
        deleting ? 'opacity-0 scale-95' : 'hover:shadow-ambient-md'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getCatStyle(record.category)}`}>
          {record.category}
        </span>
        <button
          onClick={handleDelete}
          className="w-6 h-6 rounded-full flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="删除"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <p className={`text-2xl font-semibold font-mono tabular-nums ${
        record.type === 'income' ? 'text-income' : 'text-expense'
      }`}>
        ¥{record.amount}
      </p>
      <div className="flex gap-4 mt-3 text-xs text-muted">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {record.time}
        </span>
        {record.note && (
          <span className="flex items-center gap-1 truncate">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="truncate">{record.note}</span>
          </span>
        )}
      </div>
    </div>
  );
}
