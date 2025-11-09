
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface ResultDisplayProps {
  sql?: string;
  data?: Record<string, any>[];
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ sql, data }) => {
  if (!sql || !data) return null;

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">Generated SQL</h4>
        <pre className="bg-background/50 p-3 rounded-md text-sm overflow-x-auto">
          <code>{sql}</code>
        </pre>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Results</h4>
        {data.length > 0 ? (
          <div className="overflow-auto max-h-64 border border-border rounded-md">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-background/50 sticky top-0">
                <tr>
                  {headers.map((header) => (
                    <th key={header} scope="col" className="px-4 py-2">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {headers.map((header) => (
                      <td key={header} className="px-4 py-2">
                        {String(row[header])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Query returned no results.</p>
        )}
      </div>
    </div>
  );
};
