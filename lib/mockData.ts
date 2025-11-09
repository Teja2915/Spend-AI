import type { Invoice, InvoiceStatus } from '../types';

const VENDORS = [
  { id: 'ven_1', name: 'Office Supplies Inc.' },
  { id: 'ven_2', name: 'Cloud Services LLC' },
  { id: 'ven_3', name: 'Marketing Agency Co.' },
  { id: 'ven_4', name: 'Software Solutions' },
  { id: 'ven_5', name: 'Logistics Partner' },
  { id: 'ven_6', name: 'Consulting Group' },
  { id: 'ven_7', name: 'Hardware Universe' },
  { id: 'ven_8', name: 'Travel Experts' },
  { id: 'ven_9', name: 'Utilities Provider' },
  { id: 'ven_10', name: 'Catering Services' },
  { id: 'ven_11', name: 'Legal Advisors' },
  { id: 'ven_12', name: 'Maintenance Pros' },
];

const CATEGORIES = ['Office Supplies', 'Software', 'Marketing', 'Utilities', 'Travel', 'Consulting', 'Logistics', 'Hardware', 'Food & Beverage', 'Legal', 'Maintenance'];
const STATUSES: InvoiceStatus[] = ['paid', 'pending', 'not paid'];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateRandomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

const createMockInvoice = (id: number): Invoice => {
  const processedDate = generateRandomDate(new Date(2023, 0, 1), new Date());
  const dueDate = new Date(processedDate);
  dueDate.setDate(dueDate.getDate() + 30);
  
  let status: InvoiceStatus = getRandomElement(STATUSES);
  if (new Date(dueDate) < new Date() && status === 'pending') {
      status = 'not paid';
  }


  return {
    id: `inv_${id}`,
    invoice_number: `INV-${20230000 + id}`,
    vendor: getRandomElement(VENDORS),
    amount: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
    due_date: dueDate.toISOString().split('T')[0],
    processed_date: processedDate,
    category: getRandomElement(CATEGORIES),
    status: status,
  };
};

export const MOCK_INVOICES: Invoice[] = Array.from({ length: 200 }, (_, i) => createMockInvoice(i + 1));