import type { ChatResponse, DeleteResponse, ExpenseRecord, StatsData } from '../types';

export async function sendChat(message: string): Promise<ChatResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `请求失败 (${res.status})`);
  }

  return res.json();
}

export async function deleteEntry(id: number): Promise<DeleteResponse> {
  const res = await fetch('/api/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `删除失败 (${res.status})`);
  }

  return res.json();
}

export async function fetchEntries(): Promise<ExpenseRecord[]> {
  const res = await fetch('/api/entries');
  if (!res.ok) throw new Error(`加载失败 (${res.status})`);
  return res.json();
}

export async function fetchStats(): Promise<StatsData> {
  const res = await fetch('/api/stats');
  if (!res.ok) throw new Error(`加载失败 (${res.status})`);
  return res.json();
}
