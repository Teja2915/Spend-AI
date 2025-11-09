
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatCurrency, formatNumber } from '../../lib/utils';

interface OverviewCardProps {
  title: string;
  value: number;
  isCurrency?: boolean;
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, isCurrency = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {isCurrency ? formatCurrency(value) : formatNumber(value)}
        </div>
      </CardContent>
    </Card>
  );
};

export const SkeletonCard: React.FC = () => {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 w-3/4 bg-muted rounded-md animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-1/2 bg-muted rounded-md animate-pulse"></div>
        </CardContent>
      </Card>
    );
};
