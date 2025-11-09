
import React, { useState, useMemo } from 'react';
import type { Invoice, InvoiceStatus } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';

interface InvoicesTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  onUpdateStatus: (invoiceId: string, newStatus: InvoiceStatus) => void;
}

const StatusSelector: React.FC<{ currentStatus: InvoiceStatus; onChange: (newStatus: InvoiceStatus) => void }> = ({ currentStatus, onChange }) => {
    const statuses: InvoiceStatus[] = ['paid', 'pending', 'not paid'];
    const statusClasses: Record<InvoiceStatus, string> = {
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'not paid': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };

    return (
        <select
            value={currentStatus}
            onChange={(e) => onChange(e.target.value as InvoiceStatus)}
            onClick={(e) => e.stopPropagation()} // Prevent row click from firing
            className={`border border-input rounded-md text-sm p-1 appearance-none ${statusClasses[currentStatus]}`}
        >
            {statuses.map(status => (
                <option key={status} value={status} className="bg-background text-foreground">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
            ))}
        </select>
    );
};


export const InvoicesTable: React.FC<InvoicesTableProps> = ({ invoices, isLoading, onUpdateStatus }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Invoice | null; direction: 'ascending' | 'descending' }>({ key: 'processed_date', direction: 'descending' });
    const itemsPerPage = 10;

    const sortedInvoices = useMemo(() => {
        let sortableItems = [...invoices];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (sortConfig.key === 'vendor') {
                    if (a.vendor.name < b.vendor.name) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (a.vendor.name > b.vendor.name) return sortConfig.direction === 'ascending' ? 1 : -1;
                    return 0;
                }
                
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [invoices, sortConfig]);

    const paginatedInvoices = sortedInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(invoices.length / itemsPerPage);

    const requestSort = (key: keyof Invoice) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const SkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="p-4"><div className="h-4 bg-muted rounded w-24"></div></td>
            <td className="p-4"><div className="h-4 bg-muted rounded w-32"></div></td>
            <td className="p-4"><div className="h-4 bg-muted rounded w-20"></div></td>
            <td className="p-4"><div className="h-4 bg-muted rounded w-24"></div></td>
            <td className="p-4"><div className="h-4 bg-muted rounded w-24"></div></td>
            <td className="p-4"><div className="h-4 bg-muted rounded w-16"></div></td>
        </tr>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Invoices</CardTitle>
                <CardDescription>A complete list of all processed invoices.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                            <tr>
                                <th scope="col" className="px-4 py-3 cursor-pointer" onClick={() => requestSort('invoice_number')}>Invoice #</th>
                                <th scope="col" className="px-4 py-3 cursor-pointer" onClick={() => requestSort('vendor')}>Vendor</th>
                                <th scope="col" className="px-4 py-3 cursor-pointer" onClick={() => requestSort('amount')}>Amount</th>
                                <th scope="col" className="px-4 py-3 cursor-pointer" onClick={() => requestSort('due_date')}>Due Date</th>
                                <th scope="col" className="px-4 py-3 cursor-pointer" onClick={() => requestSort('processed_date')}>Processed</th>
                                <th scope="col" className="px-4 py-3 cursor-pointer" onClick={() => requestSort('status')}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : paginatedInvoices.length > 0 ? (
                                paginatedInvoices.map(invoice => (
                                    <tr key={invoice.id} className="border-b border-border hover:bg-muted/50">
                                        <td className="px-4 py-2 font-medium">{invoice.invoice_number}</td>
                                        <td className="px-4 py-2">{invoice.vendor.name}</td>
                                        <td className="px-4 py-2">{formatCurrency(invoice.amount)}</td>
                                        <td className="px-4 py-2">{invoice.due_date}</td>
                                        <td className="px-4 py-2">{invoice.processed_date}</td>
                                        <td className="px-4 py-2">
                                            <StatusSelector 
                                                currentStatus={invoice.status}
                                                onChange={(newStatus) => onUpdateStatus(invoice.id, newStatus)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-4 text-muted-foreground">No invoices found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {!isLoading && totalPages > 1 && (
                     <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </span>
                        <div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-input bg-background text-sm rounded-md disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="ml-2 px-3 py-1 border border-input bg-background text-sm rounded-md disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
