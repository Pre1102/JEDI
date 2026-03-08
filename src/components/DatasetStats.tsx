import React from 'react';
import { Rows3, Columns3, AlertTriangle, Copy } from 'lucide-react';
import { Card } from './UI';

export interface DatasetStatsData {
  totalRows: number;
  totalColumns: number;
  missingValues: number;
  duplicateRows: number;
}
// statics
interface DatasetStatsProps {
  stats: DatasetStatsData;
}

export function DatasetStats({ stats }: DatasetStatsProps) {
  const items = [
    {
      label: 'Total Rows',
      value: stats.totalRows.toLocaleString(),
      icon: Rows3,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/50',
    },
    {
      label: 'Total Columns',
      value: stats.totalColumns.toLocaleString(),
      icon: Columns3,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      label: 'Missing Values',
      value: stats.missingValues.toLocaleString(),
      icon: AlertTriangle,
      color: stats.missingValues > 0
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-emerald-600 dark:text-emerald-400',
      bg: stats.missingValues > 0
        ? 'bg-amber-50 dark:bg-amber-950/50'
        : 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      label: 'Duplicate Rows',
      value: stats.duplicateRows.toLocaleString(),
      icon: Copy,
      color: stats.duplicateRows > 0
        ? 'text-red-600 dark:text-red-400'
        : 'text-emerald-600 dark:text-emerald-400',
      bg: stats.duplicateRows > 0
        ? 'bg-red-50 dark:bg-red-950/50'
        : 'bg-emerald-50 dark:bg-emerald-950/50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => (
        <Card
          key={item.label}
          className="p-3 flex items-center gap-3 dark:bg-zinc-800 dark:border-zinc-700"
        >
          <div className={`${item.bg} p-2 rounded-lg`}>
            <item.icon className={`w-4 h-4 ${item.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{item.label}</p>
            <p className="text-lg font-bold dark:text-zinc-100 leading-tight">{item.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ── Stats computation utility ──────────────────────────────────────────

export function computeDatasetStats(
  allData: Record<string, any>[],
  headers: string[],
): DatasetStatsData {
  const totalRows = allData.length;
  const totalColumns = headers.length;

  // Count missing values
  let missingValues = 0;
  for (const row of allData) {
    for (const h of headers) {
      const val = row[h];
      if (
        val === undefined ||
        val === null ||
        val === '' ||
        val === 'NA' ||
        val === 'NaN' ||
        val === 'null' ||
        val === 'undefined'
      ) {
        missingValues++;
      }
    }
  }

  // Count duplicate rows
  const seen = new Map<string, number>();
  for (const row of allData) {
    const key = headers.map((h) => String(row[h] ?? '')).join('\x00');
    seen.set(key, (seen.get(key) || 0) + 1);
  }
  let duplicateRows = 0;
  for (const count of seen.values()) {
    if (count > 1) {
      duplicateRows += count - 1; // count extras only
    }
  }

  return { totalRows, totalColumns, missingValues, duplicateRows };
}
