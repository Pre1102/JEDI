import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardContent } from './UI';
import type { AuditResults } from '../services/geminiService';

interface MetricComparisonChartProps {
  auditResults: AuditResults;
}

export function MetricComparisonChart({ auditResults }: MetricComparisonChartProps) {
  const fm = auditResults.fairnessMetrics;

  const data = [
    { name: 'Demographic\nParity', score: fm.demographicParity.score, max: 35, status: fm.demographicParity.status },
    { name: 'Equal\nOpportunity', score: fm.equalOpportunity.score, max: 20, status: fm.equalOpportunity.status },
    { name: 'Calibration', score: fm.calibration.score, max: 15, status: fm.calibration.status },
    { name: 'Model\nAccuracy', score: fm.accuracy.score, max: 20, status: fm.accuracy.status },
    { name: 'Explain-\nability', score: fm.explainability.score, max: 10, status: fm.explainability.status },
  ];

  const getBarColor = (status: string) => {
    if (status === 'pass') return '#10b981';
    if (status === 'warning') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Card className="dark:bg-zinc-800 dark:border-zinc-700">
      <CardHeader>
        <h3 className="font-bold flex items-center gap-2 dark:text-zinc-100">
          Metric Score Comparison
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Each metric scored against its maximum possible value
        </p>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#71717a' }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#a1a1aa' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '13px',
              }}
              formatter={(value: number, _name: string, props: any) => {
                const item = props.payload;
                return [`${value} / ${item.max}`, 'Score'];
              }}
            />
            <Bar dataKey="max" radius={[4, 4, 0, 0]} fill="#e4e4e7" name="Max" barSize={32} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} name="Score" barSize={32}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
