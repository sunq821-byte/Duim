import { useState, useCallback, useRef } from 'react';
import type { ChatResponse, ExpenseRecord, IntentGroup } from '../types';
import { sendChat, deleteEntry as deleteEntryApi } from '../api';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  records?: ExpenseRecord[];
  intent?: string;
  total?: number;
  count?: number;
  time: string;
  groups?: IntentGroup[];
}

let msgId = 0;

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allEntries, setAllEntries] = useState<ExpenseRecord[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addMessage = useCallback((msg: Omit<Message, 'id' | 'time'>) => {
    const newMsg: Message = {
      ...msg,
      id: String(++msgId),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    return newMsg;
  }, []);

  const send = useCallback(async (text: string) => {
    addMessage({ role: 'user', content: text });
    setIsLoading(true);

    try {
      const data: ChatResponse = await sendChat(text);

      const isRecordIntent = (i: string) =>
        i === 'expense' || i === 'income' || i === 'schedule';

      if (data.success && data.groups && data.groups.length > 1) {
        // Mixed multi-intent: use groups for display, skip flat records
        addMessage({
          role: 'assistant',
          content: data.feedback,
          intent: data.intent,
          total: data.total,
          count: data.count,
          groups: data.groups,
        });

        const allRecs = data.groups.flatMap(g => g.records);
        setAllEntries(prev => [...prev, ...allRecs]);
      } else if (data.success && isRecordIntent(data.intent)) {
        const typeLabel = data.intent === 'income' ? '收入' : data.intent === 'schedule' ? '日程' : '支出';
        const summary = data.intent === 'schedule'
          ? `已记录：${data.records[0]?.title || ''} 日程｜${data.records[0]?.time || ''}`
          : data.count > 1
            ? `已记录以下 ${data.count} 笔事务：`
            : `已记录：${data.records[0]?.category || ''} ${typeLabel} ¥${data.total}`;

        addMessage({
          role: 'assistant',
          content: summary,
          records: data.records,
          intent: data.intent,
          total: data.total,
          count: data.count,
        });

        setAllEntries(prev => [...prev, ...data.records]);
      } else if (data.success && data.intent === 'query') {
        addMessage({
          role: 'assistant',
          content: data.feedback,
          records: data.records,
          intent: data.intent,
          total: data.total,
          count: data.count,
        });
      } else {
        // delete, modify, chat, or any other intent — render feedback text
        addMessage({
          role: 'assistant',
          content: data.feedback || '收到，但我还不太理解。试试「午饭35元」这样的格式？',
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '连接失败，请确认服务已启动。';
      addMessage({ role: 'assistant', content: msg });
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  const deleteMsgRecord = useCallback(async (entryId: number) => {
    try {
      await deleteEntryApi(entryId);
      setAllEntries(prev => prev.filter(e => e.id !== entryId));
      setMessages(prev =>
        prev.map(m => ({
          ...m,
          records: m.records?.filter(r => r.id !== entryId),
        }))
      );
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    messages,
    isLoading,
    allEntries,
    messagesEndRef,
    send,
    deleteMsgRecord,
  };
}
