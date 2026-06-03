import { useState, useEffect } from 'react';
import StatsChart from '../components/StatsChart';
import { fetchStats } from '../api';
import type { StatsData } from '../types';

export default function StatsPage({ activePage }: { activePage: string }) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activePage !== 'stats') return;
    setLoading(true);
    fetchStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [activePage]);

  return (
    <div className="flex flex-col h-full">
      <header className="px-5 py-4 flex-shrink-0">
        <h1 className="text-lg font-semibold text-primary">统计分析</h1>
        <p className="text-sm text-muted mt-0.5">支出与收入分析</p>
      </header>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <StatsChart stats={stats} loading={loading} />
      </div>
    </div>
  );
}
