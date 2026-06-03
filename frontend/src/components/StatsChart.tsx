import type { StatsData } from '../types';

const CATEGORY_BAR_COLORS: Record<string, string> = {
  '餐饮': 'bg-amber-400',
  '早餐': 'bg-amber-400',
  '午餐': 'bg-amber-400',
  '晚餐': 'bg-amber-400',
  '零食': 'bg-amber-400',
  '交通': 'bg-blue-400',
  '打车': 'bg-blue-400',
  '地铁': 'bg-blue-400',
  '公交': 'bg-blue-400',
  '购物': 'bg-pink-400',
  '娱乐': 'bg-purple-400',
  '医疗': 'bg-emerald-400',
  '教育': 'bg-orange-400',
  '住房': 'bg-cyan-400',
  '其他': 'bg-stone-400',
  '工资': 'bg-emerald-400',
  '奖金': 'bg-yellow-400',
  '投资': 'bg-indigo-400',
  '兼职': 'bg-teal-400',
  '红包': 'bg-red-400',
  '退款': 'bg-gray-400',
};

interface Props {
  stats: StatsData | null;
  loading: boolean;
}

export default function StatsChart({ stats, loading }: Props) {
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

  if (!stats || (stats.expenseTotal === 0 && stats.incomeTotal === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-bg-secondary flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-primary mb-1">暂无统计数据</h3>
        <p className="text-sm text-muted">记录几笔事务后，这里会显示统计图表</p>
      </div>
    );
  }

  const hasExpense = stats.expenseCount > 0;
  const hasIncome = stats.incomeCount > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Monthly totals */}
      <div className="flex gap-3">
        <div className="flex-1 card text-center">
          <p className="text-xs text-muted mb-1">本月支出</p>
          <p className="text-xl font-semibold text-expense font-mono tabular-nums">
            ¥{stats.expenseTotal}
          </p>
          <p className="text-xs text-muted mt-1">共 {stats.expenseCount} 笔</p>
        </div>
        <div className="flex-1 card text-center">
          <p className="text-xs text-muted mb-1">本月收入</p>
          <p className="text-xl font-semibold text-income font-mono tabular-nums">
            ¥{stats.incomeTotal}
          </p>
          <p className="text-xs text-muted mt-1">共 {stats.incomeCount} 笔</p>
        </div>
      </div>

      {/* Expense category breakdown */}
      {hasExpense && (
        <div className="card">
          <h3 className="text-sm font-semibold text-primary mb-4">支出分类占比</h3>
          <div className="flex flex-col gap-3">
            {stats.expenseBreakdown.map((cat) => {
              const maxPct = Math.max(...stats.expenseBreakdown.map((c) => c.percentage), 1);
              return (
                <div key={cat.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-primary">{cat.category}</span>
                    <span className="font-mono tabular-nums text-muted">
                      ¥{cat.amount} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${CATEGORY_BAR_COLORS[cat.category] || 'bg-stone-400'}`}
                      style={{ width: `${(cat.percentage / maxPct) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Income category breakdown */}
      {hasIncome && (
        <div className="card">
          <h3 className="text-sm font-semibold text-primary mb-4">收入分类占比</h3>
          <div className="flex flex-col gap-3">
            {stats.incomeBreakdown.map((cat) => {
              const maxPct = Math.max(...stats.incomeBreakdown.map((c) => c.percentage), 1);
              return (
                <div key={cat.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-primary">{cat.category}</span>
                    <span className="font-mono tabular-nums text-muted">
                      ¥{cat.amount} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${CATEGORY_BAR_COLORS[cat.category] || 'bg-stone-400'}`}
                      style={{ width: `${(cat.percentage / maxPct) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily trend */}
      {stats.dailyTotals.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-primary mb-4">近7天趋势</h3>
          <div className="flex flex-col gap-4">
            {(() => {
              const maxExpense = Math.max(...stats.dailyTotals.map((d) => d.expense), 1);
              const maxIncome = Math.max(...stats.dailyTotals.map((d) => d.income), 1);
              const maxVal = Math.max(maxExpense, maxIncome, 1);

              return (
                <>
                  <div>
                    <p className="text-[10px] text-muted mb-2">支出</p>
                    <div className="flex items-end gap-2 h-20">
                      {stats.dailyTotals.map((day) => {
                        const height = (day.expense / maxVal) * 100;
                        return (
                          <div key={`exp-${day.date}`} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] text-muted font-mono">
                              {day.expense > 0 ? `¥${day.expense}` : ''}
                            </span>
                            <div
                              className="w-full bg-amber-400 rounded-t-md transition-all duration-500 min-h-[4px]"
                              style={{ height: `${Math.max(height, 4)}%` }}
                            />
                            <span className="text-[10px] text-muted">
                              {day.date.slice(5)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-muted mb-2">收入</p>
                    <div className="flex items-end gap-2 h-20">
                      {stats.dailyTotals.map((day) => {
                        const height = (day.income / maxVal) * 100;
                        return (
                          <div key={`inc-${day.date}`} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] text-muted font-mono">
                              {day.income > 0 ? `¥${day.income}` : ''}
                            </span>
                            <div
                              className="w-full bg-emerald-400 rounded-t-md transition-all duration-500 min-h-[4px]"
                              style={{ height: `${Math.max(height, 4)}%` }}
                            />
                            <span className="text-[10px] text-muted">
                              {day.date.slice(5)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
