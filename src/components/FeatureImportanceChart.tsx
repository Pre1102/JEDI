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
import { BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardContent } from './UI';
import type { FeatureImportance } from '../services/geminiService';

interface FeatureImportanceChartProps {
  features: FeatureImportance[];
  sensitiveAttrs: string[];
}

export function FeatureImportanceChart({ features, sensitiveAttrs }: FeatureImportanceChartProps) {
  // Sort by importance descending
  const sorted = [...features].sort((a, b) => b.importance - a.importance);

  // Custom Y-axis tick that marks sensitive features
  const renderYTick = (props: any) => {
    const { x, y, payload } = props;
    const isSensitive = sensitiveAttrs.includes(payload.value);
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={-4}
          y={0}
          dy={4}
          textAnchor="end"
          fill={isSensitive ? '#ef4444' : '#71717a'}
          fontSize={12}
          fontWeight={isSensitive ? 600 : 400}
        >
          {payload.value}{isSensitive ? ' (S)' : ''}
        </text>
      </g>
    );
  };

  return (
    <Card className="dark:bg-zinc-800 dark:border-zinc-700">
      <CardHeader>
        <h3 className="font-bold flex items-center gap-2 dark:text-zinc-100">
          <BarChart3 className="w-4 h-4" />
          Global Feature Importance
        </h3>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sorted} layout="vertical" margin={{ left: 50, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e4e7" />
            <XAxis
              type="number"
              domain={[0, 'auto']}
              tickFormatter={(val: number) => `${(val * 100).toFixed(0)}%`}
              fontSize={11}
              stroke="#a1a1aa"
            />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              width={120}
              tick={renderYTick}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '13px',
              }}
              formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Importance']}
            />
            <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
              {sorted.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={sensitiveAttrs.includes(entry.name) ? '#ef4444' : '#18181b'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-zinc-900 dark:bg-zinc-300 rounded-sm" />
            <span>Regular Feature</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-sm" />
            <span>Sensitive Attribute (S)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
