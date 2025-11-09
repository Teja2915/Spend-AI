
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import type { VendorSpendData } from '../../types';
import { formatShortCurrency } from '../../lib/utils';


interface VendorSpendChartProps {
    data: VendorSpendData[];
    isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-2 border border-border rounded-md shadow-lg text-popover-foreground">
          <p className="label font-bold">{`${label}`}</p>
          <p className="text-blue-400">{`Spend : ${formatShortCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

export const VendorSpendChart: React.FC<VendorSpendChartProps> = ({ data, isLoading }) => {
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
        <CardTitle>Spend by Vendor</CardTitle>
        <CardDescription>Top 10 vendors by total spend.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} horizontal={false} />
              <XAxis type="number" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatShortCurrency(value as number)} />
              <YAxis type="category" dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} width={120} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}/>
              <Bar dataKey="spend" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
