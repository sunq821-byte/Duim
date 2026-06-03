import { useState } from 'react';
import type { ExpenseRecord } from '../types';

const REPEAT_LABELS: Record<string, string> = {
  'daily': '每天',
  'weekly': '每周',
  'monthly': '每月',
  'yearly': '每年',
};

interface Props {
  record: ExpenseRecord;
  onDelete: (id: number) => void;
}

export default function ScheduleCard({ record, onDelete }: Props) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => onDelete(record.id), 300);
  };

  const showRemind =
    record.remind_time &&
    record.remind_time !== record.time;

  const repeatLabel = record.repeat_type
    ? REPEAT_LABELS[record.repeat_type]
    : null;

  return (
    <div
      className={`card transition-all duration-300 ${
        deleting
          ? 'opacity-0 scale-95'
          : 'hover:shadow-ambient-md'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
          {record.category || '日程'}
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

      <p className="text-lg font-semibold text-schedule">
        {record.title || '日程'}
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-muted">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {record.time}
        </span>

        {showRemind && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            提醒 {record.remind_time}
          </span>
        )}

        {repeatLabel && (
          <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-500">
            {repeatLabel}
          </span>
        )}

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
