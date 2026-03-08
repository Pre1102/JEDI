import React from 'react';
import { FileText } from 'lucide-react';
import { Badge } from './UI';

interface DataPreviewProps {
  headers: string[];
  data: Record<string, any>[];
}

export function DataPreview({ headers, data }: DataPreviewProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-400 dark:text-zinc-500">
        <FileText className="w-12 h-12 mb-2 opacity-20" />
        <p>No data uploaded yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-zinc-100 dark:border-zinc-700 px-6 py-4 flex justify-between items-center">
        <h3 className="font-bold dark:text-zinc-100">Dataset Preview</h3>
        <Badge>{data.length} rows loaded</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium border-b border-zinc-100 dark:border-zinc-700">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                {headers.map((h) => (
                  <td key={h} className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                    {row[h]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
