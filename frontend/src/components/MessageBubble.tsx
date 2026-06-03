import type { Message } from '../hooks/useChat';
import ExpenseCard from './ExpenseCard';
import ScheduleCard from './ScheduleCard';

interface Props {
  message: Message;
  onDelete: (id: number) => void;
}

export default function MessageBubble({ message, onDelete }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 animate-fade-in ${isUser ? 'justify-end' : ''}`}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-bg-secondary border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8" y2="16" />
            <line x1="16" y1="16" x2="16" y2="16" />
          </svg>
        </div>
      )}

      <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'items-end' : ''}`}>
        {/* Text bubble */}
        <div
          className={
            isUser
              ? 'bg-accent text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed shadow-ambient'
              : 'bg-surface border border-border rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-primary leading-relaxed shadow-ambient'
          }
        >
          <p>{message.content}</p>
          <p className={`text-[10px] mt-1 ${isUser ? 'text-white/60' : 'text-muted'}`}>
            {message.time}
          </p>
        </div>

        {/* Expense/Income/Schedule cards */}
        {!message.groups?.length && message.records && message.records.length > 0 &&
          (message.intent === 'expense' || message.intent === 'income' || message.intent === 'schedule') && (
          <div className="flex flex-col gap-2 w-full">
            {message.records.map((rec) =>
              rec.type === 'schedule' ? (
                <ScheduleCard key={rec.id} record={rec} onDelete={onDelete} />
              ) : (
                <ExpenseCard key={rec.id} record={rec} onDelete={onDelete} />
              )
            )}
            {message.count && message.count > 1 && message.total !== undefined && message.total > 0 && (
              <p className="text-xs text-muted text-right mt-1">
                合计 ¥{message.total}（{message.count} 笔）
              </p>
            )}
          </div>
        )}

        {/* Mixed multi-intent groups */}
        {message.groups && message.groups.length > 1 && (
          <div className="flex flex-col gap-3 w-full">
            {message.groups.map((g, gi) => (
              <div key={gi}>
                <p className="text-xs text-muted font-medium mb-1.5 uppercase tracking-wide">
                  {g.intent === 'expense' ? '支出' : g.intent === 'income' ? '收入' : g.intent === 'schedule' ? '日程' : g.intent}
                </p>
                <div className="flex flex-col gap-2">
                  {g.records.map((rec) =>
                    rec.type === 'schedule' ? (
                      <ScheduleCard key={rec.id} record={rec} onDelete={onDelete} />
                    ) : (
                      <ExpenseCard key={rec.id} record={rec} onDelete={onDelete} />
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Query result summary */}
        {message.records && message.intent === 'query' && message.count !== undefined && message.count > 0 && (
          <div className="card">
            {message.total !== undefined && message.total > 0 && (
              <p className="text-2xl font-semibold text-expense font-mono tabular-nums">
                ¥{message.total}
              </p>
            )}
            <p className="text-xs text-muted mt-1">共 {message.count} 项</p>
            <div className="mt-3 flex flex-col gap-0">
              {message.records.map((rec) =>
                rec.type === 'schedule' ? (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between py-2 border-t border-border first:border-t-0"
                  >
                    <span className="text-sm text-primary">{rec.title}</span>
                    <span className="text-xs text-muted flex-1 mx-2 truncate">
                      {rec.category}
                    </span>
                    <span className="text-xs text-muted">{rec.time?.slice(5) || ''}</span>
                  </div>
                ) : (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between py-2 border-t border-border first:border-t-0"
                  >
                    <span className="text-sm text-primary">{rec.category}</span>
                    <span className="text-xs text-muted flex-1 mx-2 truncate">
                      {rec.note || '—'}
                    </span>
                    <span className={`text-sm font-mono tabular-nums ${
                      rec.type === 'income' ? 'text-income' : 'text-expense'
                    }`}>¥{rec.amount}</span>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
