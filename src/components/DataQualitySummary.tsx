import React from 'react';
import { Rows3, Columns3, AlertTriangle, Copy, Database } from 'lucide-react';
import { Card, CardHeader, CardContent } from './UI';
import type { DatasetStatsData } from './DatasetStats';

interface DataQualitySummaryProps {
  stats: DatasetStatsData;
  fileName: string;
}

interface QualityItem {
  label: string;
  value: number;
  total: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  barColor: string;
  format: (v: number) => string;
}

export function DataQualitySummary({ stats, fileName }: DataQualitySummaryProps) {
  const totalCells = stats.totalRows * stats.totalColumns;
  const missingPercent = totalCells > 0 ? (stats.missingValues / totalCells) * 100 : 0;
  const duplicatePercent = stats.totalRows > 0 ? (stats.duplicateRows / stats.totalRows) * 100 : 0;
  const completeness = 100 - missingPercent;

  const items: QualityItem[] = [
    {
      label: 'Data Completeness',
      value: completeness,
      total: 100,
      icon: Database,
      color: completeness >= 95 ? 'text-emerald-600 dark:text-emerald-400' : completeness >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400',
      bgColor: completeness >= 95 ? 'bg-emerald-50 dark:bg-emerald-950/50' : completeness >= 80 ? 'bg-amber-50 dark:bg-amber-950/50' : 'bg-red-50 dark:bg-red-950/50',
      barColor: completeness >= 95 ? 'bg-emerald-500' : completeness >= 80 ? 'bg-amber-500' : 'bg-red-500',
      format: (v) => `${v.toFixed(1)}%`,
    },
    {
      label: 'Missing Values',
      value: stats.missingValues,
      total: totalCells,
      icon: AlertTriangle,
      color: stats.missingValues === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400',
      bgColor: stats.missingValues === 0 ? 'bg-emerald-50 dark:bg-emerald-950/50' : 'bg-amber-50 dark:bg-amber-950/50',
      barColor: stats.missingValues === 0 ? 'bg-emerald-500' : 'bg-amber-500',
      format: (v) => `${v.toLocaleString()} / ${totalCells.toLocaleString()} cells`,
    },
    {
      label: 'Duplicate Rows',
      value: duplicatePercent,
      total: 100,
      icon: Copy,
      color: stats.duplicateRows === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
      bgColor: stats.duplicateRows === 0 ? 'bg-emerald-50 dark:bg-emerald-950/50' : 'bg-red-50 dark:bg-red-950/50',
      barColor: stats.duplicateRows === 0 ? 'bg-emerald-500' : 'bg-red-500',
      format: () => `${stats.duplicateRows.toLocaleString()} rows (${duplicatePercent.toFixed(1)}%)`,
    },
  ];

  return (
    <Card className="dark:bg-zinc-800 dark:border-zinc-700">
      <CardHeader>
        <h3 className="font-bold flex items-center gap-2 dark:text-zinc-100">
          <Database className="w-4 h-4" />
          Data Quality Summary
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {fileName} &mdash; {stats.totalRows.toLocaleString()} rows &times; {stats.totalColumns.toLocaleString()} columns
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Top stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-750 rounded-lg dark:bg-zinc-900/50">
            <Rows3 className="w-4 h-4 mx-auto mb-1 text-blue-500" />
            <p className="text-lg font-bold dark:text-zinc-100">{stats.totalRows.toLocaleString()}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Rows</p>
          </div>
          <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
            <Columns3 className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
            <p className="text-lg font-bold dark:text-zinc-100">{stats.totalColumns.toLocaleString()}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Columns</p>
          </div>
          <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
            <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-amber-500" />
            <p className="text-lg font-bold dark:text-zinc-100">{stats.missingValues.toLocaleString()}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Missing</p>
          </div>
          <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
            <Copy className="w-4 h-4 mx-auto mb-1 text-red-500" />
            <p className="text-lg font-bold dark:text-zinc-100">{stats.duplicateRows.toLocaleString()}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Duplicates</p>
          </div>
        </div>

        {/* Quality bars */}
        {items.map((item) => {
          const Icon = item.icon;
          const barPercent = item.total > 0 ? Math.min((item.value / item.total) * 100, 100) : 0;

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${item.bgColor}`}>
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  {item.format(item.value)}
                </span>
              </div>
              <div className="h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${item.barColor}`}
                  style={{ width: `${barPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
