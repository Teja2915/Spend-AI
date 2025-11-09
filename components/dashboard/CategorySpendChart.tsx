
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import type { CategorySpendData } from '../../types';
import { formatShortCurrency } from '../../lib/utils';

interface CategorySpendChartProps {
    data: CategorySpendData[];
    isLoading: boolean;
}

const COLORS = ['#3b82f6', '#818cf8', '#a78bfa', '#f472b6', '#fb923c', '#a3e635', '#2dd4bf', '#60a5fa'];


const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-2 border border-border rounded-md shadow-lg text-popover-foreground">
          <p className="label font-bold">{`${payload[0].name}`}</p>
          <p className="text-blue-400">{`Spend : ${formatShortCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
};

export const CategorySpendChart: React.FC<CategorySpendChartProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return (
          <Card className="h-[400px]">
            <CardHeader>
              <div className="h-5 w-1/3 bg-muted rounded-md animate-pulse mb-2"></div>
              <div className="h-4 w-1/2 bg-muted rounded-md animate-pulse"></div>
            </CardHeader>
            <CardContent>
                <div className="h-[280px] w-full bg-muted rounded-full animate-pulse"></div>
            </CardContent>
          </Card>
        );
      }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Category</CardTitle>
        <CardDescription>Breakdown of spend across different categories.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={5}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{fontSize: "12px", overflow: "auto", maxHeight: 100}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
