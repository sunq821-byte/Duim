export interface ExpenseRecord {
  id: number;
  type: 'expense' | 'income' | 'schedule';
  category: string;
  amount?: number;
  time: string;
  title?: string;
  remind_time?: string;
  repeat_type?: string;
  note: string;
}

export interface IntentGroup {
  intent: 'expense' | 'income' | 'schedule' | 'modify' | 'delete' | 'query';
  records: ExpenseRecord[];
  total: number;
  count: number;
  feedback: string;
}

export interface ChatResponse {
  intent: 'expense' | 'income' | 'schedule' | 'modify' | 'delete' | 'query' | 'chat';
  success: boolean;
  feedback: string;
  records: ExpenseRecord[];
  total: number;
  count: number;
  date_range?: { start: string; end: string };
  error?: string;
  groups?: IntentGroup[];
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface StatsData {
  expenseTotal: number;
  incomeTotal: number;
  expenseCount: number;
  incomeCount: number;
  expenseBreakdown: CategoryBreakdown[];
  incomeBreakdown: CategoryBreakdown[];
  dailyTotals: { date: string; expense: number; income: number }[];
  recentRecords: ExpenseRecord[];
}

export interface DeleteResponse {
  success: boolean;
  removed?: number;
  error?: string;
}
