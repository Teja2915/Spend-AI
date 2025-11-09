export interface Vendor {
  id: string;
  name: string;
}

export type InvoiceStatus = 'paid' | 'pending' | 'not paid';

export interface Invoice {
  id: string;
  invoice_number: string;
  vendor: Vendor;
  amount: number;
  due_date: string;
  processed_date: string;
  category: string;
  status: InvoiceStatus;
}

export interface Stats {
  totalSpendYTD: number;
  totalInvoices: number;
  documentsUploaded: number;
  avgInvoiceValue: number;
}

export interface InvoiceTrendData {
  month: string;
  value: number;
  volume: number;
  date: Date;
}

export interface VendorSpendData {
  name: string;
  spend: number;
}

export interface CategorySpendData {
  name: string;
  value: number;
}

export interface CashOutflowData {
  date: string;
  amount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  isLoading?: boolean;
  error?: string;
  sql?: string;
  data?: Record<string, any>[];
  responseText?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  mobile: string;
  profilePicUrl: string;
}

export type View = 'dashboard' | 'chat' | 'profile' | 'login';
export type Theme = 'light' | 'dark';
