
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import type { CashOutflowData } from '../../types';
import { formatShortCurrency } from '../../lib/utils';

interface CashOutflowChartProps {
    data: CashOutflowData[];
    isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-2 border border-border rounded-md shadow-lg text-popover-foreground">
          <p className="label font-bold">{`${label}`}</p>
          <p className="text-blue-400">{`Outflow : ${formatShortCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

export const CashOutflowChart: React.FC<CashOutflowChartProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return (
          <Card className="h-[400px]">
            <CardHeader>
              <div className="h-5 w-1/3 bg-muted rounded-md animate-pulse mb-2"></div>
              <div className="h-4 w-1/2 bg-muted rounded-md animate-pulse"></div>
            </CardHeader>
            <CardContent>
                <div className="h-[280px] w-full bg-muted rounded-md animate-pulse"></div>
            </CardContent>
          </Card>
        );
      }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Outflow Forecast</CardTitle>
        <CardDescription>Upcoming payments based on invoice due dates.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
              <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}/>
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatShortCurrency(value as number)}/>
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}/>
              <Bar dataKey="amount" fill="#818cf8" radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
