import { useState, useEffect, useCallback } from 'react';
import TransactionList from '../components/TransactionList';
import { fetchEntries, deleteEntry } from '../api';
import { useToast } from '../components/Toast';
import type { ExpenseRecord } from '../types';

export default function RecordsPage({ activePage }: { activePage: string }) {
  const [entries, setEntries] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (activePage !== 'records') return;
    setLoading(true);
    fetchEntries()
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [activePage]);

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deleteEntry(id);
        setEntries((prev) => prev.filter((e) => e.id !== id));
        showToast('已删除', 'success');
      } catch {
        showToast('删除失败', 'error');
      }
    },
    [showToast]
  );

  return (
    <div className="flex flex-col h-full">
      <header className="px-5 py-4 flex-shrink-0">
        <h1 className="text-lg font-semibold text-primary">时光轴</h1>
        <p className="text-sm text-muted mt-0.5">全部事务记录</p>
      </header>
      <div className="flex-1 overflow-y-auto pb-4">
        <TransactionList entries={entries} loading={loading} onDelete={handleDelete} />
      </div>
    </div>
  );
}
