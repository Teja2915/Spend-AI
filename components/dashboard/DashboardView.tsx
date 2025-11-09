import React from 'react';
import { useAnalyticsData } from '../../hooks/useAnalyticsData';
import { OverviewCard, SkeletonCard } from './OverviewCard';
import { InvoiceTrendChart } from './InvoiceTrendChart';
import { VendorSpendChart } from './VendorSpendChart';
import { CategorySpendChart } from './CategorySpendChart';
import { CashOutflowChart } from './CashOutflowChart';
import { InvoicesTable } from './InvoicesTable';
import { Invoice, InvoiceStatus } from '../../types';

export const DashboardView: React.FC = () => {
  const { stats, invoiceTrends, topVendors, categorySpend, cashOutflow, invoices, setInvoices, isLoading } = useAnalyticsData();

  const handleUpdateInvoiceStatus = (invoiceId: string, newStatus: InvoiceStatus) => {
    const updatedInvoices = invoices.map(inv => 
        inv.id === invoiceId ? { ...inv, status: newStatus } : inv
    );
    setInvoices(updatedInvoices);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading || !stats ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <OverviewCard title="Total Spend (YTD)" value={stats.totalSpendYTD} isCurrency={true} />
            <OverviewCard title="Total Invoices Processed" value={stats.totalInvoices} />
            <OverviewCard title="Documents Uploaded" value={stats.documentsUploaded} />
            <OverviewCard title="Average Invoice Value" value={stats.avgInvoiceValue} isCurrency={true} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <InvoiceTrendChart data={invoiceTrends} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
            <CategorySpendChart data={categorySpend} isLoading={isLoading} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VendorSpendChart data={topVendors} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <CashOutflowChart data={cashOutflow} isLoading={isLoading} />
        </div>
      </div>
      
      <div>
        <InvoicesTable 
          invoices={invoices} 
          isLoading={isLoading}
          onUpdateStatus={handleUpdateInvoiceStatus}
        />
      </div>
    </div>
  );
};