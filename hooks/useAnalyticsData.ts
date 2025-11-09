
import { useState, useEffect, useMemo } from 'react';
import { MOCK_INVOICES } from '../lib/mockData';
import type { Stats, InvoiceTrendData, VendorSpendData, CategorySpendData, CashOutflowData, Invoice } from '../types';

export const useAnalyticsData = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setInvoices(MOCK_INVOICES);
      setIsLoading(false);
    }, 1000); // Simulate network delay

    return () => clearTimeout(timer);
  }, []);

  const analyticsData = useMemo(() => {
    if (invoices.length === 0) {
      return {
        stats: null,
        invoiceTrends: [],
        topVendors: [],
        categorySpend: [],
        cashOutflow: [],
      };
    }

    const stats: Stats = {
      totalSpendYTD: invoices.reduce((sum, inv) => sum + inv.amount, 0),
      totalInvoices: invoices.length,
      documentsUploaded: invoices.length,
      avgInvoiceValue: invoices.reduce((sum, inv) => sum + inv.amount, 0) / invoices.length,
    };

    const invoiceTrends = invoices.reduce((acc, inv) => {
      const month = new Date(inv.processed_date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!acc[month]) {
        acc[month] = { value: 0, volume: 0, date: new Date(inv.processed_date) };
      }
      acc[month].value += inv.amount;
      acc[month].volume += 1;
      return acc;
    }, {} as Record<string, { value: number; volume: number, date: Date }>);
    
    const sortedTrends: InvoiceTrendData[] = Object.entries(invoiceTrends)
      // FIX: Replaced object spread syntax with explicit property assignment to resolve "Spread types may only be created from object types" error.
      // FIX: Explicitly typed `data` to resolve properties from what was an 'unknown' type.
      .map(([month, data]: [string, { value: number; volume: number; date: Date }]) => ({
        month,
        value: data.value,
        volume: data.volume,
        date: data.date,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const topVendors = Object.values(
      invoices.reduce((acc, inv) => {
        if (!acc[inv.vendor.name]) {
          acc[inv.vendor.name] = { name: inv.vendor.name, spend: 0 };
        }
        acc[inv.vendor.name].spend += inv.amount;
        return acc;
      }, {} as Record<string, VendorSpendData>)
    ).sort((a: VendorSpendData, b: VendorSpendData) => b.spend - a.spend).slice(0, 10);
    
    const categorySpend = Object.values(
      invoices.reduce((acc, inv) => {
        if (!acc[inv.category]) {
          acc[inv.category] = { name: inv.category, value: 0 };
        }
        acc[inv.category].value += inv.amount;
        return acc;
      }, {} as Record<string, CategorySpendData>)
    );

    const cashOutflow = invoices
      .filter(inv => inv.status !== 'paid')
      .reduce((acc, inv) => {
        const date = inv.due_date;
        if (!acc[date]) {
          acc[date] = { date, amount: 0 };
        }
        acc[date].amount += inv.amount;
        return acc;
      }, {} as Record<string, CashOutflowData>);
      
    const sortedCashOutflow = Object.values(cashOutflow).sort((a: CashOutflowData, b: CashOutflowData) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 30);

    return {
      stats,
      invoiceTrends: sortedTrends,
      topVendors,
      categorySpend,
      cashOutflow: sortedCashOutflow,
    };
  }, [invoices]);

  return { ...analyticsData, invoices, setInvoices, isLoading };
};
