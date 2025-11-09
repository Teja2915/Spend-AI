
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import type { InvoiceTrendData } from '../../types';
import { formatShortCurrency } from '../../lib/utils';

interface InvoiceTrendChartProps {
  data: InvoiceTrendData[];
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-2 border border-border rounded-md shadow-lg text-popover-foreground">
          <p className="label font-bold">{`${label}`}</p>
          <p className="text-blue-400">{`Value : ${formatShortCurrency(payload[0].value)}`}</p>
          <p className="text-indigo-400">{`Volume : ${payload[1].value}`}</p>
        </div>
      );
    }
  
    return null;
  };
  

export const InvoiceTrendChart: React.FC<InvoiceTrendChartProps> = ({ data, isLoading }) => {
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
        <CardTitle>Invoice Volume + Value Trend</CardTitle>
        <CardDescription>Monthly trend of invoice value and count.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatShortCurrency(value as number)} />
              <YAxis yAxisId="right" orientation="right" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{fontSize: "14px"}}/>
              <Line yAxisId="left" type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} name="Value" dot={{ r: 4 }} activeDot={{ r: 6 }}/>
              <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#818cf8" strokeWidth={2} name="Volume" dot={{ r: 4 }} activeDot={{ r: 6 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
